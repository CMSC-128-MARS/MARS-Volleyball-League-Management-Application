import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectLabel,
  SelectGroup,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { Pencil } from 'lucide-react';

interface PlayerView {
  id?: string;
  first_name?: string | null;
  last_name?: string | null;
  jersey_number?: number | null;
  default_position?: string | null;
  skill_level?: string | null;
  notes?: string | null;
}

interface ViewPlayerCardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  player?: PlayerView;
}

import { playerService } from '@/lib/players';
import type { PlayerUpdateDto } from '@/lib/players';

export default function ViewPlayerCard({ open, onOpenChange, player }: ViewPlayerCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(() => ({
    firstName: player?.first_name ?? '',
    lastName: player?.last_name ?? '',
    jerseyNumber: player?.jersey_number ?? undefined,
    defaultPosition: player?.default_position ?? '',
    skillLevel: player?.skill_level ?? '',
    notes: player?.notes ?? '',
  }));

  useEffect(() => {
    setForm({
      firstName: player?.first_name ?? '',
      lastName: player?.last_name ?? '',
      jerseyNumber: player?.jersey_number ?? undefined,
      defaultPosition: player?.default_position ?? '',
      skillLevel: player?.skill_level ?? '',
      notes: player?.notes ?? '',
    });
    if (!open) setIsEditing(false);
  }, [player, open]);

  const handleCancelEdit = () => {
    // revert to player values
    setForm({
      firstName: player?.first_name ?? '',
      lastName: player?.last_name ?? '',
      jerseyNumber: player?.jersey_number ?? undefined,
      defaultPosition: player?.default_position ?? '',
      skillLevel: player?.skill_level ?? '',
      notes: player?.notes ?? '',
    });
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!player?.id) {
      setIsEditing(false);
      return;
    }
    try {
      const payload: PlayerUpdateDto = {
        first_name: form.firstName || undefined,
        last_name: form.lastName || undefined,
        jersey_number: form.jerseyNumber ?? undefined,
        default_position: form.defaultPosition || undefined,
        // include skill level and notes when saving so backend persists them
        skill_level: form.skillLevel ? Number(form.skillLevel) : undefined,
        // backend supports `skill_notes` and `notes`; send `notes` here
        notes: form.notes || undefined,
      };
      await playerService.updatePlayer(player.id, payload);
      // close and refresh list
      setIsEditing(false);
      onOpenChange(false);
      // refresh parent list to reflect changes
      window.location.reload();
    } catch (err) {
      console.error('Failed to save player', err);
      toast.error('Failed to save player. Please try again.', { duration: 5000, style: {
        background: "var(--destructive)", color: "white", borderRadius: "2px", border: "none"
      } })
      setIsEditing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 max-h-[90vh] flex flex-col md:max-w-2xl">
        <DialogHeader className="text-left -mt-2 mb-2 flex-shrink-0">
          <DialogTitle>
            <h4>Player Details</h4>
          </DialogTitle>
        </DialogHeader>

        <hr className="w-[calc(100%+3rem)] -ml-6 border-t border-[#A3A3A3] flex-shrink-0" />

        <div className="overflow-y-auto flex-1 scrollbar-hide">
          <div className="flex flex-col gap-3 mt-6">
            <div className="flex flex-col md:grid md:grid-cols-3 gap-4">
              <div>
                <p className="text-[14px] text-black mb-1">First Name</p>
                <Input
                  value={form.firstName}
                  disabled={!isEditing}
                  className="bg-white"
                  onChange={(e) =>
                    setForm((s) => ({ ...s, firstName: (e.target as HTMLInputElement).value }))
                  }
                />
              </div>
              <div>
                <p className="text-[14px] text-black mb-1">Last Name</p>
                <Input
                  value={form.lastName}
                  disabled={!isEditing}
                  className="bg-white"
                  onChange={(e) =>
                    setForm((s) => ({ ...s, lastName: (e.target as HTMLInputElement).value }))
                  }
                />
              </div>
              <div>
                <p className="text-[14px] text-black mb-1">Jersey Number</p>
                <Input
                  value={form.jerseyNumber !== undefined ? String(form.jerseyNumber) : ''}
                  disabled={!isEditing}
                  className="bg-white"
                  onChange={(e) => {
                    const raw = (e.target as HTMLInputElement).value;
                    const digits = raw.replace(/\D+/g, '');
                    setForm((s) => ({ ...s, jerseyNumber: digits ? Number(digits) : undefined }));
                  }}
                />
              </div>
            </div>

            <div className="flex flex-col md:grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-[14px] text-black mb-1">Default Position</p>
                <Select
                  value={form.defaultPosition || undefined}
                  onOpenChange={() => {}}
                  onValueChange={(val) => setForm((s) => ({ ...s, defaultPosition: val }))}
                  disabled={!isEditing}
                >
                  <SelectTrigger className="w-full rounded-sm border border-[#E5E5E5] bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] cursor-default">
                    <SelectValue placeholder={'--'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Default Position</SelectLabel>
                      <SelectItem value="Setter">Setter</SelectItem>
                      <SelectItem value="Outside Hitter">Outside Hitter</SelectItem>
                      <SelectItem value="Middle Blocker">Middle Blocker</SelectItem>
                      <SelectItem value="Libero">Libero</SelectItem>
                      <SelectItem value="Defensive Specialist">Defensive Specialist</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <p className="text-[14px] text-black mb-1">Skill Level</p>
                <Select
                  value={form.skillLevel || undefined}
                  onOpenChange={() => {}}
                  onValueChange={(val) => setForm((s) => ({ ...s, skillLevel: val }))}
                  disabled={!isEditing}
                >
                  <SelectTrigger className="w-full rounded-sm border border-[#E5E5E5] bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] cursor-default">
                    <SelectValue placeholder={'--'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Skill Level</SelectLabel>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5">5</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Skill Level Description removed per request */}

            <div>
              <p className="text-[14px] text-black mb-1">Notes</p>
              <Textarea
                value={form.notes}
                disabled={!isEditing}
                className="bg-white h-24"
                onChange={(e) =>
                  setForm((s) => ({ ...s, notes: (e.target as HTMLTextAreaElement).value }))
                }
              />
            </div>
          </div>
        </div>

        <hr className="w-[calc(100%+3rem)] -ml-6 border-t border-[#A3A3A3] mt-6 flex-shrink-0" />

        <div className="w-full mt-4 flex flex-row gap-2 justify-end flex-shrink-0">
          {!isEditing ? (
            <>
              <Button
                className="hover:cursor-pointer h-10 border-muted-foreground"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="h-4 w-4" />
                <p className="font-extralight">Edit</p>
              </Button>
            </>
          ) : (
            <>
              <Button
                variant={'outline'}
                className="hover:cursor-pointer h-10 border-muted-foreground"
                onClick={handleCancelEdit}
              >
                Cancel
              </Button>
              <Button className="px-6 py-[9.5px] h-10" onClick={handleSave}>
                <p className="text-sm font-light">Save</p>
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
