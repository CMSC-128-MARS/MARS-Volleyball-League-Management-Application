from enum import IntEnum


class SkillLevelEnum(IntEnum):
    BEGINNER = 1
    INTERMEDIATE = 2
    ADVANCED = 3
    EXPERT = 4
    PROFESSIONAL = 5

    @classmethod
    def get_description(cls, level: int) -> str:

        descriptions = {
            cls.BEGINNER: "Just starting out, learning basic rules and techniques",
            cls.INTERMEDIATE: "Comfortable with fundamentals, developing consistency",
            cls.ADVANCED: "Strong technical skills, competitive player",
            cls.EXPERT: "Highly skilled, tournament-level competitor",
            cls.PROFESSIONAL: "Elite player, professional or semi-professional level",
        }
        return descriptions.get(level, "Unknown skill level")
