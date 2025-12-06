import TeamManagementCard from '@/components/common/team-management-card';
import TeamViewButtons from '@/components/navigation/team-view-buttons';
import TeamDetailsComponent from '@/components/common/team-details';
import ViewTeamPlayersCard from '@/components/common/view-team-players-card';
import AddTeamDetails from '@/components/common/add-team-details';
import CreateRoster from '@/components/common/create-roster';
import SelectedPlayersCard from '@/components/common/select-players-card';
import { useParams, useNavigate } from 'react-router-dom';
import { useTeam } from '@/hooks/use-team';
import { useMemo, useState } from 'react';
import type { ApiPlayer } from '@/lib/api';

export default function TeamDetails() {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const { team, isLoading, error } = useTeam(teamId || null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTeamName, setEditTeamName] = useState('');
  const [editLeagueId, setEditLeagueId] = useState('');
  const [selectedPlayers, setSelectedPlayers] = useState<ApiPlayer[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<'manual' | 'automatic' | null>(null);
  const [isSaving] = useState(false);

  const players = useMemo(() => {
    // Always show mock data for now
    const mockPlayers = [
      {
        player_id: 'mock-1',
        first_name: 'John',
        last_name: 'Doe',
        jersey_number: 77,
        default_position: 'Middle Blocker',
        created_at: new Date().toISOString(),
        skill_level: 7,
        position: 'Middle Blocker',
      },
      {
        player_id: 'mock-2',
        first_name: 'Jane',
        last_name: 'Smith',
        jersey_number: 12,
        default_position: 'Outside Hitter',
        created_at: new Date().toISOString(),
        skill_level: 8,
        position: 'Outside Hitter',
      },
      {
        player_id: 'mock-3',
        first_name: 'Mike',
        last_name: 'Johnson',
        jersey_number: 5,
        default_position: 'Setter',
        created_at: new Date().toISOString(),
        skill_level: 9,
        position: 'Setter',
      },
      {
        player_id: 'mock-4',
        first_name: 'Sarah',
        last_name: 'Williams',
        jersey_number: 23,
        default_position: 'Libero',
        created_at: new Date().toISOString(),
        skill_level: 6,
        position: 'Libero',
      },
      {
        player_id: 'mock-5',
        first_name: 'Alex',
        last_name: 'Brown',
        jersey_number: 8,
        default_position: 'Opposite Hitter',
        created_at: new Date().toISOString(),
        skill_level: 7,
        position: 'Opposite Hitter',
      },
      {
        player_id: 'mock-6',
        first_name: 'Emily',
        last_name: 'Davis',
        jersey_number: 15,
        default_position: 'Middle Blocker',
        created_at: new Date().toISOString(),
        skill_level: 8,
        position: 'Middle Blocker',
      },
      {
        player_id: 'mock-1',
        first_name: 'John',
        last_name: 'Doe',
        jersey_number: 77,
        default_position: 'Middle Blocker',
        created_at: new Date().toISOString(),
        skill_level: 7,
        position: 'Middle Blocker',
      },
      {
        player_id: 'mock-1',
        first_name: 'John',
        last_name: 'Doe',
        jersey_number: 77,
        default_position: 'Middle Blocker',
        created_at: new Date().toISOString(),
        skill_level: 7,
        position: 'Middle Blocker',
      },
      {
        player_id: 'mock-1',
        first_name: 'John',
        last_name: 'Doe',
        jersey_number: 77,
        default_position: 'Middle Blocker',
        created_at: new Date().toISOString(),
        skill_level: 7,
        position: 'Middle Blocker',
      },
      {
        player_id: 'mock-1',
        first_name: 'John',
        last_name: 'Doe',
        jersey_number: 77,
        default_position: 'Middle Blocker',
        created_at: new Date().toISOString(),
        skill_level: 7,
        position: 'Middle Blocker',
      },
      {
        player_id: 'mock-1',
        first_name: 'John',
        last_name: 'Doe',
        jersey_number: 77,
        default_position: 'Middle Blocker',
        created_at: new Date().toISOString(),
        skill_level: 7,
        position: 'Middle Blocker',
      },
    ];

    if (!team?.team_players || team.team_players.length === 0) {
      return mockPlayers;
    }

    const realPlayers = team.team_players
      .filter((tp) => tp.leave_date === null && tp.player)
      .map((tp) => ({
        ...tp.player!,
        skill_level: 0,
        position: tp.position || tp.player!.default_position,
      }));

    // Return real players if available, otherwise mock data
    return realPlayers.length > 0 ? realPlayers : mockPlayers;
  }, [team]);

  const handleBack = () => {
    navigate('/teams');
  };

  const handleNext = () => {
    // TODO: Implement next navigation
  };

  const handleEditToggle = (editing: boolean) => {
    setIsEditing(editing);
    if (editing && team) {
      // Initialize edit state with current team data
      setEditTeamName(team.team_name);
      setEditLeagueId(team.league?.league_id || '');
      // Convert players to ApiPlayer format
      const apiPlayers: ApiPlayer[] = players.map((p) => ({
        player_id: p.player_id,
        first_name: p.first_name,
        last_name: p.last_name || '',
        jersey_number: p.jersey_number || 0,
        default_position: p.default_position || '',
        created_at: p.created_at,
      }));
      setSelectedPlayers(apiPlayers);
      setSelectedMethod('manual');
    }
  };

  const handleAddPlayer = (player: ApiPlayer) => {
    if (!selectedPlayers.find((p) => p.player_id === player.player_id)) {
      setSelectedPlayers([...selectedPlayers, player]);
    }
  };

  const handleRemovePlayer = (playerId: string) => {
    setSelectedPlayers(selectedPlayers.filter((p) => p.player_id !== playerId));
  };

  const handleSave = () => {
    // TODO: Implement save logic
    console.log('Saving team changes...');
  };

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center p-5 md:p-5 lg:p-20 w-full min-h-[calc(100vh-5rem)]"
        style={{
          backgroundImage: `url('/assets/Grunge.png')`,
          backgroundSize: 'auto',
          backgroundRepeat: 'repeat',
        }}
      >
        <p className="text-lg">Loading team details...</p>
      </div>
    );
  }

  if (error || !team) {
    return (
      <div
        className="flex items-center justify-center p-5 md:p-5 lg:p-20 w-full min-h-[calc(100vh-5rem)]"
        style={{
          backgroundImage: `url('/assets/Grunge.png')`,
          backgroundSize: 'auto',
          backgroundRepeat: 'repeat',
        }}
      >
        <p className="text-lg text-red-600">{error || 'Team not found'}</p>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col gap-6 items-center p-5 md:p-5 lg:p-20 justify-start w-full min-h-[calc(100vh-5rem)]"
      style={{
        backgroundImage: `url('/assets/Grunge.png')`,
        backgroundSize: 'auto',
        backgroundRepeat: 'repeat',
      }}
    >
      <TeamViewButtons
        onBack={handleBack}
        onNext={handleNext}
        isEditing={isEditing}
        onEditToggle={handleEditToggle}
      />
      <div className="flex flex-col lg:flex-row gap-6 w-full lg:items-start">
        <div className="flex flex-col gap-6 lg:w-1/3">
          {!isEditing ? (
            <>
              <TeamManagementCard
                name={team.team_name}
                playerCount={team.active_player_count || 0}
                teamId={team.team_id}
              />
              <TeamDetailsComponent
                teamName={team.team_name}
                leagueName={team.league?.league_name || 'Unknown League'}
                teamId={team.team_id}
              />
            </>
          ) : (
            <>
              <AddTeamDetails
                teamName={editTeamName}
                onTeamNameChange={setEditTeamName}
                leagueId={editLeagueId}
                onLeagueChange={setEditLeagueId}
              />
              <CreateRoster
                selectedMethod={selectedMethod}
                onMethodChange={setSelectedMethod}
                onPlayerAdd={handleAddPlayer}
                selectedPlayerIds={selectedPlayers.map((p) => p.player_id)}
              />
            </>
          )}
        </div>
        <div className="lg:w-2/3">
          {!isEditing ? (
            <ViewTeamPlayersCard
              players={players}
              onRemovePlayer={() => {}}
              onSave={() => {}}
              isSaving={false}
              isEditing={isEditing}
            />
          ) : (
            <SelectedPlayersCard
              players={selectedPlayers}
              onRemovePlayer={handleRemovePlayer}
              onSave={handleSave}
              isSaving={isSaving}
            />
          )}
        </div>
      </div>
    </div>
  );
}
