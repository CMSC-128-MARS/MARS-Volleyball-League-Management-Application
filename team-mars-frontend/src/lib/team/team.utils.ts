import type { TeamWithCounts, TeamsEnvelope } from './team.types';

export const normalizeTeamsResponse = (
  payload: TeamWithCounts[] | TeamsEnvelope,
): TeamWithCounts[] => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload.teams)) {
    return payload.teams;
  }

  if (Array.isArray(payload.data)) {
    return payload.data;
  }

  if (Array.isArray(payload.results)) {
    return payload.results;
  }

  return [];
};
