import { httpClient } from '@/lib/http/axios-client';
import type {
  PlayerDto,
  PlayerCreateDto,
  PlayerUpdateDto,
  Player as PlayerUI,
} from './player.types';

const API_BASE = '/players';

function mapDtoToUi(dto: PlayerDto): PlayerUI {
  return {
    id: dto.player_id,
    name: `${dto.first_name}${dto.last_name ? ' ' + dto.last_name : ''}`,
    first_name: dto.first_name,
    last_name: dto.last_name ?? null,
    position: dto.default_position ?? null,
    jerseyNo: dto.jersey_number ?? null,
    // Backends might return `grade` or `skill_level` — normalize both onto the UI model
    grade: dto.skill_level ?? dto.grade ?? null,
    skill_level: dto.skill_level ?? dto.grade ?? null,
    // Map either `notes` or legacy `skill_notes` into UI `notes`.
    notes: dto.notes ?? dto.skill_notes ?? null,
    createdAt: dto.created_at,
  };
}

export async function fetchPlayers(): Promise<PlayerUI[]> {
  const data = await httpClient.get<PlayerDto[]>(API_BASE);
  return data.map(mapDtoToUi);
}

export async function fetchPlayerById(id: string): Promise<PlayerUI> {
  const data = await httpClient.get<PlayerDto>(`${API_BASE}/${id}`);
  return mapDtoToUi(data);
}

export async function createPlayer(payload: PlayerCreateDto): Promise<PlayerUI> {
  try {
    const data = await httpClient.post<PlayerDto>(API_BASE, payload);
    return mapDtoToUi(data);
  } catch (err: unknown) {
    // If backend rejects `skill_notes` as an extra field, retry using `notes` instead.
    const message = (err as Error)?.message ?? '';
    const lower = String(message).toLowerCase();
    const mentionsSkillNotes =
      lower.includes('skill_notes') ||
      lower.includes('skill-notes') ||
      lower.includes('skill notes');
    const mentionsExtra =
      lower.includes('extra') ||
      lower.includes('extra_forbidden') ||
      lower.includes('not permitted') ||
      lower.includes('not allowed');

    if (mentionsSkillNotes && mentionsExtra && payload.skill_notes) {
      const alt: Partial<PlayerCreateDto> = { ...payload };
      const sn = alt.skill_notes;
      delete (alt as Partial<PlayerCreateDto>).skill_notes;
      // send under `notes` instead
      (alt as Partial<PlayerCreateDto>).notes = sn ?? alt.notes;

      try {
        const created = await httpClient.post<PlayerDto>(API_BASE, alt as PlayerCreateDto);
        return mapDtoToUi(created);
      } catch (retryErr) {
        // Retry failed; fall through and rethrow original error
      }
    }

    throw err;
  }
}

export async function updatePlayer(id: string, payload: PlayerUpdateDto): Promise<PlayerUI> {
  const data = await httpClient.put<PlayerDto>(`${API_BASE}/${id}`, payload);
  return mapDtoToUi(data);
}

export async function deletePlayer(id: string): Promise<void> {
  await httpClient.delete<void>(`${API_BASE}/${id}`);
}

const playerService = {
  fetchPlayers,
  fetchPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer,
};

export default playerService;
