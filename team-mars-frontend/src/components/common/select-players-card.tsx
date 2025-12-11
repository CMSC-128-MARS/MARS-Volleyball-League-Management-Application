import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import SelectedTeamButtons from './selected-team-buttons';
import SelectedPlayersCard from './selected-players-cards';
import type { ApiPlayer } from '@/lib/api';
import { useEffect, useState } from 'react';
import { teamApiService } from '@/lib/team';

type SelectPlayersCardProps = {
  players?: ApiPlayer[];
  onRemovePlayer?: (playerId: string) => void;
  onSave?: () => void;
  onReset?: () => void;
  isSaving?: boolean;
  showButtons?: boolean;
  teamId?: string | null;
  team?: any;
};

export default function SelectPlayersCard({
  players = [],
  onRemovePlayer,
  onSave,
  onReset,
  isSaving = false,
  showButtons = true,
  teamId = null,
  team = null,
}: SelectPlayersCardProps) {
  const [combinedPlayers, setCombinedPlayers] = useState<ApiPlayer[]>(players);
  const [serverPlayers, setServerPlayers] = useState<ApiPlayer[]>([]);
  const [serverCount, setServerCount] = useState<number | null>(null);

  // Recompute combined players whenever serverPlayers or the selected `players` prop changes.
  useEffect(() => {
    const map = new Map<string, ApiPlayer>();
    // Start with server players, then apply local `players` to override or remove entries.
    serverPlayers.forEach((p) => map.set(p.player_id, p));
    players.forEach((p) => {
      if (p && p.player_id) {
        map.set(p.player_id, p);
      }
    });
    setCombinedPlayers(Array.from(map.values()));
  }, [serverPlayers, players]);

  useEffect(() => {
    let mounted = true;
    const loadTeamPlayers = async () => {
      if (team) {
        const apiPlayers: ApiPlayer[] = (team.team_players || [])
          .filter((tp: any) => tp.leave_date === null && tp.player)
          .map((tp: any) => ({
            player_id: tp.player.player_id,
            first_name: tp.player.first_name,
            last_name: tp.player.last_name || '',
            jersey_number: tp.player.jersey_number || null,
            default_position: tp.position || tp.player.default_position || null,
            created_at: tp.player.created_at,
            skill_level: tp.player.skill_level ?? 0,
            notes: tp.player.notes ?? null,
          }));
        if (!mounted) return;
        console.log(
          '[SelectPlayersCard] using parent team prop, server players:',
          apiPlayers.length,
          team,
        );
        setServerCount(apiPlayers.length);
        // store server players; combinedPlayers will be derived from serverPlayers + players
        setServerPlayers(apiPlayers);
        return;
      }

      if (!teamId) return;
      try {
        const t = await teamApiService.getTeamById(teamId);
        const apiPlayers: ApiPlayer[] = (t.team_players || [])
          .filter((tp: any) => tp.leave_date === null && tp.player)
          .map((tp: any) => ({
            player_id: tp.player.player_id,
            first_name: tp.player.first_name,
            last_name: tp.player.last_name || '',
            jersey_number: tp.player.jersey_number || null,
            default_position: tp.position || tp.player.default_position || null,
            created_at: tp.player.created_at,
            skill_level: tp.player.skill_level ?? 0,
            notes: tp.player.notes ?? null,
          }));

        if (!mounted) return;
        console.log(
          '[SelectPlayersCard] fetched team by id, server players:',
          apiPlayers.length,
          t,
        );
        setServerCount(apiPlayers.length);
        setServerPlayers(apiPlayers);
      } catch (err) {
        // best-effort; ignore errors
      }
    };

    loadTeamPlayers();
    // Listen for external events that indicate team players changed (e.g. after add/remove)
    const handler = (e: Event) => {
      try {
        const ev = e as CustomEvent;
        if (!ev.detail || ev.detail.teamId !== teamId) return;
        // Re-load players
        loadTeamPlayers();
      } catch (err) {
        // ignore
      }
    };
    window.addEventListener('team-player-changed', handler);
    return () => {
      mounted = false;
      window.removeEventListener('team-player-changed', handler);
    };
  }, [teamId]);

  return (
    <div className="w-full h-full min-h-[300px] shadow-md bg-white">
      <Card className="gap-2 transition-all duration-200 h-full">
        <CardHeader className="items-center px-6 pt-4">
          <CardTitle className="flex flex-row justify-between items-center w-full">
            <h4>Selected Players</h4>
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-500 font-paragraph text-4">
                Total: {combinedPlayers.length}
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <hr className="w-full border-t border-[#A3A3A3]" />
        <CardContent className="flex flex-col gap-2">
          {showButtons && (
            <SelectedTeamButtons
              onBack={onReset || (() => {})}
              onNext={onSave}
              isNextDisabled={isSaving || combinedPlayers.length === 0}
            />
          )}
          <div className="pt-2 pb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-6">
            {combinedPlayers.length === 0 ? (
              <div className="col-span-full text-center text-muted-foreground py-8">
                No players selected yet
              </div>
            ) : (
              combinedPlayers.map((player) => (
                <SelectedPlayersCard
                  key={player.player_id}
                  name={`${player.first_name} ${player.last_name || ''}`.trim()}
                  skillLevel={player.skill_level ?? 0}
                  jerseyNumber={player.jersey_number?.toString() ?? 'N/A'}
                  position={player.default_position ?? 'N/A'}
                  onRemove={() => onRemovePlayer?.(player.player_id)}
                  showRemove={true}
                />
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
