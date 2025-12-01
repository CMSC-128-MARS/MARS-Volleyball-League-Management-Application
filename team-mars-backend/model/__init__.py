def rebuild_models():
    """
    Rebuild all Pydantic models after imports to resolve forward references.
    This must be called after all model imports are complete.
    """
    from model.player.player import PlayerFull, PlayerSimple
    from model.team.team import TeamFull, TeamNested, TeamSimple
    from model.team_player.team_player import TeamPlayerNested
    from model.league.league import LeagueFull, LeagueSimple
    from model.match.match import MatchSimple, MatchNested
    from model.player_skill.player_skill import PlayerSkillNested
    from model.skill_level.skill_level import SkillLevelSimple

    # Rebuild models in dependency order (models with fewer dependencies first)
    PlayerFull.model_rebuild()
    TeamFull.model_rebuild()
    TeamNested.model_rebuild()
    TeamPlayerNested.model_rebuild()
    LeagueFull.model_rebuild()
    LeagueSimple.model_rebuild()
    MatchSimple.model_rebuild()
    TeamSimple.model_rebuild()
    PlayerSkillNested.model_rebuild()
    SkillLevelSimple.model_rebuild()
    PlayerSimple.model_rebuild()
    MatchNested.model_rebuild()
