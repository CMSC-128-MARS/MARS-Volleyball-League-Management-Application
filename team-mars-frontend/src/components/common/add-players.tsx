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
import { Search, UserRoundPlus } from 'lucide-react';
import { useState } from 'react';
import type { Player } from '@/lib/team/team.types';

interface SelectPlayersCardProps {
  players: Player[];
  isLoading: boolean;
  error: Error | null;
  selectedPlayerIds: string[];
  onPlayerSelect: (playerId: string) => void;
  onAddPlayer: (playerId: string) => void;
  onRemovePlayer?: (playerId: string) => void;
}

export default function SelectPlayersCard({
  players,
  isLoading,
  error,
  selectedPlayerIds,
  onPlayerSelect,
  onAddPlayer,
}: SelectPlayersCardProps) {
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);

  const handlePlayerSelect = (playerId: string) => {
    const player = players.find((p) => p.player_id === playerId) || null;
    setCurrentPlayer(player);
    setIsDialogOpen(true);
    setIsSelectOpen(false);
  };

  const handleAddPlayer = () => {
    if (currentPlayer) {
      onAddPlayer(currentPlayer.player_id);
      setIsDialogOpen(false);
      setCurrentPlayer(null);
    }
  };

  return (
            <div className="w-full md:w-1/2 flex flex-col gap-2 items-start">
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
                        key={player.player_id}
                        value={player.player_id}
                        disabled={selectedPlayerIds.includes(player.player_id)}
                      >
                        {player.first_name} {player.last_name || ''}
                        {player.jersey_number ? ` #${player.jersey_number}` : ''}
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
                        <div className="flex flex-col gap-2">
                          <h4>ID: {currentPlayer?.player_id}</h4>
                          <p className="text-muted-foreground text-xs">
                            Last Updated:{' '}
                            {currentPlayer?.updated_at
                              ? new Date(currentPlayer.updated_at).toLocaleDateString()
                              : 'N/A'}
                          </p>
                        </div>
                        <div className="flex flex-col md:grid md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-[14px] text-black mb-1">First Name</p>
                            <Input
                              value={currentPlayer.first_name}
                              readOnly
                              className="bg-gray-50 text-[14px] text-gray-500"
                            />
                          </div>
                          <div>
                            <p className="text-[14px] text-black mb-1">Last Name</p>
                            <Input
                              value={currentPlayer.last_name || 'N/A'}
                              readOnly
                              className="bg-gray-50 text-[14px] text-gray-500"
                            />
                          </div>
                          <div>
                            <p className="text-[14px] text-black mb-1">Jersey Number</p>
                            <Input
                              value={currentPlayer.jersey_number?.toString() || 'N/A'}
                              readOnly
                              className="bg-gray-50 text-[14px] text-gray-500"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col md:grid md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-[14px] text-black mb-1">Default Position</p>
                            <Input
                              value={currentPlayer.default_position || 'N/A'}
                              readOnly
                              className="bg-gray-50 text-[14px] text-gray-500"
                            />
                          </div>
                          <div>
                            <p className="text-[14px] text-black mb-1">Player Creation Date</p>
                            <Input
                              value={
                                currentPlayer.created_at
                                  ? new Date(currentPlayer.created_at).toLocaleDateString()
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
                              value={
                                currentPlayer.date_evaluated
                                  ? new Date(currentPlayer.date_evaluated).toLocaleDateString()
                                  : 'N/A'
                              }
                              readOnly
                              className="bg-gray-50 text-[14px] text-gray-500"
                            />
                          </div>
                        </div>
                        <div>
                          <p className="text-[14px] text-black mb-1">Skill Level Description</p>
                          <Input
                            value={currentPlayer.skill_level_description || 'N/A'}
                            readOnly
                            className="bg-gray-50 text-[14px] text-gray-500"
                          />
                        </div>
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
                    <Button className="w-full" onClick={handleAddPlayer}>
                      <UserRoundPlus className="mr-2 h-4 w-4" strokeWidth={2.5} />
                      <p className="font-extralight">Add Player</p>
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
    );