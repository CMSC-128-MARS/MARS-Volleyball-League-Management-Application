import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect, useState } from 'react';
import PlayerDetailsTable from '@/components/common/player-details-table';
import { playerService } from '@/lib/players';

interface Player {
  id: string;
  name: string;
  position: string;
  jerseyNo: number;
  grade: number;
}

const Players = () => {
  const handleViewDetails = (player: Player): void => {
    console.log(`Viewing details for ID: ${player.id}`);
    alert(`Viewing details for ${player.name} (${player.position})`);
  };

  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);

  const loadPlayers = async () => {
    setLoading(true);
    try {
      const data = await playerService.fetchPlayers();
      // Map service Player -> page Player shape (ensure `grade` exists)
      setPlayers(
        data.map((p: any) => ({
          id: p.id,
          name: p.name,
          position: p.position ?? '',
          jerseyNo: p.jerseyNo ?? 0,
          grade: p.grade ?? 0,
        })),
      );
    } catch (err) {
      console.error('Failed to load players', err);
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPlayers();
  }, []);

  const handleAdd = async () => {
    const firstName = window.prompt('First name');
    if (!firstName) return;
    const lastName = window.prompt('Last name (optional)');
    try {
      await playerService.createPlayer({ first_name: firstName, last_name: lastName || undefined });
      await loadPlayers();
      alert('Player created');
    } catch (err) {
      console.error('Failed to create player', err);
      alert('Failed to create player');
    }
  };

  const handleRemoveSelected = async (ids: string[]) => {
    if (!ids || ids.length === 0) return;
    const ok = window.confirm(
      `Delete ${ids.length} selected player(s)? This action cannot be undone.`,
    );
    if (!ok) return;
    try {
      for (const id of ids) {
        await playerService.deletePlayer(id);
      }
      await loadPlayers();
      alert('Selected players deleted');
    } catch (err) {
      console.error('Failed to delete players', err);
      alert('Failed to delete selected players');
    }
  };

  return (
    <div
      className="w-full min-h-screen"
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
    </div>
  );
};

export default Players;
