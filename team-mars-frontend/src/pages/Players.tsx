import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect, useState } from 'react';
import type { PlayerCreateDto } from '@/lib/players';
import PlayerDetailsTable from '@/components/common/player-details-table';
import { playerService } from '@/lib/players';
import AddPlayerCard from '@/components/common/add-player-card';
import { toast } from 'sonner';

interface Player {
  id: string;
  name: string;
  first_name?: string | null;
  last_name?: string | null;
  position: string;
  jerseyNo: number;
  grade?: number | null;
  notes?: string | null;
  skill_notes?: string | null;
  skill_level?: number | null;
}

const Players = () => {
  const handleViewDetails = (player: Player): void => {
    console.log(`Viewing details for ID: ${player.id}`);
  };

  const [players, setPlayers] = useState<Player[]>([]);
  const [, setLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const loadPlayers = async () => {
    setLoading(true);
    try {
      const data = await playerService.fetchPlayers();
      setPlayers(
        data.map((p) => ({
          id: p.id,
          name: `${p.first_name || ''} ${p.last_name || ''}`.trim(),
          first_name: p.first_name,
          last_name: p.last_name,
          position: p.position ?? '',
          jerseyNo: p.jerseyNo ?? 0,
          grade: p.grade ?? null,
          skill_level: p.skill_level ?? p.grade ?? null,
          // include notes so the table/view can display them
          notes: p.notes ?? null,
          skill_notes: p.skill_notes ?? null,
        })),
      );
    } catch (err) {
      console.error('Failed to load players', err);
      toast.error('Failed to load players. Please try again.', { duration: 5000, style: {
        color: "var(--destructive)", borderRadius: "2px", border: "2px solid var(--destructive)"
      } })
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPlayers();
  }, []);

  const handleAdd = async () => {
    setIsAddDialogOpen(true);
  };

  const handleCreatePlayer = async (payload: PlayerCreateDto) => {
    let loadingToastId: string | number | undefined;
    try {
      loadingToastId = toast.loading('Creating player...', {
        duration: 5000,
        style: {
          borderRadius: '2px',
          border: '2px solid var(--border)',
        },
      });
      await playerService.createPlayer(payload);
      await loadPlayers();
      toast.dismiss(loadingToastId);
      setIsAddDialogOpen(false);
    } catch (err) {
      console.error('Failed to create player', err);
      toast.dismiss(loadingToastId);
      toast.error('Failed to create player. Please try again.', { duration: 5000, style: {
        color: "var(--destructive)", borderRadius: "2px", border: "2px solid var(--destructive)"
      } })
    }
  };

  const handleRemoveSelected = async (ids: string[]) => {
    if (!ids || ids.length === 0) return;
    let loadingToastId: string | number | undefined;
    try {
      loadingToastId = toast.loading('Deleting player(s)...', {
        duration: 5000,
        style: {
          borderRadius: '2px',
          border: '2px solid var(--border)',
        },
      });
      for (const id of ids) {
        await playerService.deletePlayer(id);
      }
      await loadPlayers();
      toast.dismiss(loadingToastId);
      toast.info('Player(s) have been deleted.', {
        duration: 5000,
        style: {
          color: "var(--primary)",
          borderRadius: "2px",
          border: "2px solid var(--primary)"
        }
      });
    } catch (err) {
      console.error('Failed to delete players', err);
      toast.dismiss(loadingToastId);
      toast.error('Failed to delete players. Please try again.', { duration: 5000, style: {
        color: "var(--destructive)", borderRadius: "2px", border: "2px solid var(--destructive)"
      } })
    }
  };

  return (
    <div
      className="w-full relative overflow-auto h-full"
      style={{
        backgroundImage: `url('/assets/Grunge.png')`,
        backgroundSize: 'auto',
        backgroundRepeat: 'repeat',
      }}
    >
      <Tabs defaultValue="view" className="w-full">
        <div className="w-full max-w-4xl xl:max-w-5xl mx-auto px-4 md:px-8">
          <div className="justify-center items-center pt-8 px-8 pb-4 flex flex-col gap-5">
            <h2 className="text-center">Player Management</h2>

            <TabsList className="shadow-md">
              <TabsTrigger
                value="view"
                className="data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                View
              </TabsTrigger>
              <TabsTrigger
                value="add"
                className="data-[state=active]:bg-[#15803D] data-[state=active]:text-white"
              >
                Add
              </TabsTrigger>
              <TabsTrigger
                value="remove"
                className="data-[state=active]:bg-[#D52020] data-[state=active]:text-white"
              >
                Remove
              </TabsTrigger>
            </TabsList>
          </div>
        </div>
        <div className="w-full px-4 md:px-10 lg:px-12 xl:px-16 my-4">
          <hr className="border-t border-[#A3A3A3]" role="separator" aria-label="Section divider" />
        </div>
        <div className="w-full px-4 md:px-10 lg:px-12 xl:px-16">
          <TabsContent value="view">
            <PlayerDetailsTable playerList={players} handleViewDetails={handleViewDetails} />
          </TabsContent>
          <TabsContent value="add">
            <PlayerDetailsTable
              playerList={players}
              handleViewDetails={handleViewDetails}
              showAddRow={true}
              handleAdd={handleAdd}
            />
          </TabsContent>
          <TabsContent value="remove">
            <PlayerDetailsTable
              playerList={players}
              handleViewDetails={handleViewDetails}
              showRemoveButton={true}
              onRemoveSelected={handleRemoveSelected}
            />
          </TabsContent>
        </div>
      </Tabs>
      <AddPlayerCard
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onCreate={handleCreatePlayer}
      />
    </div>
  );
};

export default Players;
