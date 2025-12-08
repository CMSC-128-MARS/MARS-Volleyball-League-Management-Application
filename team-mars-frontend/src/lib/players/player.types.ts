// Types for player API and UI mapping

export interface PlayerDto {
  player_id: string;
  first_name: string;
  last_name?: string | null;
  jersey_number?: number | null;
  default_position?: string | null;
  created_at?: string;
}

export interface PlayerCreateDto {
  first_name: string;
  last_name?: string | null;
  jersey_number?: number | null;
  default_position?: string | null;
}

export type PlayerUpdateDto = Partial<PlayerCreateDto>;

// UI-facing player model used by components in this frontend
export interface Player {
  id: string;
  name: string;
  position: string | null;
  jerseyNo: number | null;
  createdAt?: string;
}
