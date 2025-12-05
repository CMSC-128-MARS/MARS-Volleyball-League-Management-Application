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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { SquarePen, Cog, Search } from 'lucide-react';
import { useState } from 'react';
import { usePlayers } from '@/hooks/use-players';

export default function AddTeamDetails({
  onRosterMethodSelected,
  selectedMethod,
  onMethodChange,
}: {
  onRosterMethodSelected?: () => void;
  selectedMethod?: 'manual' | 'automatic' | null;
  onMethodChange?: (method: 'manual' | 'automatic' | null) => void;
}) {
  const { players, isLoading, error } = usePlayers();
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);

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

  const currentPlayer = players.find((p) => p.player_id === selectedPlayer);

  return (
    <div className="w-full h-full shadow-md">
      <Card className={`gap-2 transition-all duration-200 ${isSelectOpen ? 'pb-35 lg:pb-0' : ''}`}>
        <CardHeader className="items-center px-6 pt-4">
          <CardTitle className="flex flex-col justify-start items-start w-full gap-1">
            <h4>Create Roster</h4>
            <p className="text-sm text-gray-500 font-paragraph text-4">
              Choose manual or automatic roster creation
            </p>
          </CardTitle>
        </CardHeader>
        <hr className="w-full border-t border-[#A3A3A3]" />
        <CardContent className="flex flex-col md:flex-row gap-6 pb-6 pt-4 items-start justify-center">
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
          {selectedMethod === 'manual' ? (
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
                      <SelectItem key={player.player_id} value={player.player_id}>
                        {player.first_name} {player.last_name || ''}
                        {player.jersey_number ? ` #${player.jersey_number}` : ''}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="gap-0">
                  <DialogHeader className="text-left -mt-2 mb-2">
                    <DialogTitle>
                      <h4>Player Details</h4>
                    </DialogTitle>
                  </DialogHeader>
                  <hr className="w-[calc(100%+3rem)] -ml-6 border-t border-[#A3A3A3]" />
                  {currentPlayer && (
                    <div className="flex flex-col gap-3 mt-6">
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
                </DialogContent>
              </Dialog>
            </div>
          ) : (
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
