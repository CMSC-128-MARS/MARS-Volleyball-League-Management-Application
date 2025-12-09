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
    notes: (dto as any).notes ?? (dto as any).skill_notes ?? null,
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
    // If the backend rejects extra fields (e.g. skill_notes), retry without notes
    const message = (err as Error)?.message ?? '';
    const looksLikeExtraFieldError = /extra|unexpected|field.*not.*allowed|422/.test(
      String(message).toLowerCase(),
    );

    if (payload && (payload as any).skill_notes && looksLikeExtraFieldError) {
      try {
        // Create without the notes field
        const { skill_notes, notes, ...rest } = payload as any;
        const created = await httpClient.post<PlayerDto>(API_BASE, rest);

        // Try to PATCH the created player to add skill_notes (best-effort)
        try {
          await httpClient.patch(`${API_BASE}/${created.player_id}`, { skill_notes: skill_notes });
        } catch (patchErr) {
          // ignore patch errors but log for debugging
          // eslint-disable-next-line no-console
          console.warn('Failed to patch skill_notes after create:', patchErr);
        }

        return mapDtoToUi(created);
      } catch (retryErr) {
        // rethrow the original error if retry also fails
        throw err;
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
