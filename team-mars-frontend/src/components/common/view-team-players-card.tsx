import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import SelectedPlayersCard from './selected-players-cards';
import type { ApiPlayer } from '@/lib/api';

type ViewTeamPlayersCardProps = {
  players?: ApiPlayer[];
  onRemovePlayer?: (playerId: string) => void;
  onSave?: () => void;
  isSaving?: boolean;
};

export default function ViewTeamPlayersCard({
  players = [],
  onRemovePlayer
}: ViewTeamPlayersCardProps) {
  return (
    <div className="w-full h-full min-h-[300px] shadow-md bg-white">
      <Card className="gap-2 transition-all duration-200 h-full">
        <CardHeader className="items-center px-6 pt-4">
          <CardTitle className="flex flex-row justify-between items-center w-full">
            <h4>Roster</h4>
            <p className="text-sm text-gray-500 font-paragraph text-4">Total: {players.length}</p>
          </CardTitle>
        </CardHeader>
        <hr className="w-full border-t border-[#A3A3A3]" />
        <CardContent className="flex flex-col gap-2">
          <div className="pt-2 pb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 xl:gap-6">
            {players.length === 0 ? (
              <div className="col-span-full text-center text-muted-foreground py-8">
                No players assigned
              </div>
            ) : (
              players.map((player) => (
                <SelectedPlayersCard
                  key={player.player_id}
                  name={`${player.first_name} ${player.last_name || ''}`.trim()}
                  skillLevel={player.skill_level ?? 0}
                  jerseyNumber={player.jersey_number?.toString() ?? 'N/A'}
                  position={player.default_position ?? 'N/A'}
                  onRemove={() => onRemovePlayer?.(player.player_id)}
                />
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
