import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { matchApiService } from '@/lib/match';
import type { MatchUpdate } from '@/lib/match';
import { matchStatsApiService } from '@/lib/match-stats';

type Team = {
  team_id: string;
  team_name: string;
};

type EditMatchDialogProps = {
  matchId: string;
  isOpen: boolean;
  onClose: () => void;
  teams: Team[];
  initialData: {
    team1_id: string;
    team2_id: string;
    match_date: string;
    location: string;
    num_of_sets: number;
    is_completed: boolean;
  };
  onMatchUpdated?: () => void;
};

export default function EditMatchDialog({
  matchId,
  isOpen,
  onClose,
  teams,
  initialData,
  onMatchUpdated,
}: EditMatchDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    match_date: '',
    location: '',
    num_of_sets: 3,
  });
  const [matchStatus, setMatchStatus] = useState<'upcoming' | 'completed'>(initialData.is_completed ? 'completed' : 'upcoming');
  const [completedData, setCompletedData] = useState({
    team1_final_score: '',
    team2_final_score: '',
    team1_set_scores: [] as string[],
    team2_set_scores: [] as string[],
  });


  useEffect(() => {
    if (isOpen && initialData) {
      // Format date for input (YYYY-MM-DD)
      const date = new Date(initialData.match_date);
      const formattedDate = date.toISOString().split('T')[0];

      setFormData({
        match_date: formattedDate,
        location: initialData.location,
        num_of_sets: initialData.num_of_sets,
      });
      setMatchStatus(initialData.is_completed ? 'completed' : 'upcoming');
      // Optionally, you can fetch/set completedData from initialData if available
      setCompletedData({
        team1_final_score: '',
        team2_final_score: '',
        team1_set_scores: Array(initialData.num_of_sets).fill(''),
        team2_set_scores: Array(initialData.num_of_sets).fill(''),
      });
    }
  }, [isOpen, initialData]);
  const handleSetScoreChange = (team: 'team1' | 'team2', index: number, value: string) => {
    const scoreArray =
      team === 'team1' ? [...completedData.team1_set_scores] : [...completedData.team2_set_scores];
    scoreArray[index] = value;
    if (team === 'team1') {
      setCompletedData({ ...completedData, team1_set_scores: scoreArray });
    } else {
      setCompletedData({ ...completedData, team2_set_scores: scoreArray });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.match_date || !formData.location || !formData.num_of_sets) {
      alert('Please fill in all fields');
      return;
    }

    // Validate completed match data
    if (matchStatus === 'completed') {
      if (!completedData.team1_final_score || !completedData.team2_final_score) {
        alert('Please fill in all match result fields');
        return;
      }

      const hasEmptySetScores =
        completedData.team1_set_scores.some((s) => !s) ||
        completedData.team2_set_scores.some((s) => !s);

      if (hasEmptySetScores) {
        alert('Please fill in all set scores');
        return;
      }
    }

    try {
      setIsSubmitting(true);
      const matchData: MatchUpdate = {
        match_date: new Date(formData.match_date).toISOString(),
        location: formData.location,
        num_of_sets: formData.num_of_sets,
        is_completed: matchStatus === 'completed',
      };

      await matchApiService.updateMatch(matchId, matchData);

      // If match is completed, update or create match stats for both teams
      if (matchStatus === 'completed') {
        // Final scores are actually sets won
        const team1SetsWon = Number(completedData.team1_final_score);
        const team2SetsWon = Number(completedData.team2_final_score);

        // Calculate total points from all set scores
        let team1TotalScore = 0;
        let team2TotalScore = 0;
        
        for (let i = 0; i < completedData.team1_set_scores.length; i++) {
          team1TotalScore += Number(completedData.team1_set_scores[i]) || 0;
          team2TotalScore += Number(completedData.team2_set_scores[i]) || 0;
        }

        // Use updateMatchResults to update both teams atomically
        await matchStatsApiService.updateMatchResults(matchId, {
          team1_id: initialData.team1_id,
          team1_stats: {
            total_score: team1TotalScore,
            sets_won: team1SetsWon,
            sets_lost: team2SetsWon,
          },
          team2_id: initialData.team2_id,
          team2_stats: {
            total_score: team2TotalScore,
            sets_won: team2SetsWon,
            sets_lost: team1SetsWon,
          },
        });
      }

      onClose();
      onMatchUpdated?.();
    } catch (error) {
      console.error('Failed to update match:', error);
      alert('Failed to update match. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] flex flex-col max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Match Details</DialogTitle>
        </DialogHeader>
        <hr className="w-[calc(100%+3rem)] -ml-6 border-t border-[#A3A3A3] flex-shrink-0" />
        {/* Scrollable Content */}
        <div className="overflow-y-auto px-1 py-2 flex-1">
          <form id="edit-match-form" onSubmit={handleSubmit} className="space-y-4 mt-2">
            {/* Team 1 - Read Only */}
            <div className="space-y-2">
              <Label htmlFor="team1">Team 1</Label>
              <Input
                id="team1"
                type="text"
                value={teams.find((t) => t.team_id === initialData.team1_id)?.team_name || 'N/A'}
                disabled
                className="bg-gray-100"
              />
            </div>

            {/* Team 2 - Read Only */}
            <div className="space-y-2">
              <Label htmlFor="team2">Team 2</Label>
              <Input
                id="team2"
                type="text"
                value={teams.find((t) => t.team_id === initialData.team2_id)?.team_name || 'N/A'}
                disabled
                className="bg-gray-100"
              />
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="match_date">
                Match Date <span className="text-secondary-alt">*</span>
              </Label>
              <Input
                id="match_date"
                type="date"
                value={formData.match_date}
                onChange={(e) => setFormData({ ...formData, match_date: e.target.value })}
                className="cursor-pointer"
                required
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">
                Location <span className="text-secondary-alt">*</span>
              </Label>
              <Input
                id="location"
                type="text"
                placeholder="Enter match location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>

            {/* Number of Sets */}
            <div className="space-y-2">
              <Label htmlFor="num_of_sets">
                Number of Sets <span className="text-secondary-alt">*</span>
              </Label>
              <Input
                id="num_of_sets"
                type="number"
                min="1"
                max="5"
                value={formData.num_of_sets}
                onChange={(e) =>
                  setFormData({ ...formData, num_of_sets: parseInt(e.target.value) || 1 })
                }
                required
              />
            </div>

            {/* Match Status - Editable */}
            <div className="space-y-2">
              <Label>
                Match Status <span className="text-secondary-alt">*</span>
              </Label>
              <RadioGroup
                value={matchStatus}
                onValueChange={(value: 'upcoming' | 'completed') => setMatchStatus(value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="upcoming" id="upcoming" />
                  <Label htmlFor="upcoming" className="cursor-pointer pg3 font-normal">
                    Upcoming
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="completed" id="completed" />
                  <Label htmlFor="completed" className="cursor-pointer pg3 font-normal">
                    Completed
                  </Label>
                </div>
              </RadioGroup>
            </div>
            {/* Completed Match Extra Fields */}
            {matchStatus === 'completed' && (
              <>
                <hr className="w-[calc(100%+3rem)] -ml-6 border-t border-[#A3A3A3] flex-shrink-0" />
                <div className="grid grid-cols gap-4">
                  <p className="pg1-bold text-gray-500">Final Results</p>
                  <div className="grid grid-cols-2 gap-3 pg-3">
                    <div className="flex flex-col h-full gap-2">
                      <Label htmlFor="team1_final_score" className="h-full">
                        {teams.find((t) => t.team_id === initialData.team1_id)?.team_name || 'Team 1'}
                        <span className="text-secondary-alt">*</span>
                      </Label>
                      <Input
                        id="team1_final_score"
                        type="number"
                        min="0"
                        max="5"
                        placeholder="Final score"
                        value={completedData.team1_final_score}
                        onChange={(e) =>
                          setCompletedData({ ...completedData, team1_final_score: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="flex flex-col h-full gap-2">
                      <Label htmlFor="team2_final_score" className="h-full">
                        {teams.find((t) => t.team_id === initialData.team2_id)?.team_name || 'Team 2'}
                        <span className="text-secondary-alt">*</span>
                      </Label>
                      <Input
                        id="team2_final_score"
                        type="number"
                        min="0"
                        max="5"
                        placeholder="Final Score"
                        value={completedData.team2_final_score}
                        onChange={(e) =>
                          setCompletedData({ ...completedData, team2_final_score: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Set Scores */}
                {formData.num_of_sets && formData.num_of_sets > 0 && (
                  <div className="flex flex-col h-full gap-3 ">
                    {Array.from({ length: Math.min(formData.num_of_sets, 5) }, (_, i) => (
                      <div key={i}>
                        <p className="pg2 text-gray-500">Set {i + 1}</p>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex flex-col h-full gap-2">
                            <Label htmlFor={`team1_set_${i}`} className="h-full pg1">
                              {teams.find((t) => t.team_id === initialData.team1_id)?.team_name || 'Team 1'}
                              <span className="text-secondary-alt">*</span>
                            </Label>
                            <Input
                              id={`team1_set_${i}`}
                              type="number"
                              min="0"
                              placeholder="Score"
                              value={completedData.team1_set_scores[i] || ''}
                              onChange={(e) => handleSetScoreChange('team1', i, e.target.value)}
                              required
                            />
                          </div>

                          <div className="flex flex-col h-full gap-2">
                            <Label htmlFor={`team2_set_${i}`} className="h-full pg1">
                              {teams.find((t) => t.team_id === initialData.team2_id)?.team_name || 'Team 2'}
                              <span className="text-secondary-alt">*</span>
                            </Label>
                            <Input
                              id={`team2_set_${i}`}
                              type="number"
                              min="0"
                              placeholder="Score"
                              value={completedData.team2_set_scores[i] || ''}
                              onChange={(e) => handleSetScoreChange('team2', i, e.target.value)}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </form>
        </div>
        <hr className="w-[calc(100%+3rem)] -ml-6 border-t border-[#A3A3A3] flex-shrink-0" />
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="cursor-pointer"
          >
            Cancel
          </Button>

          <Button type="submit" form="edit-match-form" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
