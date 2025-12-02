"""
Player Repository Module.

This module provides data access layer for Player entities.
All methods return SQLAlchemy models, not Pydantic schemas.
"""

from typing import List, Optional
from uuid import UUID, uuid4
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import SQLAlchemyError
from repository.models.player import Player


class PlayerRepository:
    """
    Repository for Player database operations.
 
    Handles all CRUD operations for Player entities following
    clean architecture principles.
    """

    def __init__(self, db: Session):
        """
        Initialize the Player repository.

        :param db: SQLAlchemy database session
        :type db: Session
        """
        self.db = db

    def create_player(
        self,
        first_name: str,
        last_name: Optional[str] = None,
        jersey_number: Optional[int] = None,
        default_position: Optional[str] = None,
    ) -> Player:
        """
        Create a new player in the database.

        :param first_name: Player's first name
        :type first_name: str
        :param last_name: Player's last name (optional)
        :type last_name: Optional[str]
        :param jersey_number: Player's jersey number (optional)
        :type jersey_number: Optional[int]
        :param default_position: Player's default position (optional)
        :type default_position: Optional[str]
        :return: Created player instance
        :rtype: Player
        :raises SQLAlchemyError: If database operation fails
        """
        try:
            player = Player(
                player_id=uuid4(),
                first_name=first_name,
                last_name=last_name,
                jersey_number=jersey_number,
                default_position=default_position,
            )
            self.db.add(player)
            self.db.commit()
            self.db.refresh(player)
            return player
        except SQLAlchemyError as e:
            self.db.rollback()
            raise e

    def get_player_by_id(
        self, player_id: UUID, load_relationships: bool = False
    ) -> Optional[Player]:
        """
        Retrieve a player by their ID.

        :param player_id: Unique identifier of the player
        :type player_id: UUID
        :param load_relationships: Whether to eagerly load relationships
        :type load_relationships: bool
        :return: Player instance if found, None otherwise
        :rtype: Optional[Player]
        :raises SQLAlchemyError: If database operation fails
        """
        try:
            query = self.db.query(Player)

            if load_relationships:
                query = query.options(
                    joinedload(Player.skills),
                    joinedload(Player.team_memberships),
                )

            return query.filter(Player.player_id == player_id).first()
        except SQLAlchemyError as e:
            raise e

    def list_players(
        self,
        skip: int = 0,
        limit: int = 100,
        load_relationships: bool = False,
    ) -> List[Player]:
        """
        Retrieve a list of players with pagination.

        :param skip: Number of records to skip (offset)
        :type skip: int
        :param limit: Maximum number of records to return
        :type limit: int
        :param load_relationships: Whether to eagerly load relationships
        :type load_relationships: bool
        :return: List of player instances
        :rtype: List[Player]
        :raises SQLAlchemyError: If database operation fails
        """
        try:
            query = self.db.query(Player)

            if load_relationships:
                query = query.options(
                    joinedload(Player.skills),
                    joinedload(Player.team_memberships),
                )

            return query.offset(skip).limit(limit).all()
        except SQLAlchemyError as e:
            raise e

    def update_player(
        self,
        player_id: UUID,
        first_name: Optional[str] = None,
        last_name: Optional[str] = None,
        jersey_number: Optional[int] = None,
        default_position: Optional[str] = None,
    ) -> Optional[Player]:
        """
        Update an existing player's information.

        :param player_id: Unique identifier of the player
        :type player_id: UUID
        :param first_name: Updated first name (optional)
        :type first_name: Optional[str]
        :param last_name: Updated last name (optional)
        :type last_name: Optional[str]
        :param jersey_number: Updated jersey number (optional)
        :type jersey_number: Optional[int]
        :param default_position: Updated default position (optional)
        :type default_position: Optional[str]
        :return: Updated player instance if found, None otherwise
        :rtype: Optional[Player]
        :raises SQLAlchemyError: If database operation fails
        """
        try:
            player = self.get_player_by_id(player_id)

            if not player:
                return None

            # Update only provided fields
            if first_name is not None:
                player.first_name = first_name
            if last_name is not None:
                player.last_name = last_name
            if jersey_number is not None:
                player.jersey_number = jersey_number
            if default_position is not None:
                player.default_position = default_position

            self.db.commit()
            self.db.refresh(player)
            return player
        except SQLAlchemyError as e:
            self.db.rollback()
            raise e

    def delete_player(self, player_id: UUID) -> bool:
        """
        Delete a player from the database.

        :param player_id: Unique identifier of the player
        :type player_id: UUID
        :return: True if player was deleted, False if not found
        :rtype: bool
        :raises SQLAlchemyError: If database operation fails
        """
        try:
            player = self.get_player_by_id(player_id)

            if not player:
                return False

            self.db.delete(player)
            self.db.commit()
            return True
        except SQLAlchemyError as e:
            self.db.rollback()
            raise e

    def get_players_by_team(
        self, team_id: UUID, load_relationships: bool = False
    ) -> List[Player]:
        """
        Retrieve all players belonging to a specific team.

        :param team_id: Unique identifier of the team
        :type team_id: UUID
        :param load_relationships: Whether to eagerly load relationships
        :type load_relationships: bool
        :return: List of player instances
        :rtype: List[Player]
        :raises SQLAlchemyError: If database operation fails
        """
        try:
            query = self.db.query(Player).join(Player.team_memberships)

            if load_relationships:
                query = query.options(
                    joinedload(Player.skills),
                    joinedload(Player.team_memberships),
                )

            return (
                query.filter(Player.team_memberships.any(team_id=team_id))
                .distinct()
                .all()
            )
        except SQLAlchemyError as e:
            raise e

    def player_exists(self, player_id: UUID) -> bool:
        """
        Check if a player exists in the database.

        :param player_id: Unique identifier of the player
        :type player_id: UUID
        :return: True if player exists, False otherwise
        :rtype: bool
        :raises SQLAlchemyError: If database operation fails
        """
        try:
            return (
                self.db.query(Player).filter(Player.player_id == player_id).first()
                is not None
            )
        except SQLAlchemyError as e:
            raise e
