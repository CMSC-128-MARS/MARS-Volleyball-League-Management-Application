import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { leagueApiService } from '@/lib/league';
import { toast } from 'sonner';

type LeagueDetailsProps = {
  leagueId: string;
  leagueName: string;
  location: string;
  description?: string | null;
  isEditing?: boolean;
  onSaved?: () => void;
};

export default function LeagueDetails({
  leagueId,
  leagueName,
  location,
  description,
  isEditing = false,
  onSaved,
}: LeagueDetailsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    league_name: leagueName,
    location: location,
    description: description || '',
  });

  useEffect(() => {
    setFormData({
      league_name: leagueName,
      location: location,
      description: description || '',
    });
  }, [leagueName, location, description]);

  const handleSave = async () => {
    if (!formData.league_name) {
      toast.error('League Name input missing.', { duration: 5000, style: {
        color: "var(--destructive)", borderRadius: "2px", border: "2px solid var(--destructive)"
      } })
      return;
    }
    if (!formData.location) {
      toast.error('Location input missing.', { duration: 5000, style: {
        color: "var(--destructive)", borderRadius: "2px", border: "2px solid var(--destructive)"
      } })
      return;
    }
    
    try {
      setIsSubmitting(true);
      await leagueApiService.updateLeague(leagueId, {
        league_name: formData.league_name,
        location: formData.location,
        description: formData.description || null,
      });
      onSaved?.();
      toast.success('League details updated successfully!', { duration: 5000, style: {
        color: "var(--success)", borderRadius: "2px", border: "2px solid var(--success)"
      } })
    } catch (error) {
      console.error('Failed to update league:', error);
      toast.error('Failed to update league details. Please try again.', { duration: 5000, style: {
        color: "var(--destructive)", borderRadius: "2px", border: "2px solid var(--destructive)"
      } })


    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full h-full shadow-md">
      <Card className="gap-2 transition-all duration-200">
        <CardHeader className="items-center px-6 pt-4">
          <CardTitle className="flex flex-row justify-between items-center w-full">
            <h4>Details</h4>
          </CardTitle>
        </CardHeader>
        <hr className="w-full border-t border-gray-400" />
        <CardContent className="flex flex-col gap-6 px-6 pb-6 pt-2">
          <div>
            <p className="pg1 mb-2">League Name</p>
            <Input
              type="text"
              value={formData.league_name}
              onChange={(e) => setFormData({ ...formData, league_name: e.target.value })}
              readOnly={!isEditing}
              className="rounded-sm border border-[#E5E5E5] bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]"
            />
          </div>
          <div>
            <p className="pg1 mb-2">Location</p>
            <Input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              readOnly={!isEditing}
              className="rounded-sm border border-[#E5E5E5] bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]"
            />
          </div>
          <div>
            <p className="pg1 mb-2">Description</p>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              readOnly={!isEditing}
              className="rounded-sm border border-[#E5E5E5] bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] min-h-[80px] resize-none"
            />
          </div>
          {isEditing && (
            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleSave}
                disabled={isSubmitting}
                className="flex-1 cursor-pointer"
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
