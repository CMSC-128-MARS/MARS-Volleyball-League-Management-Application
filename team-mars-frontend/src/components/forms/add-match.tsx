import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectGroup,
} from '@/components/ui/select';
import { matchApiService } from '@/lib/match';
import type { MatchCreate } from '@/lib/match';

type Team = {
  team_id: string;
  team_name: string;
};

type AddMatchDialogProps = {
  leagueId: string;
  teams: Team[];
  onMatchAdded?: () => void;
};

export default function AddMatchDialog({ leagueId, teams, onMatchAdded }: AddMatchDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [matchStatus, setMatchStatus] = useState<'upcoming' | 'completed'>('upcoming');
  const [formData, setFormData] = useState({
    team1_id: '',
    team2_id: '',
    match_date: '',
    location: '',
  });
  const [completedData, setCompletedData] = useState({
    winner_team_id: '',
    sets_played: '',
    team1_final_score: '',
    team2_final_score: '',
    team1_set_scores: [] as string[],
    team2_set_scores: [] as string[],
  });

  const handleSetsPlayedChange = (value: string) => {
    const numSets = parseInt(value);
    if (!isNaN(numSets) && numSets > 0) {
      setCompletedData({
        ...completedData,
        sets_played: value,
        team1_set_scores: Array(numSets).fill(''),
        team2_set_scores: Array(numSets).fill(''),
      });
    }
  };

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

    if (!formData.team1_id || !formData.team2_id || !formData.match_date || !formData.location) {
      alert('Please fill in all fields');
      return;
    }

    if (formData.team1_id === formData.team2_id) {
      alert('Please select different teams');
      return;
    }

    if (matchStatus === 'completed') {
      // Automatically determine winner_team_id
      let winner_team_id = '';
      const team1Score = Number(completedData.team1_final_score);
      const team2Score = Number(completedData.team2_final_score);
      if (!isNaN(team1Score) && !isNaN(team2Score)) {
        if (team1Score > team2Score) {
          winner_team_id = formData.team1_id;
        } else if (team2Score > team1Score) {
          winner_team_id = formData.team2_id;
        } // If tie, winner_team_id remains ''
      }
      setCompletedData((prev) => ({ ...prev, winner_team_id }));

      if (
        !completedData.sets_played ||
        !completedData.team1_final_score ||
        !completedData.team2_final_score
      ) {
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
      const matchData: MatchCreate = {
        league_id: leagueId,
        team1_id: formData.team1_id,
        team2_id: formData.team2_id,
        match_date: new Date(formData.match_date).toISOString(),
        location: formData.location,
      };

      await matchApiService.createMatch(matchData);

      setIsOpen(false);
      setFormData({ team1_id: '', team2_id: '', match_date: '', location: '' });
      setCompletedData({
        winner_team_id: '',
        sets_played: '',
        team1_final_score: '',
        team2_final_score: '',
        team1_set_scores: [],
        team2_set_scores: [],
      });
      setMatchStatus('upcoming');
      onMatchAdded?.();
    } catch (error) {
      console.error('Failed to create match:', error);
      alert('Failed to create match. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="w-full px-6 py-2  cursor-pointer">
          Add a match
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] flex flex-col max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Add New Match</DialogTitle>
        </DialogHeader>
        <hr className="w-[calc(100%+3rem)] -ml-6 border-t border-[#A3A3A3] flex-shrink-0" />
        {/* Scrollable Content */}
        <div className="overflow-y-auto px-1 py-2 flex-1">
          <form id="add-match-form" onSubmit={handleSubmit} className="space-y-4 mt-2">
            {/* Team 1 */}
            <div className="space-y-2">
              <Label htmlFor="team1">
                Team 1 <span className="text-secondary-alt">*</span>
              </Label>
              <Select
                value={formData.team1_id}
                onValueChange={(value) => setFormData({ ...formData, team1_id: value })}
              >
                <SelectTrigger
                  id="team1"
                  className="w-full rounded-sm border border-[#E5E5E5] bg-white shadow cursor-pointer"
                >
                  <SelectValue placeholder="--" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Select first team</SelectLabel>
                    {teams.length === 0 && (
                      <div className="px-2 py-1.5 text-sm text-muted-foreground">No teams available</div>
                    )}
                    {teams.map((team) => (
                      <SelectItem
                        key={team.team_id}
                        value={team.team_id}
                        disabled={team.team_id === formData.team2_id}
                        className="cursor-pointer"
                      >
                        {team.team_name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Team 2 */}
            <div className="space-y-2">
              <Label htmlFor="team2">
                Team 2 <span className="text-secondary-alt">*</span>
              </Label>
              <Select
                value={formData.team2_id}
                onValueChange={(value) => setFormData({ ...formData, team2_id: value })}
              >
                <SelectTrigger
                  id="team2"
                  className="w-full rounded-sm border border-[#E5E5E5] shadow cursor-pointer"
                >
                  <SelectValue placeholder="--" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Select second team</SelectLabel>
                    {teams.length === 0 && (
                      <div className="px-2 py-1.5 pg3 text-muted-foreground">No teams available</div>
                    )}
                    {teams.map((team) => (
                      <SelectItem
                        key={team.team_id}
                        value={team.team_id}
                        disabled={team.team_id === formData.team1_id}
                        className="cursor-pointer pg3"
                      >
                        {team.team_name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Match Status */}
            <div className="space-y-2">
              <Label>
                Match Status <span className="text-secondary-alt">*</span>
              </Label>
              <RadioGroup
                value={matchStatus}
                onValueChange={(value: 'upcoming' | 'completed') => setMatchStatus(value)}
                disabled={!formData.team1_id || !formData.team2_id}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="upcoming"
                    id="upcoming"
                    disabled={!formData.team1_id || !formData.team2_id}
                  />
                  <Label htmlFor="upcoming" className="cursor-pointer pg3 font-normal">
                    Upcoming
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="completed"
                    id="completed"
                    disabled={!formData.team1_id || !formData.team2_id}
                  />
                  <Label htmlFor="completed" className="cursor-pointer pg3 font-normal">
                    Completed
                  </Label>
                </div>
              </RadioGroup>
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

            {/* Completed Match Extra Fields */}
            {matchStatus === 'completed' && (
              <>
                {/* Final Scores */}
                <hr className="w-[calc(100%+3rem)] -ml-6 border-t border-[#A3A3A3] flex-shrink-0" />
                <div className="grid grid-cols gap-4">
                  <p className='pg1-bold text-gray-500'>Final Results</p>
                  <div className="grid grid-cols-2 gap-3 pg-3">
                    <div className="flex flex-col h-full gap-2">
                      <Label htmlFor="team1_final_score" className="h-full">
                        {teams.find((t) => t.team_id === formData.team1_id)?.team_name || 'Team 1'}
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
                        {teams.find((t) => t.team_id === formData.team2_id)?.team_name || 'Team 2'}
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

                {/* Sets Played */}
                <div className="space-y-2">
                  <Label htmlFor="sets_played">
                    Sets Played <span className="text-secondary-alt">*</span>
                  </Label>
                  <Input
                    id="sets_played"
                    type="number"
                    min="1"
                    max="5"
                    pattern="[1-5]"
                    placeholder="Enter number of sets"
                    value={completedData.sets_played}
                    onChange={(e) => handleSetsPlayedChange(e.target.value)}
                  />
                </div>
                
                {/* Set Scores */}
                {completedData.sets_played && parseInt(completedData.sets_played) > 0 && (
                  <div className="flex flex-col h-full gap-3 ">
                    
                    {Array.from({ length: Math.min(parseInt(completedData.sets_played), 5) }, (_, i) => (
                      <>
                      <p className="pg2 text-gray-500">Set {i + 1}</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col h-full gap-2">
                          <Label htmlFor={`team1_set_${i}`} className="h-full pg1">
                            {teams.find((t) => t.team_id === formData.team1_id)?.team_name || 'Team 1'}<span className='text-secondary-alt'>*</span>
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
                         
                            {teams.find((t) => t.team_id === formData.team2_id)?.team_name || 'Team 2'}<span className='text-secondary-alt'>*</span>
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
                      </>
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
            onClick={() => setIsOpen(false)}
            disabled={isSubmitting}
            className="cursor-pointer"
          >
            Cancel
          </Button>

          <Button type="submit" form="add-match-form" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Add Match'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
