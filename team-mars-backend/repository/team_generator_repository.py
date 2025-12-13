"""
Team Generator Repository Module.
This module provides data access layer for team generation operations.
Handles bulk operations and team-player assignments.
"""

from typing import List, Optional
from uuid import UUID
from sqlalchemy import select, delete, and_
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from repository.models.player import Player
from repository.models.team import Team
from repository.models.team_player import TeamPlayer
from model.team_player.team_player import TeamPlayerCreate


class TeamGeneratorRepository:
    """Repository for team generator operations"""

    # PLAYER QUERIES

    async def get_all_players(self, db: AsyncSession) -> List[Player]:
        """Get all players from database"""
        result = await db.execute(
            select(Player).order_by(Player.skill_level.desc().nullslast())
        )
        return result.scalars().all()

    async def get_players_by_ids(
        self, db: AsyncSession, player_ids: List[UUID]
    ) -> List[Player]:
        """Get specific players by IDs"""
        result = await db.execute(
            select(Player)
            .where(Player.player_id.in_(player_ids))
            .order_by(Player.skill_level.desc().nullslast())
        )
        return result.scalars().all()

    async def get_unassigned_players(
        self, db: AsyncSession, league_id: Optional[UUID] = None
    ) -> List[Player]:
        """Get players not currently assigned to any team"""
        # Subquery for players with active team assignments
        active_assignments = select(TeamPlayer.player_id).where(
            TeamPlayer.leave_date.is_(None)
        )

        if league_id:
            # Only check assignments in specific league
            active_assignments = active_assignments.join(
                Team, TeamPlayer.team_id == Team.team_id
            ).where(Team.league_id == league_id)

        # Get players not in active assignments
        result = await db.execute(
            select(Player)
            .where(Player.player_id.not_in(active_assignments))
            .order_by(Player.skill_level.desc().nullslast())
        )
        return result.scalars().all()

    # TEAM QUERIES

    async def get_teams_by_league(
        self, db: AsyncSession, league_id: UUID, limit: Optional[int] = None
    ) -> List[Team]:
        """Get all teams in a league"""
        query = select(Team).where(Team.league_id == league_id)

        if limit:
            query = query.limit(limit)

        result = await db.execute(query)
        return result.scalars().all()

    async def get_team_with_players(
        self, db: AsyncSession, team_id: UUID
    ) -> Optional[Team]:
        """Get team with its current players"""
        result = await db.execute(
            select(Team)
            .options(selectinload(Team.team_players))
            .where(Team.team_id == team_id)
        )
        return result.scalars().first()

    # TEAM PLAYER QUERIES

    async def get_active_assignments_by_league(
        self, db: AsyncSession, league_id: UUID
    ) -> List[TeamPlayer]:
        """Get all active team-player assignments in a league"""
        result = await db.execute(
            select(TeamPlayer)
            .join(Team, TeamPlayer.team_id == Team.team_id)
            .where(and_(Team.league_id == league_id, TeamPlayer.leave_date.is_(None)))
            .options(selectinload(TeamPlayer.player), selectinload(TeamPlayer.team))
        )
        return result.scalars().all()

    async def get_active_assignments_by_team(
        self, db: AsyncSession, team_id: UUID
    ) -> List[TeamPlayer]:
        """Get all active player assignments for a team"""
        result = await db.execute(
            select(TeamPlayer)
            .where(and_(TeamPlayer.team_id == team_id, TeamPlayer.leave_date.is_(None)))
            .options(selectinload(TeamPlayer.player))
        )
        return result.scalars().all()

    # BULK OPERATIONS

    async def bulk_create_assignments(
        self, db: AsyncSession, assignments: List[TeamPlayerCreate]
    ) -> List[TeamPlayer]:
        """Bulk create team-player assignments"""
        team_players = []

        for assignment in assignments:
            team_player = TeamPlayer(**assignment.model_dump())
            db.add(team_player)
            team_players.append(team_player)

        await db.flush()  # Flush to get IDs without committing
        return team_players

    async def clear_assignments_by_league(
        self, db: AsyncSession, league_id: UUID
    ) -> int:
        """
        Clear all team-player assignments for teams in a league.
        Returns number of assignments deleted.
        """
        # Get all team IDs in the league
        team_result = await db.execute(
            select(Team.team_id).where(Team.league_id == league_id)
        )
        team_ids = [row[0] for row in team_result.all()]

        if not team_ids:
            return 0

        # Delete all team_player records for these teams
        result = await db.execute(
            delete(TeamPlayer).where(TeamPlayer.team_id.in_(team_ids))
        )

        return result.rowcount

    async def clear_assignments_by_team(self, db: AsyncSession, team_id: UUID) -> int:
        """
        Clear all player assignments for a specific team.
        Returns number of assignments deleted.
        """
        result = await db.execute(
            delete(TeamPlayer).where(TeamPlayer.team_id == team_id)
        )
        return result.rowcount

    async def clear_assignments_by_teams(
        self, db: AsyncSession, team_ids: List[UUID]
    ) -> int:
        """
        Clear all player assignments for multiple teams.
        Returns number of assignments deleted.
        """
        if not team_ids:
            return 0

        result = await db.execute(
            delete(TeamPlayer).where(TeamPlayer.team_id.in_(team_ids))
        )
        return result.rowcount

    # VALIDATION QUERIES

    async def check_player_league_assignment(
        self, db: AsyncSession, player_id: UUID, league_id: UUID
    ) -> Optional[TeamPlayer]:
        """
        Check if a player is already assigned to a team in a specific league

        Args:
            db: Database session
            player_id: Player ID to check
            league_id: League ID to check

        Returns:
            TeamPlayer if assigned, None if not assigned
        """
        result = await db.execute(
            select(TeamPlayer)
            .join(Team, TeamPlayer.team_id == Team.team_id)
            .where(
                and_(
                    TeamPlayer.player_id == player_id,
                    Team.league_id == league_id,
                    TeamPlayer.leave_date.is_(None),
                )
            )
            .options(selectinload(TeamPlayer.team), selectinload(TeamPlayer.player))
        )
        return result.scalars().first()

    async def get_duplicate_assignments_in_league(
        self, db: AsyncSession, league_id: UUID
    ) -> List[dict]:
        """
        Find players assigned to multiple teams in the same league

        Args:
            db: Database session
            league_id: League ID to check

        Returns:
            List of dicts with player info and their teams
        """
        # Get all active assignments in league
        assignments = await self.get_active_assignments_by_league(db, league_id)

        # Group by player_id
        player_teams = {}
        for assignment in assignments:
            player_id = assignment.player_id
            if player_id not in player_teams:
                player_teams[player_id] = []
            player_teams[player_id].append(
                {
                    "team_id": assignment.team_id,
                    "team_name": (
                        assignment.team.team_name if assignment.team else "Unknown"
                    ),
                    "player_name": (
                        assignment.player.first_name if assignment.player else "Unknown"
                    ),
                }
            )

        # Find duplicates
        duplicates = []
        for player_id, teams in player_teams.items():
            if len(teams) > 1:
                duplicates.append(
                    {
                        "player_id": player_id,
                        "player_name": teams[0]["player_name"],
                        "teams": teams,
                    }
                )

        return duplicates

    # STATISTICS

    async def get_league_stats(self, db: AsyncSession, league_id: UUID) -> dict:
        """Get statistics for a league"""
        # Get teams count
        teams_result = await db.execute(select(Team).where(Team.league_id == league_id))
        teams = teams_result.scalars().all()

        # Get active assignments
        assignments = await self.get_active_assignments_by_league(db, league_id)

        # Calculate stats
        total_players = len(set(a.player_id for a in assignments))
        teams_with_players = len(set(a.team_id for a in assignments))

        # Position breakdown
        position_count = {}
        for assignment in assignments:
            if assignment.position:
                position_count[assignment.position] = (
                    position_count.get(assignment.position, 0) + 1
                )

        # Skill level breakdown
        skill_count = {}
        for assignment in assignments:
            if assignment.player and assignment.player.skill_level:
                level = assignment.player.skill_level
                skill_count[level] = skill_count.get(level, 0) + 1

        return {
            "total_teams": len(teams),
            "teams_with_players": teams_with_players,
            "total_players_assigned": total_players,
            "total_assignments": len(assignments),
            "position_breakdown": position_count,
            "skill_level_breakdown": skill_count,
            "average_players_per_team": (
                total_players / teams_with_players if teams_with_players > 0 else 0
            ),
        }

    async def get_team_balance_metrics(self, db: AsyncSession, league_id: UUID) -> dict:
        """Get team balance metrics for a league"""
        teams = await self.get_teams_by_league(db, league_id)

        team_metrics = []
        for team in teams:
            assignments = await self.get_active_assignments_by_team(db, team.team_id)

            if not assignments:
                continue

            # Calculate average skill
            skills = [
                a.player.skill_level
                for a in assignments
                if a.player and a.player.skill_level
            ]
            avg_skill = sum(skills) / len(skills) if skills else 0

            # Position breakdown
            positions = {}
            for a in assignments:
                if a.position:
                    positions[a.position] = positions.get(a.position, 0) + 1

            team_metrics.append(
                {
                    "team_id": team.team_id,
                    "team_name": team.team_name,
                    "player_count": len(assignments),
                    "average_skill_level": round(avg_skill, 2),
                    "positions": positions,
                }
            )

        # Calculate variance in skill levels
        if team_metrics:
            avg_skills = [t["average_skill_level"] for t in team_metrics]
            mean = sum(avg_skills) / len(avg_skills)
            variance = sum((x - mean) ** 2 for x in avg_skills) / len(avg_skills)
        else:
            variance = 0

        return {
            "teams": team_metrics,
            "skill_balance_variance": round(variance, 3),
            "is_balanced": variance < 0.5,
        }
