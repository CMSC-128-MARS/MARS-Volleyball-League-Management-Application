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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useMemo } from 'react';

interface PlayerView {
  first_name?: string | null;
  last_name?: string | null;
  jersey_number?: number | null;
  default_position?: string | null;
  skill_level?: string | null;
  skill_level_description?: string | null;
  notes?: string | null;
}

interface ViewPlayerCardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  player?: PlayerView;
}

export default function ViewPlayerCard({ open, onOpenChange, player }: ViewPlayerCardProps) {
  const values = useMemo(
    () => ({
      firstName: player?.first_name ?? '',
      lastName: player?.last_name ?? '',
      jerseyNumber: player?.jersey_number ?? undefined,
      defaultPosition: player?.default_position ?? '',
      skillLevel: player?.skill_level ?? '',
      skillLevelDescription: player?.skill_level_description ?? '',
      notes: player?.notes ?? '',
    }),
    [player],
  );

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
                <Input value={values.firstName} disabled className="bg-white" />
              </div>
              <div>
                <p className="text-[14px] text-black mb-1">Last Name</p>
                <Input value={values.lastName} disabled className="bg-white" />
              </div>
              <div>
                <p className="text-[14px] text-black mb-1">Jersey Number</p>
                <Input
                  value={values.jerseyNumber !== undefined ? String(values.jerseyNumber) : ''}
                  disabled
                  className="bg-white"
                />
              </div>
            </div>

            <div className="flex flex-col md:grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-[14px] text-black mb-1">Default Position</p>
                <Select
                  value={values.defaultPosition || undefined}
                  onOpenChange={() => {}}
                  disabled
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
                <Select value={values.skillLevel || undefined} onOpenChange={() => {}} disabled>
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

            <div>
              <p className="text-[14px] text-black mb-1">Skill Level Description</p>
              <Textarea value={values.skillLevelDescription} disabled className="bg-white h-24" />
            </div>

            <div>
              <p className="text-[14px] text-black mb-1">Notes</p>
              <Textarea value={values.notes} disabled className="bg-white h-24" />
            </div>
          </div>
        </div>

        <hr className="w-[calc(100%+3rem)] -ml-6 border-t border-[#A3A3A3] mt-6 flex-shrink-0" />

        <div className="w-full mt-4 flex flex-row gap-2 justify-end flex-shrink-0">
          <Button onClick={() => onOpenChange(false)}>
            <p className="font-extralight">Close</p>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
