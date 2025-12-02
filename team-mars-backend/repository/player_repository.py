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
from model.player.player import PlayerCreate, PlayerUpdate


class PlayerRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_player(self, data: PlayerCreate) -> Player:
        try:
            player = Player(
                player_id=uuid4(),
                first_name=data.first_name,
                last_name=data.last_name,
                jersey_number=data.jersey_number,
                default_position=data.default_position,
            )
            self.db.add(player)
            self.db.commit()
            self.db.refresh(player)
            return player
        except SQLAlchemyError as e:
            self.db.rollback()
            raise e

    def get_player(self, player_id: UUID) -> Optional[Player]:
        try:
            return self.db.query(Player).filter(Player.player_id == player_id).first()
        except SQLAlchemyError as e:
            raise e

    def get_player_with_relationships(self, player_id: UUID) -> Optional[Player]:
        try:
            return (
                self.db.query(Player)
                .options(
                    joinedload(Player.skills),
                    joinedload(Player.team_memberships),
                )
                .filter(Player.player_id == player_id)
                .first()
            )
        except SQLAlchemyError as e:
            raise e

    def list_players(
        self,
        skip: int = 0,
        limit: int = 100,
    ) -> List[Player]:
        try:
            return self.db.query(Player).offset(skip).limit(limit).all()
        except SQLAlchemyError as e:
            raise e

    def update_player(self, player_id: UUID, data: PlayerUpdate) -> Optional[Player]:
        try:
            player = self.get_player(player_id)

            if not player:
                return None

            # Update only provided fields
            update_data = data.model_dump(exclude_unset=True)
            for field, value in update_data.items():
                setattr(player, field, value)

            self.db.commit()
            self.db.refresh(player)
            return player
        except SQLAlchemyError as e:
            self.db.rollback()
            raise e

    def delete_player(self, player_id: UUID) -> bool:
        try:
            player = self.get_player(player_id)

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
        try:
            return (
                self.db.query(Player).filter(Player.player_id == player_id).first()
                is not None
            )
        except SQLAlchemyError as e:
            raise e
