# Match Team Stats API Integration

This document describes the frontend integration for the Match Team Stats API.

## Overview

The Match Team Stats API provides complete CRUD functionality for managing match statistics, following the existing three-layer architecture pattern (Repository → Use Case → Controller).

## File Structure

```
src/lib/match-stats/
├── index.ts                  # Exports
├── match-stats.types.ts      # TypeScript type definitions
└── match-stats.service.ts    # API service methods
```

## Type Definitions

### Core Types

```typescript
// Simple match team stats (without relationships)
MatchTeamStatsSimple {
  match_team_stats_id: string;
  match_id: string;
  team_id: string;
  total_score?: number;
  sets_won?: number;
  sets_lost?: number;
  is_winner?: boolean;
}

// Full match team stats (with relationships)
MatchTeamStatsFull {
  match_team_stats_id: string;
  total_score?: number;
  sets_won?: number;
  sets_lost?: number;
  is_winner?: boolean;
  match?: { ... };  // Match details
  team?: { ... };   // Team details
}
```

### Match Results Types

```typescript
MatchResultsSummary {
  final_scores: {
    team1_name: string;
    team1_total_score: number;
    team2_name: string;
    team2_total_score: number;
  };
  final_sets: {
    team1_sets_won: number;
    team2_sets_won: number;
  };
}
```

## API Service Methods

### Import the Service

```typescript
import { matchStatsApiService } from '@/lib/match-stats';
```

### Available Methods

#### 1. Create Match Team Stats

```typescript
const stats = await matchStatsApiService.createMatchTeamStats({
  match_id: 'match-uuid',
  team_id: 'team-uuid',
  total_score: 75,
  sets_won: 3,
  sets_lost: 1,
  is_winner: true,
});
```

#### 2. Get Stats by Match ID

Fetch statistics for both teams in a match:

```typescript
const stats = await matchStatsApiService.getMatchTeamStatsByMatch('match-uuid');
// Returns: MatchTeamStatsFull[] (array of 2 teams)
```

#### 3. Get Stats by Team ID

Fetch all match statistics for a specific team:

```typescript
const stats = await matchStatsApiService.getMatchTeamStatsByTeam('team-uuid');
// Returns: MatchTeamStatsFull[] (all matches for the team)
```

#### 4. Get Match Results Summary

Get formatted results for both teams:

```typescript
const results = await matchStatsApiService.getMatchResults('match-uuid');
console.log(results.final_scores.team1_name); // "Team A"
console.log(results.final_sets.team1_sets_won); // 3
```

#### 5. Update Match Results (Both Teams)

Update statistics for both teams in a single atomic transaction:

```typescript
const updatedResults = await matchStatsApiService.updateMatchResults('match-uuid', {
  team1_id: 'team1-uuid',
  team1_stats: {
    total_score: 75,
    sets_won: 3,
    sets_lost: 1,
  },
  team2_id: 'team2-uuid',
  team2_stats: {
    total_score: 68,
    sets_won: 1,
    sets_lost: 3,
  },
});
```

#### 6. Update Individual Stats

```typescript
const updated = await matchStatsApiService.updateMatchTeamStats('stats-uuid', {
  total_score: 80,
  sets_won: 3,
  is_winner: true,
});
```

#### 7. Delete Match Team Stats

```typescript
await matchStatsApiService.deleteMatchTeamStats('stats-uuid');
```

#### 8. List All Stats (with pagination)

```typescript
const allStats = await matchStatsApiService.listMatchTeamStats(0, 100);
// skip: 0, limit: 100
```

## Usage Examples

### Example 1: Display Match Stats in a Component

```typescript
import { useEffect, useState } from 'react';
import { matchStatsApiService, MatchTeamStatsFull } from '@/lib/match-stats';

function MatchStatsDisplay({ matchId }: { matchId: string }) {
  const [stats, setStats] = useState<MatchTeamStatsFull[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const data = await matchStatsApiService.getMatchTeamStatsByMatch(matchId);
      setStats(data);
    };
    fetchStats();
  }, [matchId]);

  return (
    <div>
      {stats.map((stat) => (
        <div key={stat.match_team_stats_id}>
          <p>{stat.team?.team_name}</p>
          <p>Score: {stat.total_score}</p>
          <p>Sets: {stat.sets_won} - {stat.sets_lost}</p>
        </div>
      ))}
    </div>
  );
}
```

### Example 2: Update Match Results Form

```typescript
const handleSubmitResults = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const results = await matchStatsApiService.updateMatchResults(matchId, {
      team1_id: formData.team1_id,
      team1_stats: {
        total_score: parseInt(formData.team1_score),
        sets_won: parseInt(formData.team1_sets_won),
        sets_lost: parseInt(formData.team1_sets_lost),
      },
      team2_id: formData.team2_id,
      team2_stats: {
        total_score: parseInt(formData.team2_score),
        sets_won: parseInt(formData.team2_sets_won),
        sets_lost: parseInt(formData.team2_sets_lost),
      },
    });

    console.log('Results updated:', results);
    onSuccess?.();
  } catch (error) {
    console.error('Failed to update results:', error);
  }
};
```

### Example 3: Fetch Team History

```typescript
const loadTeamHistory = async (teamId: string) => {
  try {
    const history = await matchStatsApiService.getMatchTeamStatsByTeam(teamId);

    // Calculate win percentage
    const wins = history.filter((stat) => stat.is_winner).length;
    const winPercentage = (wins / history.length) * 100;

    return { history, wins, winPercentage };
  } catch (error) {
    console.error('Failed to load team history:', error);
  }
};
```

## Integration with Existing Components

The match stats are already being fetched as part of the league data structure. To display them in existing components:

### In `view-league-matches-card.tsx`:

```typescript
// Stats are already available in the match object
const team1Stats = match.match_stats?.find(s => s.team_id === match.team1?.team_id);
const team2Stats = match.match_stats?.find(s => s.team_id === match.team2?.team_id);

// Display the stats
<p>Team 1 Score: {team1Stats?.total_score}</p>
<p>Team 2 Score: {team2Stats?.total_score}</p>
```

### To Fetch Fresh Stats:

If you need to fetch the latest stats independently:

```typescript
const refreshMatchStats = async (matchId: string) => {
  const stats = await matchStatsApiService.getMatchTeamStatsByMatch(matchId);
  // Update your component state
  setMatchStats(stats);
};
```

## Backend API Endpoints

The service calls these backend endpoints:

- `POST /match-stats/` - Create stats
- `GET /match-stats/` - List all stats
- `GET /match-stats/{id}` - Get by ID
- `GET /match-stats/match/{match_id}` - Get by match
- `GET /match-stats/team/{team_id}` - Get by team
- `PUT /match-stats/{id}` - Update stats
- `DELETE /match-stats/{id}` - Delete stats
- `GET /match-stats/matches/{match_id}/results` - Get results summary
- `PUT /match-stats/matches/{match_id}/results` - Update results

## Error Handling

All service methods throw errors that should be caught:

```typescript
try {
  const stats = await matchStatsApiService.getMatchTeamStatsByMatch(matchId);
} catch (error) {
  if (error instanceof Error) {
    console.error('Error message:', error.message);
  }
  // Handle error (show notification, etc.)
}
```

## Best Practices

1. **Use `getMatchTeamStatsByMatch`** when you need both teams' stats for a specific match
2. **Use `getMatchResults`** when you need a formatted summary with winner information
3. **Use `updateMatchResults`** to update both teams atomically (ensures consistency)
4. **Use `getMatchTeamStatsByTeam`** to display team history and statistics
5. **Cache results** in component state to avoid unnecessary API calls
6. **Handle loading and error states** for better UX

## Reference Implementation

See `src/components/common/match-stats-example.tsx` for complete working examples.
