import LeagueViewButtons from '@/components/navigation/league-view-buttons';
import LeagueDetailsComponent from '@/components/common/league-details';
import ViewLeagueTeamsCard from '@/components/common/view-league-teams-card';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { leagueApiService } from '@/lib/league';
import type { LeagueFull } from '@/lib/league';
import type { Team } from '@/lib/team';
import type { Match } from '@/lib/match';

export default function LeagueDetails() {
  const { leagueId } = useParams<{ leagueId: string }>();
  const navigate = useNavigate();
  const [league, setLeague] = useState<LeagueFull | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchLeagueData = useCallback(async () => {
    if (!leagueId) return;
    try {
      setIsLoading(true);
      const data = await leagueApiService.fetchLeague(leagueId);
      setLeague(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load league');
    } finally {
      setIsLoading(false);
    }
  }, [leagueId]);

  useEffect(() => {
    fetchLeagueData();
  }, [fetchLeagueData]);

  const handleBack = () => {
    navigate('/leagues');
  };

  const handleEditToggle = (editing: boolean) => {
    setIsEditing(editing);
  };

  const handleDelete = async () => {
    if (!leagueId) return;

    try {
      await leagueApiService.deleteLeague(leagueId);
      navigate('/leagues');
    } catch (error) {
      console.error('Failed to delete league:', error);
      alert('Failed to delete league. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div
        className="bg-background text-primary-foreground relative overflow-auto h-full"
        style={{
          backgroundImage: `url('/assets/Grunge.png')`,
          backgroundSize: 'auto',
          backgroundRepeat: 'repeat',
        }}
      >
        <div className="py-[56px] md:px-[20px] lg:px-[80px] min-h-full gap-[36px] flex flex-col items-center justify-center">
          <p className="text-lg">Loading league details...</p>
        </div>
      </div>
    );
  }

  if (error || !league) {
    return (
      <div
        className="bg-background text-primary-foreground relative overflow-auto h-full"
        style={{
          backgroundImage: `url('/assets/Grunge.png')`,
          backgroundSize: 'auto',
          backgroundRepeat: 'repeat',
        }}
      >
        <div className="py-[56px] md:px-[20px] lg:px-[80px] min-h-full gap-[36px] flex flex-col items-center justify-center">
          <p className="text-lg text-red-600">{error || 'League not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-background text-primary-foreground relative overflow-auto h-full"
      style={{
        backgroundImage: `url('/assets/Grunge.png')`,
        backgroundSize: 'auto',
        backgroundRepeat: 'repeat',
      }}
    >
      <div className="py-[56px] md:px-[20px] lg:px-[80px] min-h-full gap-[36px] flex flex-col">
        <LeagueViewButtons
          onBack={handleBack}
          isEditing={isEditing}
          onEditToggle={handleEditToggle}
          onDelete={handleDelete}
          leagueName={league.league_name}
        />
        <div className="flex flex-col lg:flex-row gap-6 w-full lg:items-start">
          {/* Left Column: Details and Team Standings */}
          <div className="flex flex-col gap-6 lg:w-1/3">
            <LeagueDetailsComponent
              leagueId={league.league_id}
              leagueName={league.league_name}
              location={league.location}
              description={league.description}
              isEditing={isEditing}
              onSaved={fetchLeagueData}
            />
            <ViewLeagueTeamsCard
              teams={league.teams as Team[]}
              matches={league.matches as Match[]}
              showTeamsOnly={true}
              isEditing={isEditing}
              leagueId={league.league_id}
              onMatchesChange={fetchLeagueData}
            />
          </div>
          {/* Right Column: Matches */}
          <div className="lg:w-2/3">
            <ViewLeagueTeamsCard
              teams={league.teams as Team[]}
              matches={league.matches as Match[]}
              showMatchesOnly={true}
              isEditing={isEditing}
              leagueId={league.league_id}
              onMatchesChange={fetchLeagueData}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
