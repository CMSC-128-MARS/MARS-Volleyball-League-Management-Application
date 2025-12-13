import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { leagueApiService } from '@/lib/league';
import type { League } from '@/lib/league';

type AddLeagueDialogProps = {
  children: React.ReactNode;
};

export default function AddLeagueDialog({ children }: AddLeagueDialogProps) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    league_name: '',
    location: '',
    description: '',
  });
  // Always use today as start_date (required by backend)
  const getTodayISOString = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today.toISOString();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate for whitespace-only input
    const trimmedLeagueName = formData.league_name.trim();
    const trimmedLocation = formData.location.trim();
    if (!trimmedLeagueName || !trimmedLocation) {
      toast.error("Missing league name or location input.", {
        duration: 5000,
        style: {
          color: "var(--destructive)",
          borderRadius: "2px",
          border: "2px solid var(--destructive)"
        }
      });
      return;
    }

    let loadingToastId;
    try {
      setIsSubmitting(true);
      loadingToastId = toast.loading('Creating league...', {
        duration: 10000,
        style: {
          borderRadius: '2px',
          border: '2px solid var(--border)',
        },
      });
      const leagueData: Partial<League> = {
        league_name: trimmedLeagueName,
        location: trimmedLocation,
        description: formData.description || null,
        start_date: getTodayISOString(),
      };

      try {
        const createdLeague = await leagueApiService.createLeague(leagueData);
        toast.dismiss(loadingToastId);
        toast.success('League successfully created!', {
          duration: 5000,
          style: {
            color: "var(--success)",
            borderRadius: "2px",
            border: "2px solid var(--success)"
          }
        });
        setIsOpen(false);
        setFormData({
          league_name: '',
          location: '',
          description: '',
        });
        navigate(`/leagues/${createdLeague.league_id}`);
      } catch (err: unknown) {
        console.error('Failed to create league:', err);
        toast.dismiss(loadingToastId);
        toast.error("Failed to create league. Please try again.", { duration: 5000, style: {
          color: "var(--destructive)", borderRadius: "2px", border: "2px solid var(--destructive)"
        } });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] flex flex-col max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Add New League</DialogTitle>
        </DialogHeader>
        <hr className="w-[calc(100%+3rem)] -ml-6 border-t border-[#A3A3A3] flex-shrink-0" />
        {/* Scrollable Content */}
        <div className="overflow-y-auto px-1 py-2 flex-1">
          <form id="add-league-form" onSubmit={handleSubmit} className="space-y-4 mt-2">
            {/* League Name */}
            <div className="space-y-2">
              <Label htmlFor="league_name">
                League Name <span className="text-secondary-alt">*</span>
              </Label>
              <Input
                id="league_name"
                type="text"
                placeholder="Enter league name"
                value={formData.league_name}
                onChange={(e) => setFormData({ ...formData, league_name: e.target.value })}
                required
                maxLength={100}
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
                placeholder="Enter league location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
                maxLength={200}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter league description (optional)"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                maxLength={1000}
                rows={4}
                className="resize-none"
              />
            </div>
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

          <Button
            className="cursor-pointer"
            type="submit"
            form="add-league-form"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Add League'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
