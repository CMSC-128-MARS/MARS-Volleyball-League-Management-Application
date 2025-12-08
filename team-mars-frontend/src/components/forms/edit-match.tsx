import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { matchApiService } from '@/lib/match';
import type { MatchUpdate } from '@/lib/match';

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

  const isCompleted = initialData.is_completed;

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
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.match_date || !formData.location || !formData.num_of_sets) {
      alert('Please fill in all fields');
      return;
    }

    try {
      setIsSubmitting(true);
      const matchData: MatchUpdate = {
        match_date: new Date(formData.match_date).toISOString(),
        location: formData.location,
        num_of_sets: formData.num_of_sets,
        is_completed: initialData.is_completed,
      };

      await matchApiService.updateMatch(matchId, matchData);

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
                Match Date {!isCompleted && <span className="text-secondary-alt">*</span>}
              </Label>
              <Input
                id="match_date"
                type="date"
                value={formData.match_date}
                onChange={(e) => setFormData({ ...formData, match_date: e.target.value })}
                className={isCompleted ? "bg-gray-100" : "cursor-pointer"}
                disabled={isCompleted}
                required={!isCompleted}
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">
                Location {!isCompleted && <span className="text-secondary-alt">*</span>}
              </Label>
              <Input
                id="location"
                type="text"
                placeholder="Enter match location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className={isCompleted ? "bg-gray-100" : ""}
                disabled={isCompleted}
                required={!isCompleted}
              />
            </div>

            {/* Number of Sets */}
            <div className="space-y-2">
              <Label htmlFor="num_of_sets">
                Number of Sets {!isCompleted && <span className="text-secondary-alt">*</span>}
              </Label>
              <Input
                id="num_of_sets"
                type="number"
                min="1"
                max="5"
                value={formData.num_of_sets}
                onChange={(e) => setFormData({ ...formData, num_of_sets: parseInt(e.target.value) || 1 })}
                className={isCompleted ? "bg-gray-100" : ""}
                disabled={isCompleted}
                required={!isCompleted}
              />
            </div>

            {/* Match Status - Read Only */}
            <div className="space-y-2">
              <Label htmlFor="is_completed">Match Status</Label>
              <Input
                id="is_completed"
                type="text"
                value={initialData.is_completed ? 'Completed' : 'Upcoming'}
                disabled
                className="bg-gray-100"
              />
            </div>
          </form>
        </div>
        {!isCompleted && (
          <>
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
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
