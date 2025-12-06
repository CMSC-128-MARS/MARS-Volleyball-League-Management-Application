import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import SelectedTeamButtons from './selected-team-buttons';
import SelectedPlayersCard from './selected-players-cards';
import type { ApiPlayer } from '@/lib/api';

type SelectPlayersCardProps = {
  players?: ApiPlayer[];
  onRemovePlayer?: (playerId: string) => void;
  onSave?: () => void;
  isSaving?: boolean;
};

export default function SelectPlayersCard({
  players = [],
  onRemovePlayer,
  onSave,
  isSaving = false,
}: SelectPlayersCardProps) {
  return (
    <div className="w-full h-full min-h-[300px] shadow-md bg-white">
      <Card className="gap-2 transition-all duration-200 h-full">
        <CardHeader className="items-center px-6 pt-4">
          <CardTitle className="flex flex-row justify-between items-center w-full">
            <h4>Selected Players</h4>
            <p className="text-sm text-gray-500 font-paragraph text-4">Total: {players.length}</p>
          </CardTitle>
        </CardHeader>
        <hr className="w-full border-t border-[#A3A3A3]" />
        <CardContent className="flex flex-col gap-2">
          <SelectedTeamButtons onBack={() => {}} onNext={onSave} isNextDisabled={isSaving} />
          <div className="pt-2 pb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-6">
            {players.length === 0 ? (
              <div className="col-span-full text-center text-muted-foreground py-8">
                No players selected yet
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
