// ============================================================================
// Enum Types
// ============================================================================

export enum SkillLevelEnum {
  BEGINNER = 1,
  INTERMEDIATE = 2,
  ADVANCED = 3,
  EXPERT = 4,
  PROFESSIONAL = 5,
}

export const SkillLevelLabels: Record<SkillLevelEnum, string> = {
  [SkillLevelEnum.BEGINNER]: 'Beginner',
  [SkillLevelEnum.INTERMEDIATE]: 'Intermediate',
  [SkillLevelEnum.ADVANCED]: 'Advanced',
  [SkillLevelEnum.EXPERT]: 'Expert',
  [SkillLevelEnum.PROFESSIONAL]: 'Professional',
};

export enum LeagueStatus {
  UPCOMING = 'upcoming',
  ACTIVE = 'active',
  COMPLETED = 'completed',
}
