import { ArrowUpDown, RectangleEllipsis, Plus, Trash } from 'lucide-react';
import { useMemo, useState } from 'react';
import ViewPlayerCard from '@/components/common/view-player-details';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Player {
  id: string;
  name: string;
  first_name?: string | null;
  last_name?: string | null;
  position: string;
  jerseyNo: number;
  grade: number;
}

export default function PlayerDetailsTable({
  playerList,
  handleViewDetails,
  showAddRow,
  handleAdd,
  showRemoveButton,
  onRemoveSelected,
}: PlayerDetailsTableProps) {
  return (
    <PlayerDetailsTableComponent
      playerList={playerList}
      handleViewDetails={handleViewDetails}
      showAddRow={showAddRow}
      handleAdd={handleAdd}
      showRemoveButton={showRemoveButton}
      onRemoveSelected={onRemoveSelected}
    />
  );
}

interface PlayerDetailsTableProps {
  playerList: Player[];
  handleViewDetails: (player: Player) => void;
  showAddRow?: boolean;
  handleAdd?: () => void;
  showRemoveButton?: boolean;
  onRemoveSelected?: (ids: string[]) => Promise<void> | void;
}

type SortDirection = 'ascending' | 'descending';
type SortConfig = { key: keyof Player; direction: SortDirection } | null;

function PlayerDetailsTableComponent({
  playerList,
  handleViewDetails,
  showAddRow,
  handleAdd,
  showRemoveButton,
  onRemoveSelected,
}: PlayerDetailsTableProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewPlayer, setViewPlayer] = useState<{
    first_name?: string | null;
    last_name?: string | null;
    jersey_number?: number | null;
    default_position?: string | null;
    skill_level?: string | null;
    skill_level_description?: string | null;
    notes?: string | null;
  } | null>(null);

  const openPlayerView = (p: Player) => {
    setViewPlayer({
      first_name: p.first_name,
      last_name: p.last_name,
      jersey_number: p.jerseyNo ?? null,
      default_position: p.position ?? null,
      skill_level: p.grade ? String(p.grade) : null,
      skill_level_description: null,
      notes: null,
    });
    setIsViewOpen(true);
  };

  const sortedPlayers = useMemo(() => {
    const sortableItems = [...playerList];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [playerList, sortConfig]);

  const handleSort = (key: keyof Player) => {
    let direction: SortDirection = 'ascending';
    if (sortConfig?.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleSelectAll = (checked: boolean | 'indeterminate') => {
    if (checked === true) {
      setSelectedPlayerIds(playerList.map((p) => p.id));
    } else {
      setSelectedPlayerIds([]);
    }
  };

  const handleSelectPlayer = (playerId: string, checked: boolean | 'indeterminate') => {
    setSelectedPlayerIds((prev) =>
      checked ? [...prev, playerId] : prev.filter((id) => id !== playerId),
    );
  };

  const numSelected = selectedPlayerIds.length;
  const rowCount = sortedPlayers.length;
  const allPlayersSelected = rowCount > 0 && numSelected === rowCount;
  const colSpan = 5 + (showRemoveButton ? 1 : 0);

  return (
    <Card className="shadow-lg bg-background">
      <TooltipProvider>
        <CardContent className="p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="mb-2">All Players</h3>
              <p className="paragraph-s-regular text-muted-foreground">
                List of all registered players.
              </p>
            </div>
            {showRemoveButton && (
              <Dialog open={isRemoveOpen} onOpenChange={setIsRemoveOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="bg-[#D52020] h-10 hover:bg-[#D52020] hover:opacity-80 hover:cursor-pointer gap-2"
                    disabled={numSelected === 0}
                  >
                    <Trash />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-left">Delete Player(s)?</DialogTitle>
                    <DialogDescription>
                      <p className="font-paragraph text-left">
                        Are you sure you want to delete{' '}
                        <span className="text-red-600">{numSelected}</span> selected player(s)? This
                        action cannot be undone.
                      </p>
                      <div className="flex gap-2 mt-4 justify-end items-end">
                        <Button
                          variant={'outline'}
                          className="hover:cursor-pointer h-10 border-muted-foreground"
                          onClick={() => setIsRemoveOpen(false)}
                          disabled={isDeleting}
                        >
                          Cancel
                        </Button>
                        <Button
                          className="bg-[#D52020] h-10 hover:bg-[#D52020] hover:opacity-80 hover:cursor-pointer"
                          onClick={async () => {
                            try {
                              setIsDeleting(true);
                              if (onRemoveSelected) {
                                await onRemoveSelected(selectedPlayerIds);
                              }
                              setSelectedPlayerIds([]);
                              setIsRemoveOpen(false);
                            } catch (err) {
                              console.error('Failed to delete players', err);
                            } finally {
                              setIsDeleting(false);
                            }
                          }}
                          disabled={isDeleting}
                        >
                          <Trash /> {isDeleting ? 'Deleting...' : 'Delete'}
                        </Button>
                      </div>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            )}
          </div>
          {showAddRow && (
            <div className="mb-4">
              <Button
                variant="ghost"
                className="w-full h-12 flex items-center justify-center gap-3 border-2 border-dashed rounded-md hover:bg-transparent"
                onClick={() => handleAdd?.()}
              >
                <div className="inline-flex items-center justify-center w-6 h-6 rounded border bg-muted-foreground/5">
                  <Plus className="w-4 h-4" />
                </div>
                <span className="font-medium">Add a player</span>
              </Button>
            </div>
          )}

          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow className="hover:bg-transparent border-b">
                  {showRemoveButton && <TableHead className="w-12"></TableHead>}
                  <TableHead
                    className="font-paragraph text-foreground"
                    aria-sort={sortConfig?.key === 'name' ? sortConfig.direction : 'none'}
                  >
                    <button
                      onClick={() => handleSort('name')}
                      className="flex items-center gap-2 hover:text-foreground hover:cursor-pointer transition-colors"
                    >
                      Player Name
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </TableHead>
                  <TableHead
                    className="font-paragraph text-foreground"
                    aria-sort={sortConfig?.key === 'position' ? sortConfig.direction : 'none'}
                  >
                    <button
                      onClick={() => handleSort('position')}
                      className="flex items-center gap-2 hover:text-foreground hover:cursor-pointer transition-colors"
                    >
                      Default Position
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </TableHead>
                  <TableHead className="paragraph-s-medium text-foreground text-center">
                    Jersey No.
                  </TableHead>
                  <TableHead className="paragraph-s-medium text-foreground text-center">
                    Player Grade
                  </TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedPlayers.map((player) => {
                  const isSelected = selectedPlayerIds.includes(player.id);
                  const rowBgClass = showRemoveButton
                    ? isSelected
                      ? '!bg-muted-foreground/10'
                      : 'bg-white odd:bg-white even:bg-white'
                    : '';

                  return (
                    <TableRow key={player.id} className={rowBgClass}>
                      {showRemoveButton && (
                        <TableCell>
                          <Checkbox
                            className="border-muted"
                            checked={isSelected}
                            onCheckedChange={(checked) => handleSelectPlayer(player.id, checked)}
                            aria-label={`Select row for ${player.name}`}
                          />
                        </TableCell>
                      )}
                      <TableCell className="paragraph-s-regular">
                        {player.first_name || player.last_name
                          ? `${player.first_name ?? ''}${player.last_name ? ' ' + player.last_name : ''}`
                          : player.name}
                      </TableCell>
                      <TableCell className="paragraph-s-regular">{player.position}</TableCell>
                      <TableCell className="paragraph-s-regular text-center">
                        {player.jerseyNo}
                      </TableCell>
                      <TableCell className="paragraph-s-regular text-center">
                        {player.grade}
                      </TableCell>
                      <TableCell className="text-center">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-primary cursor-pointer"
                              onClick={() => {
                                openPlayerView(player);
                              }}
                              aria-label="View Player Details"
                            >
                              <RectangleEllipsis className="h-5 w-5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View Player Details</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </TooltipProvider>
      {viewPlayer && (
        <ViewPlayerCard
          open={isViewOpen}
          onOpenChange={(open) => {
            setIsViewOpen(open);
            if (!open) setViewPlayer(null);
          }}
          player={viewPlayer}
        />
      )}
    </Card>
  );
}
