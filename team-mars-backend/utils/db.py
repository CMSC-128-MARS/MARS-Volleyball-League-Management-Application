from repository.database import SessionLocal


def get_session():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_player_use_case(db=None):
    """
    Dependency provider for PlayerUseCase.

    :param db: Database session (optional, for testing)
    :type db: Session
    :return: PlayerUseCase instance
    :rtype: PlayerUseCase
    """
    # Import here to avoid circular dependency
    from repository.player_repository import PlayerRepository
    from usecase.player_use_case import PlayerUseCase

    if db is None:
        db = next(get_db())
    player_repo = PlayerRepository(db)
    return PlayerUseCase(player_repo)
