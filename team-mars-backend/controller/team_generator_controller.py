"""
Team Generator API Controller
Endpoints for auto-generating balanced teams
"""

from typing import Dict, List
from uuid import UUID
from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.ext.asyncio import AsyncSession

from repository.database import get_async_session
from repository.team_generator_repository import TeamGeneratorRepository
from service.team_generator_service import TeamGeneratorService
from usecase.team_generator_use_case import TeamGeneratorUseCase
from model.team_generator.team_generator import (
    TeamGenerationRequest,
    TeamGenerationResult,
    TeamGenerationConfig,
)

router = APIRouter(prefix="/team-generator", tags=["Team Generator"])


def get_team_generator_use_case() -> TeamGeneratorUseCase:
    """Dependency for team generator use case"""
    repo = TeamGeneratorRepository()
    service = TeamGeneratorService(repo=repo)
    return TeamGeneratorUseCase(service=service, repo=repo)


@router.post(
    "/preview",
    response_model=TeamGenerationResult,
    summary="Preview Team Generation",
    description="Preview how teams would be generated without saving",
)
async def preview_team_generation(
    request: TeamGenerationRequest,
    session: AsyncSession = Depends(get_async_session),
    use_case: TeamGeneratorUseCase = Depends(get_team_generator_use_case),
):
    """
    Preview team generation without saving to database.

    This endpoint shows you how teams would be balanced before committing.

    Example request:
    ```json
    {
      "config": {
        "league_id": "uuid-here",
        "num_teams": 4,
        "players_per_team": 8,
        "prioritize_skill_balance": true,
        "team_name_prefix": "Team"
      },
      "create_new_teams": false
    }
    ```
    """
    return await use_case.preview_generation(session, request)


@router.post(
    "/generate",
    response_model=TeamGenerationResult,
    status_code=status.HTTP_201_CREATED,
    summary="Generate and Assign Teams",
    description="Generate balanced teams and assign players automatically",
)
async def generate_and_assign_teams(
    request: TeamGenerationRequest,
    clear_existing: bool = Query(
        False, description="Remove all existing team assignments in the league first"
    ),
    session: AsyncSession = Depends(get_async_session),
    use_case: TeamGeneratorUseCase = Depends(get_team_generator_use_case),
):
    """
    Generate balanced teams and automatically assign players.

    This endpoint:
    1. Optionally clears existing team assignments
    2. Generates balanced teams based on skill level and position
    3. Validates position requirements
    4. Creates team-player assignments in the database
    5. Returns the generated teams with statistics

    Query Parameters:
        clear_existing: If true, removes all existing assignments in the league first

    Example request:
    ```json
    {
      "config": {
        "league_id": "uuid-here",
        "num_teams": 4,
        "players_per_team": 8,
        "position_requirements": [
          {"position": "Setter", "min_count": 1, "max_count": 2},
          {"position": "Opposite Hitter", "min_count": 1, "max_count": 2},
          {"position": "Middle Blocker", "min_count": 2, "max_count": 3},
          {"position": "Outside Hitter", "min_count": 2, "max_count": 4}
        ],
        "prioritize_skill_balance": true
      },
      "player_ids": null,
      "create_new_teams": false
    }
    ```
    """
    return await use_case.generate_and_assign_teams(session, request, clear_existing)


@router.post(
    "/regenerate/{league_id}",
    response_model=TeamGenerationResult,
    summary="Regenerate Teams for League",
    description="Clear all assignments and regenerate balanced teams",
)
async def regenerate_league_teams(
    league_id: UUID,
    config: TeamGenerationConfig,
    session: AsyncSession = Depends(get_async_session),
    use_case: TeamGeneratorUseCase = Depends(get_team_generator_use_case),
):
    """
    Regenerate all teams for a league.

    This will:
    1. Clear ALL existing team-player assignments in the league
    2. Redistribute all players using the snake draft algorithm
    3. Create new team-player assignments

    Use this when you want a complete rebalance of the league.
    """
    return await use_case.regenerate_teams_for_league(session, league_id, config)


@router.get(
    "/stats/{league_id}",
    summary="Get League Statistics",
    description="Get statistics about team composition and balance",
)
async def get_league_statistics(
    league_id: UUID,
    session: AsyncSession = Depends(get_async_session),
    use_case: TeamGeneratorUseCase = Depends(get_team_generator_use_case),
) -> dict:
    """
    Get comprehensive statistics for a league.

    Returns:
    - Total teams and players
    - Position breakdown across all teams
    - Skill level distribution
    - Team balance metrics (variance, average skill per team)
    - Whether teams are balanced
    """
    return await use_case.get_league_statistics(session, league_id)


@router.delete(
    "/assignments/{league_id}",
    status_code=status.HTTP_200_OK,
    summary="Clear All Team Assignments",
    description="Remove all player assignments from teams in a league",
)
async def clear_league_assignments(
    league_id: UUID,
    session: AsyncSession = Depends(get_async_session),
    use_case: TeamGeneratorUseCase = Depends(get_team_generator_use_case),
) -> dict:
    """
    Clear all team-player assignments for a league.

    This removes all players from all teams but keeps the teams themselves.
    Useful before regenerating teams or manually assigning players.

    Returns:
        Number of assignments deleted
    """
    deleted_count = await use_case.clear_league_assignments(session, league_id)
    return {
        "league_id": league_id,
        "assignments_deleted": deleted_count,
        "message": f"Cleared {deleted_count} team assignments",
    }


@router.post(
    "/rebalance/teams",
    response_model=TeamGenerationResult,
    summary="Rebalance Specific Teams",
    description="Rebalance only specific teams in a league",
)
async def rebalance_specific_teams(
    league_id: UUID,
    team_ids: List[UUID],
    config: TeamGenerationConfig,
    session: AsyncSession = Depends(get_async_session),
    use_case: TeamGeneratorUseCase = Depends(get_team_generator_use_case),
):
    """
    Rebalance only specific teams in a league.

    This will:
    1. Clear assignments for the specified teams only
    2. Redistribute their players among those teams
    3. Leave other teams in the league unchanged

    Useful when you want to adjust just a few teams without affecting the entire league.
    """
    return await use_case.rebalance_specific_teams(session, league_id, team_ids, config)


@router.post(
    "/assign/manual",
    status_code=status.HTTP_201_CREATED,
    summary="Manually Assign Players to Teams",
    description="Manually assign specific players to specific teams",
)
async def manual_player_assignment(
    league_id: UUID,
    team_player_map: Dict[UUID, List[UUID]],
    session: AsyncSession = Depends(get_async_session),
    use_case: TeamGeneratorUseCase = Depends(get_team_generator_use_case),
) -> dict:
    """
    Manually assign specific players to specific teams.

    Request body format:
    ```json
    {
      "league_id": "uuid-here",
      "team_player_map": {
        "team-uuid-1": ["player-uuid-1", "player-uuid-2"],
        "team-uuid-2": ["player-uuid-3", "player-uuid-4"]
      }
    }
    ```

    Returns:
        Number of assignments created
    """
    created_count = await use_case.assign_specific_players_to_teams(
        session, league_id, team_player_map
    )
    return {
        "league_id": league_id,
        "assignments_created": created_count,
        "message": f"Created {created_count} manual assignments",
    }
