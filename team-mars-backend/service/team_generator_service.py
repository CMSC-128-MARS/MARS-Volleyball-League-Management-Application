"""
Team Generator Service
Business logic for auto-generating balanced volleyball teams
"""

from typing import List, Dict, Tuple, Optional
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from collections import defaultdict

from model.team_generator.team_generator import (
    TeamGenerationConfig,
    PlayerForGeneration,
    GeneratedTeam,
    GeneratedTeamMember,
    TeamGenerationResult,
    PositionRequirement,
)
from repository.team_generator_repository import TeamGeneratorRepository
from repository.models.player import Player
from repository.models.team import Team
from constants.logger import logger


class TeamGeneratorService:
    """Service for generating balanced teams"""

    def __init__(self, repo: TeamGeneratorRepository):
        self.repo = repo

        # Position priority for distribution (lower number = higher priority)
        self.position_priority = {
            "Setter": 1,
            "Opposite Hitter": 2,
            "Middle Blocker": 3,
            "Outside Hitter": 4,
            "Libero": 5,
        }

    # ============= CONVERSION METHODS =============

    def _convert_players_to_generation_format(
        self, players: List[Player]
    ) -> List[PlayerForGeneration]:
        """Convert SQLAlchemy Player models to PlayerForGeneration"""
        return [
            PlayerForGeneration(
                player_id=p.player_id,
                player_name=f"{p.first_name} {p.last_name or ''}".strip(),
                skill_level=p.skill_level or 3,  # Default to 3 if not set
                position=p.default_position or "Outside Hitter",  # Default position
            )
            for p in players
        ]

    def _convert_teams_to_generation_format(
        self, teams: List[Team]
    ) -> List[GeneratedTeam]:
        """Convert SQLAlchemy Team models to GeneratedTeam"""
        return [
            GeneratedTeam(
                team_id=team.team_id,
                team_name=team.team_name,
                league_id=team.league_id,
                members=[],
            )
            for team in teams
        ]

    # ============= PLAYER FETCHING =============

    async def get_available_players(
        self,
        session: AsyncSession,
        player_ids: Optional[List[UUID]] = None,
        unassigned_only: bool = False,
        league_id: Optional[UUID] = None,
    ) -> List[PlayerForGeneration]:
        """
        Fetch available players from database

        Args:
            session: Database session
            player_ids: Specific player IDs to fetch (None = all)
            unassigned_only: Only get players not assigned to teams
            league_id: Filter unassigned players by league

        Returns:
            List of PlayerForGeneration objects
        """
        logger.info(
            "Fetching players: player_ids=%s, unassigned_only=%s, league_id=%s",
            len(player_ids) if player_ids else "all",
            unassigned_only,
            league_id,
        )

        if unassigned_only:
            players = await self.repo.get_unassigned_players(session, league_id)
        elif player_ids:
            players = await self.repo.get_players_by_ids(session, player_ids)
        else:
            players = await self.repo.get_all_players(session)

        logger.info("Found %s players", len(players))
        return self._convert_players_to_generation_format(players)

    # ============= TEAM FETCHING =============

    async def get_existing_teams(
        self, session: AsyncSession, league_id: UUID, num_teams: int
    ) -> List[GeneratedTeam]:
        """
        Get existing teams from a league

        Args:
            session: Database session
            league_id: League ID
            num_teams: Number of teams needed

        Returns:
            List of GeneratedTeam objects
        """
        logger.info("Fetching %s teams from league %s", num_teams, league_id)

        teams = await self.repo.get_teams_by_league(session, league_id, limit=num_teams)

        logger.info("Found %s teams", len(teams))
        return self._convert_teams_to_generation_format(teams)

    # ============= SORTING AND GROUPING =============

    def sort_players_by_skill_and_position(
        self, players: List[PlayerForGeneration]
    ) -> List[PlayerForGeneration]:
        """
        Sort players by skill level (descending) and position priority

        Higher skill players come first.
        Within same skill level, positions are ordered by priority.

        Args:
            players: List of players to sort

        Returns:
            Sorted list of players
        """
        return sorted(
            players,
            key=lambda p: (
                -p.skill_level,  # Higher skill first (negative for descending)
                self.position_priority.get(p.position, 99),  # Position priority
            ),
        )

    def group_players_by_position(
        self, players: List[PlayerForGeneration]
    ) -> Dict[str, List[PlayerForGeneration]]:
        """
        Group players by their positions

        Each position group is sorted by skill level (highest first)

        Args:
            players: List of players to group

        Returns:
            Dictionary mapping position to list of players
        """
        grouped = defaultdict(list)
        for player in players:
            grouped[player.position].append(player)

        # Sort each position group by skill level (descending)
        for position in grouped:
            grouped[position] = sorted(grouped[position], key=lambda p: -p.skill_level)

        return dict(grouped)

    # ============= VALIDATION =============

    def validate_position_requirements(
        self, team: GeneratedTeam, requirements: List[PositionRequirement]
    ) -> Tuple[bool, List[str]]:
        """
        Validate if a team meets position requirements

        Args:
            team: Team to validate
            requirements: Position requirements to check

        Returns:
            Tuple of (is_valid, list_of_issues)
        """
        issues = []
        position_counts = team.position_breakdown

        for req in requirements:
            count = position_counts.get(req.position, 0)

            if count < req.min_count:
                issues.append(
                    f"{team.team_name}: Need {req.min_count} {req.position}(s), "
                    f"has only {count}"
                )

            if count > req.max_count:
                issues.append(
                    f"{team.team_name}: Maximum {req.max_count} {req.position}(s), "
                    f"has {count}"
                )

        return len(issues) == 0, issues

    def calculate_team_balance_score(self, teams: List[GeneratedTeam]) -> float:
        """
        Calculate balance score for teams (variance in average skill)

        Lower score means better balance.

        Args:
            teams: List of teams to analyze

        Returns:
            Balance score (variance)
        """
        if not teams:
            return 0.0

        avg_skills = [team.average_skill_level for team in teams if team.members]

        if not avg_skills:
            return 0.0

        mean = sum(avg_skills) / len(avg_skills)
        variance = sum((x - mean) ** 2 for x in avg_skills) / len(avg_skills)

        return round(variance, 3)

    # ============= SNAKE DRAFT ALGORITHM =============

    def generate_snake_pattern(self, num_teams: int, num_rounds: int) -> List[int]:
        """
        Generate snake draft picking order

        Example for 4 teams, 3 rounds:
        Round 1: 0, 1, 2, 3
        Round 2: 3, 2, 1, 0
        Round 3: 0, 1, 2, 3

        Args:
            num_teams: Number of teams
            num_rounds: Number of rounds

        Returns:
            List of team indices in picking order
        """
        team_order = []

        for round_num in range(num_rounds):
            if round_num % 2 == 0:
                # Forward: 0, 1, 2, 3
                team_order.extend(range(num_teams))
            else:
                # Backward: 3, 2, 1, 0
                team_order.extend(range(num_teams - 1, -1, -1))

        return team_order

    def distribute_position_minimum_requirements(
        self,
        teams: List[GeneratedTeam],
        players_by_position: Dict[str, List[PlayerForGeneration]],
        requirements: List[PositionRequirement],
    ) -> List[str]:
        """
        First pass: Ensure each team gets minimum required players per position

        Args:
            teams: Teams to assign to
            players_by_position: Players grouped by position
            requirements: Position requirements

        Returns:
            List of warnings
        """
        warnings = []

        for req in requirements:
            position = req.position
            min_count = req.min_count

            available_players = players_by_position.get(position, [])

            if not available_players and min_count > 0:
                warnings.append(f"No {position} players available")
                continue

            # Check if we have enough players
            total_needed = len(teams) * min_count
            if len(available_players) < total_needed:
                warnings.append(
                    f"Not enough {position} players. Need {total_needed}, "
                    f"have {len(available_players)}"
                )

            # Assign minimum to each team
            for team in teams:
                current_count = sum(1 for m in team.members if m.position == position)

                while current_count < min_count and available_players:
                    player = available_players.pop(0)
                    team.members.append(
                        GeneratedTeamMember(
                            player_id=player.player_id,
                            player_name=player.player_name,
                            skill_level=player.skill_level,
                            position=player.position,
                        )
                    )
                    current_count += 1

        return warnings

    def distribute_remaining_players_snake(
        self,
        teams: List[GeneratedTeam],
        players_by_position: Dict[str, List[PlayerForGeneration]],
        requirements: List[PositionRequirement],
        max_players_per_team: int,
    ) -> Tuple[List[PlayerForGeneration], List[str]]:
        """
        Second pass: Distribute remaining players using snake draft

        Args:
            teams: Teams to assign to
            players_by_position: Players grouped by position
            requirements: Position requirements (for max limits)
            max_players_per_team: Maximum players per team

        Returns:
            Tuple of (unassigned_players, warnings)
        """
        warnings = []
        unassigned = []

        num_teams = len(teams)
        team_order = self.generate_snake_pattern(num_teams, max_players_per_team)
        pick_index = 0

        # Position order for distribution
        position_order = [
            "Setter",
            "Opposite Hitter",
            "Middle Blocker",
            "Outside Hitter",
            "Libero",
        ]

        # Distribute each position
        for position in position_order:
            available_players = players_by_position.get(position, [])

            if not available_players:
                continue

            # Get position limits
            pos_req = next((r for r in requirements if r.position == position), None)
            max_per_team = pos_req.max_count if pos_req else 99

            # Snake draft
            while available_players and pick_index < len(team_order):
                team_idx = team_order[pick_index]
                team = teams[team_idx]

                # Check if team can accept this position
                current_count = sum(1 for m in team.members if m.position == position)

                # Check both position limit and team size limit
                if (
                    current_count < max_per_team
                    and len(team.members) < max_players_per_team
                ):
                    player = available_players.pop(0)
                    team.members.append(
                        GeneratedTeamMember(
                            player_id=player.player_id,
                            player_name=player.player_name,
                            skill_level=player.skill_level,
                            position=player.position,
                        )
                    )

                pick_index += 1

            # Add remaining players to unassigned
            if available_players:
                unassigned.extend(available_players)
                warnings.append(
                    f"{len(available_players)} {position} player(s) could not be assigned"
                )

        return unassigned, warnings

    def snake_draft_distribute(
        self,
        players: List[PlayerForGeneration],
        teams: List[GeneratedTeam],
        config: TeamGenerationConfig,
    ) -> Tuple[List[GeneratedTeam], List[PlayerForGeneration], List[str]]:
        """
        Main distribution method using snake draft

        Two-phase approach:
        1. Ensure minimum requirements for each position
        2. Snake draft remaining players

        Args:
            players: All players to distribute
            teams: Teams to assign to
            config: Generation configuration

        Returns:
            Tuple of (teams_with_members, unassigned_players, warnings)
        """
        logger.info(
            "Starting snake draft: %s players, %s teams", len(players), len(teams)
        )

        warnings = []

        # Group players by position
        players_by_position = self.group_players_by_position(players)

        logger.info(
            "Players by position: %s",
            {pos: len(plrs) for pos, plrs in players_by_position.items()},
        )

        # Phase 1: Minimum requirements
        min_warnings = self.distribute_position_minimum_requirements(
            teams, players_by_position, config.position_requirements
        )
        warnings.extend(min_warnings)

        # Phase 2: Snake draft remaining
        unassigned, snake_warnings = self.distribute_remaining_players_snake(
            teams,
            players_by_position,
            config.position_requirements,
            config.players_per_team,
        )
        warnings.extend(snake_warnings)

        # Validate teams
        for i, team in enumerate(teams, 1):
            is_valid, issues = self.validate_position_requirements(
                team, config.position_requirements
            )

            if not is_valid:
                warnings.extend(issues)

            if len(team.members) < config.players_per_team:
                warnings.append(
                    f"Team {i} ({team.team_name}) has only {len(team.members)} players "
                    f"(target: {config.players_per_team})"
                )

            logger.info(
                "Team %s: %s players, avg skill: %s, positions: %s",
                team.team_name,
                len(team.members),
                team.average_skill_level,
                team.position_breakdown,
            )

        return teams, unassigned, warnings

    # ============= MAIN GENERATION METHOD =============

    async def generate_teams(
        self,
        session: AsyncSession,
        config: TeamGenerationConfig,
        player_ids: Optional[List[UUID]] = None,
        unassigned_only: bool = False,
    ) -> TeamGenerationResult:
        """
        Main method to generate balanced teams

        Args:
            session: Database session
            config: Generation configuration
            player_ids: Specific players to use (None = all)
            unassigned_only: Only use unassigned players

        Returns:
            TeamGenerationResult with all details
        """
        logger.info("=" * 60)
        logger.info("Starting team generation")
        logger.info("League: %s", config.league_id)
        logger.info(
            "Target: %s teams with %s players each",
            config.num_teams,
            config.players_per_team,
        )
        logger.info("=" * 60)

        # Step 1: Get available players
        players = await self.get_available_players(
            session, player_ids, unassigned_only, config.league_id
        )

        if not players:
            logger.warning("No players available for generation")
            return TeamGenerationResult(
                teams=[],
                unassigned_players=[],
                warnings=["No players available for team generation"],
                teams_created=False,
            )

        # Step 2: Get teams from league
        teams = await self.get_existing_teams(
            session, config.league_id, config.num_teams
        )

        if len(teams) < config.num_teams:
            logger.error(
                "Not enough teams: need %s, found %s", config.num_teams, len(teams)
            )
            return TeamGenerationResult(
                teams=[],
                unassigned_players=players,
                warnings=[
                    f"Not enough teams in league. Required: {config.num_teams}, "
                    f"Found: {len(teams)}. Please create more teams first."
                ],
                teams_created=False,
            )

        # Step 3: Sort players
        sorted_players = self.sort_players_by_skill_and_position(players)

        # Step 4 & 5: Distribute using snake draft
        teams, unassigned, warnings = self.snake_draft_distribute(
            sorted_players, teams, config
        )

        # Step 6: Calculate metrics
        balance_score = self.calculate_team_balance_score(teams)

        # Step 7: Create result
        result = TeamGenerationResult(
            teams=teams,
            unassigned_players=unassigned,
            warnings=warnings,
            teams_created=False,
        )

        # Add summary warnings
        if not result.all_teams_valid:
            warnings.append("⚠️  Some teams do not meet minimum position requirements")

        if balance_score > 0.5:
            warnings.append(
                f"⚠️  Teams may be unbalanced (variance: {balance_score}). "
                f"Consider redistributing."
            )

        logger.info("=" * 60)
        logger.info("Generation complete:")
        logger.info("  Teams: %s", len(result.teams))
        logger.info("  Players assigned: %s", result.total_players_assigned)
        logger.info("  Unassigned: %s", len(result.unassigned_players))
        logger.info("  Balance score: %s", result.skill_balance_score)
        logger.info("  All teams valid: %s", result.all_teams_valid)
        logger.info("=" * 60)

        return result
