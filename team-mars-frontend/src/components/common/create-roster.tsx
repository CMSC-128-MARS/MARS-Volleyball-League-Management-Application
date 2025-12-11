import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectLabel,
  SelectGroup,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SquarePen, Cog, Search, UserRoundPlus } from 'lucide-react';
import { useState } from 'react';
import { teamApiService } from '@/lib/team';
import { usePlayers } from '@/hooks/use-players';
import type { ApiPlayer } from '@/lib/api';

export default function AddTeamDetails({
  onRosterMethodSelected,
  selectedMethod,
  onMethodChange,
  onPlayerAdd,
  selectedPlayerIds = [],
  isEditMode = false,
  teamId,
  onPlayerAssigned,
}: {
  onRosterMethodSelected?: () => void;
  selectedMethod?: 'manual' | 'automatic' | null;
  onMethodChange?: (method: 'manual' | 'automatic' | null) => void;
  onPlayerAdd?: (player: ApiPlayer) => void;
  selectedPlayerIds?: string[];
  isEditMode?: boolean;
  teamId?: string | null;
  onPlayerAssigned?: () => void;
}) {
  const { players, isLoading, error } = usePlayers();
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleMethodSelect = (method: 'manual' | 'automatic') => {
    if (selectedMethod === method) {
      onMethodChange?.(null);
      return;
    }
    onMethodChange?.(method);
    onRosterMethodSelected?.();
  };

  const handlePlayerSelect = (playerId: string) => {
    setSelectedPlayer(playerId);
    setIsDialogOpen(true);
  };

  const handleAddPlayer = async () => {
    if (!currentPlayer) return;

    const apiPlayer: ApiPlayer = {
      player_id: currentPlayer.id,
      first_name: currentPlayer.first_name || '',
      last_name: currentPlayer.last_name ?? '',
      jersey_number: currentPlayer.jerseyNo ?? null,
      default_position: currentPlayer.position ?? null,
      created_at: currentPlayer.createdAt ?? undefined,
      skill_level: currentPlayer.skill_level ?? null,
      notes: currentPlayer.notes ?? null,
    };

    // If we're editing an existing team and a teamId is provided, assign immediately via API.
    if (isEditMode && teamId) {
      try {
        setIsAdding(true);
        const payload = {
          team_id: teamId,
          player_id: apiPlayer.player_id,
          position: apiPlayer.default_position || null,
          join_date: new Date().toISOString(),
        };
        // Debug log: inspect payload and server response when adding player to team
        console.debug('Adding player to team - payload:', payload);
        const resp = await teamApiService.addPlayerToTeam(
          teamId,
          apiPlayer.player_id,
          apiPlayer.default_position || undefined,
        );
        console.debug('Add player to team response:', resp);
        // Notify parent to re-fetch team players
        onPlayerAssigned?.();
        // also emit a global event so any listeners (cards) can refresh
        try {
          window.dispatchEvent(new CustomEvent('team-player-changed', { detail: { teamId } }));
        } catch (err) {
          /* ignore */
        }
      } catch (err) {
        console.error('Failed to add player to team:', err);
        alert('Failed to add player to team. Please try again.');
        return;
      } finally {
        setIsAdding(false);
      }
    }

    onPlayerAdd?.(apiPlayer);
    setIsDialogOpen(false);
    setSelectedPlayer(null);
  };

  const currentPlayer = players.find((p) => p.id === selectedPlayer) ?? null;

  return (
    <div className="w-full h-full shadow-md">
      <Card className={`gap-2 transition-all duration-200 ${isSelectOpen ? 'pb-35 lg:pb-0' : ''}`}>
        <CardHeader className="items-center px-6 pt-4">
          <CardTitle className="flex flex-col justify-start items-start w-full gap-1">
            <h4>{isEditMode ? 'Add Players' : 'Create Roster'}</h4>
            {!isEditMode && (
              <p className="text-sm text-gray-500 font-paragraph text-4">
                Choose manual or automatic roster creation
              </p>
            )}
          </CardTitle>
        </CardHeader>
        <hr className="w-full border-t border-[#A3A3A3]" />
        <CardContent className="flex flex-col md:flex-row gap-6 pb-6 pt-4 items-start justify-center">
          {!isEditMode && (
            <div
              onClick={() => handleMethodSelect('manual')}
              className={`w-full md:w-1/2 hover:cursor-pointer rounded-sm shadow-md flex flex-col gap-2 items-center justify-center border px-6 py-8 h-[178px] transition-colors ${
                selectedMethod === 'manual'
                  ? 'border-primary bg-primary/5'
                  : 'border-[#E5E5E5] hover:border-[#737373]'
              }`}
            >
              <SquarePen />
              <h4>Manual Creation</h4>
              <p className="text-sm text-gray-500 font-paragraph text-center">
                Choose your players manually to create a roster
              </p>
            </div>
          )}
          {selectedMethod === 'manual' || isEditMode ? (
            <div
              className={`flex flex-col gap-2 items-start ${isEditMode ? 'w-full' : 'w-full md:w-1/2'}`}
            >
              <p>
                Enter Players <span className="text-secondary-alt">*</span>
              </p>
              <Select onValueChange={handlePlayerSelect} onOpenChange={setIsSelectOpen}>
                <SelectTrigger
                  className="w-full rounded-sm border border-[#E5E5E5] bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] justify-start"
                  showChevron={false}
                >
                  <Search className="w-4 h-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder={isLoading ? 'Loading players...' : 'Search players'} />
                </SelectTrigger>
                <SelectContent className="max-h-[280px]">
                  <SelectGroup>
                    <SelectLabel>Select a player</SelectLabel>
                    {error && (
                      <div className="px-2 py-1.5 text-sm text-red-600">Error loading players</div>
                    )}
                    {!isLoading && !error && players.length === 0 && (
                      <div className="px-2 py-1.5 text-sm text-muted-foreground">
                        No players available
                      </div>
                    )}
                    {players.map((player) => (
                      <SelectItem
                        key={player.id}
                        value={player.id}
                        disabled={selectedPlayerIds.includes(player.id)}
                      >
                        {player.first_name} {player.last_name || ''}
                        {player.jerseyNo ? ` #${player.jerseyNo}` : ''}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="gap-0 max-h-[90vh] flex flex-col md:max-w-2xl">
                  <DialogHeader className="text-left -mt-2 mb-2 flex-shrink-0">
                    <DialogTitle>
                      <h4>Player Details</h4>
                    </DialogTitle>
                  </DialogHeader>
                  <hr className="w-[calc(100%+3rem)] -ml-6 border-t border-[#A3A3A3] flex-shrink-0" />
                  <div className="overflow-y-auto flex-1 scrollbar-hide">
                    {currentPlayer && (
                      <div className="flex flex-col gap-3 mt-6">
                        <div className="flex flex-col md:grid md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-[14px] text-black mb-1">First Name</p>
                            <Input
                              value={currentPlayer.first_name ?? ''}
                              readOnly
                              className="bg-gray-50 text-[14px] text-gray-500"
                            />
                          </div>
                          <div>
                            <p className="text-[14px] text-black mb-1">Last Name</p>
                            <Input
                              value={currentPlayer.last_name ?? 'N/A'}
                              readOnly
                              className="bg-gray-50 text-[14px] text-gray-500"
                            />
                          </div>
                          <div>
                            <p className="text-[14px] text-black mb-1">Jersey Number</p>
                            <Input
                              value={currentPlayer.jerseyNo?.toString() || 'N/A'}
                              readOnly
                              className="bg-gray-50 text-[14px] text-gray-500"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col md:grid md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-[14px] text-black mb-1">Default Position</p>
                            <Input
                              value={currentPlayer.position || 'N/A'}
                              readOnly
                              className="bg-gray-50 text-[14px] text-gray-500"
                            />
                          </div>
                          <div>
                            <p className="text-[14px] text-black mb-1">Player Creation Date</p>
                            <Input
                              value={
                                currentPlayer.createdAt
                                  ? new Date(currentPlayer.createdAt).toLocaleDateString()
                                  : 'N/A'
                              }
                              readOnly
                              className="bg-gray-50 text-[14px] text-gray-500"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col md:grid md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-[14px] text-black mb-1">Skill Level</p>
                            <Input
                              value={currentPlayer.skill_level?.toString() || 'N/A'}
                              readOnly
                              className="bg-gray-50 text-[14px] text-gray-500"
                            />
                          </div>
                          <div>
                            <p className="text-[14px] text-black mb-1">Date Evaluated</p>
                            <Input
                              value={'N/A'}
                              readOnly
                              className="bg-gray-50 text-[14px] text-gray-500"
                            />
                          </div>
                        </div>
                        {/* Skill Level Description removed per request */}
                        <div>
                          <p className="text-[14px] text-black mb-1">Notes</p>
                          <Input
                            value={currentPlayer.notes || 'N/A'}
                            readOnly
                            className="bg-gray-50 text-[14px] text-gray-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <hr className="w-[calc(100%+3rem)] -ml-6 border-t border-[#A3A3A3] mt-6 flex-shrink-0" />
                  <div className="w-full mt-4 flex-shrink-0">
                    <Button className="w-full" onClick={handleAddPlayer} isLoading={isAdding}>
                      <UserRoundPlus className="mr-2 h-4 w-4" strokeWidth={2.5} />
                      <p className="font-extralight">Add Player</p>
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            !isEditMode && (
              <div
                onClick={() => handleMethodSelect('automatic')}
                className={`w-full md:w-1/2 hover:cursor-pointer rounded-sm shadow-md flex flex-col gap-2 items-center justify-center border px-6 py-8 h-[178px] transition-colors ${
                  selectedMethod === 'automatic'
                    ? 'border-primary bg-primary/5'
                    : 'border-[#E5E5E5] hover:border-[#737373]'
                }`}
              >
                <Cog />
                <h4>Automatic Creation</h4>
                <p className="text-sm text-gray-500 font-paragraph text-center">
                  Chooses players by skill to form a balanced roster.
                </p>
              </div>
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
}
