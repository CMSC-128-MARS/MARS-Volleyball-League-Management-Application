"""
Team Generator Use Case
Orchestrates team generation and player assignment
"""

from typing import List
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession

from model.team_generator.team_generator import (
    TeamGenerationConfig,
    TeamGenerationRequest,
    TeamGenerationResult,
)
from model.team_player.team_player import TeamPlayerCreate
from service.team_generator_service import TeamGeneratorService
from repository.team_generator_repository import TeamGeneratorRepository
from constants.logger import logger


class TeamGeneratorUseCase:
    """Use case for team generation operations"""

    def __init__(self, service: TeamGeneratorService, repo: TeamGeneratorRepository):
        self.service = service
        self.repo = repo

    async def preview_generation(
        self, session: AsyncSession, request: TeamGenerationRequest
    ) -> TeamGenerationResult:
        """
        Preview team generation without saving to database

        Args:
            session: Database session
            request: Team generation request

        Returns:
            TeamGenerationResult with preview data
        """
        logger.info(
            "Previewing team generation for league %s", request.config.league_id
        )

        result = await self.service.generate_teams(
            session=session,
            config=request.config,
            player_ids=request.player_ids,
            unassigned_only=False,
        )

        logger.info(
            "Preview complete: %s teams, %s players assigned, balance score: %s",
            len(result.teams),
            result.total_players_assigned,
            result.skill_balance_score,
        )

        return result

    async def generate_and_assign_teams(
        self,
        session: AsyncSession,
        request: TeamGenerationRequest,
        clear_existing: bool = False,
    ) -> TeamGenerationResult:
        """
        Generate teams and automatically assign players

        Args:
            session: Database session
            request: Team generation request
            clear_existing: Whether to remove existing team assignments first

        Returns:
            TeamGenerationResult with assignment details
        """
        logger.info(
            "Generating teams for league %s: num_teams=%s, players_per_team=%s, clear_existing=%s",
            request.config.league_id,
            request.config.num_teams,
            request.config.players_per_team,
            clear_existing,
        )

        # Step 1: Clear existing assignments if requested
        if clear_existing:
            logger.info(
                "Clearing existing assignments for league %s", request.config.league_id
            )
            deleted_count = await self.repo.clear_assignments_by_league(
                session, request.config.league_id
            )
            logger.info("Cleared %s existing assignments", deleted_count)

        # Step 2: Generate teams
        result = await self.service.generate_teams(
            session=session,
            config=request.config,
            player_ids=request.player_ids,
            unassigned_only=not clear_existing,  # Only use unassigned if not clearing
        )

        if not result.teams:
            logger.warning("No teams generated")
            return result

        # Step 3: Create team-player assignments
        assignments = []
        for team in result.teams:
            for member in team.members:
                assignments.append(
                    TeamPlayerCreate(
                        team_id=team.team_id,
                        player_id=member.player_id,
                        position=member.position,
                    )
                )

        # Step 4: Bulk insert assignments
        if assignments:
            logger.info("Creating %s team-player assignments", len(assignments))
            try:
                await self.repo.bulk_create_assignments(session, assignments)
                await session.commit()
                logger.info("Successfully created all assignments")
            except Exception as e:
                logger.error("Failed to create assignments: %s", str(e))
                await session.rollback()
                result.warnings.append(f"Failed to save assignments: {str(e)}")
                raise

        logger.info("Team generation and assignment complete")
        return result

    async def regenerate_teams_for_league(
        self, session: AsyncSession, league_id: UUID, config: TeamGenerationConfig
    ) -> TeamGenerationResult:
        """
        Regenerate all teams for a league (clears existing and reassigns)

        Args:
            session: Database session
            league_id: League to regenerate teams for
            config: Generation configuration

        Returns:
            TeamGenerationResult
        """
        logger.info("Regenerating teams for league %s", league_id)

        config.league_id = league_id

        request = TeamGenerationRequest(
            config=config,
            player_ids=None,  # Use all available players
            create_new_teams=False,
        )

        return await self.generate_and_assign_teams(
            session, request, clear_existing=True
        )

    async def get_league_statistics(
        self, session: AsyncSession, league_id: UUID
    ) -> dict:
        """
        Get statistics about team composition in a league

        Args:
            session: Database session
            league_id: League ID

        Returns:
            Dictionary with league statistics
        """
        logger.info("Fetching statistics for league %s", league_id)

        stats = await self.repo.get_league_stats(session, league_id)
        balance_metrics = await self.repo.get_team_balance_metrics(session, league_id)

        return {"league_stats": stats, "balance_metrics": balance_metrics}

    async def clear_league_assignments(
        self, session: AsyncSession, league_id: UUID
    ) -> int:
        """
        Clear all team assignments for a league

        Args:
            session: Database session
            league_id: League ID

        Returns:
            Number of assignments deleted
        """
        logger.info("Clearing all assignments for league %s", league_id)

        deleted_count = await self.repo.clear_assignments_by_league(session, league_id)
        await session.commit()

        logger.info("Cleared %s assignments from league %s", deleted_count, league_id)
        return deleted_count

    async def assign_specific_players_to_teams(
        self,
        session: AsyncSession,
        league_id: UUID,
        team_player_map: dict[UUID, List[UUID]],
    ) -> int:
        """
        Manually assign specific players to specific teams

        Args:
            session: Database session
            league_id: League ID
            team_player_map: Dict mapping team_id to list of player_ids

        Returns:
            Number of assignments created
        """
        logger.info("Manually assigning players to teams in league %s", league_id)

        assignments = []
        for team_id, player_ids in team_player_map.items():
            for player_id in player_ids:
                assignments.append(
                    TeamPlayerCreate(
                        team_id=team_id,
                        player_id=player_id,
                        position=None,  # Will need to be set separately
                    )
                )

        if assignments:
            await self.repo.bulk_create_assignments(session, assignments)
            await session.commit()
            logger.info("Created %s manual assignments", len(assignments))

        return len(assignments)

    async def rebalance_specific_teams(
        self,
        session: AsyncSession,
        league_id: UUID,
        team_ids: List[UUID],
        config: TeamGenerationConfig,
    ) -> TeamGenerationResult:
        """
        Rebalance only specific teams in a league

        Args:
            session: Database session
            league_id: League ID
            team_ids: Specific team IDs to rebalance
            config: Generation configuration

        Returns:
            TeamGenerationResult
        """
        logger.info("Rebalancing %s teams in league %s", len(team_ids), league_id)

        # Clear assignments for these specific teams
        deleted = await self.repo.clear_assignments_by_teams(session, team_ids)
        logger.info("Cleared %s assignments from specified teams", deleted)

        # Generate using only these teams
        config.league_id = league_id
        config.num_teams = len(team_ids)

        # Get players that were on these teams (now unassigned)
        players = await self.service.get_available_players(
            session, player_ids=None, unassigned_only=True, league_id=league_id
        )

        player_ids = [p.player_id for p in players]

        request = TeamGenerationRequest(
            config=config, player_ids=player_ids, create_new_teams=False
        )

        return await self.generate_and_assign_teams(
            session, request, clear_existing=False
        )
