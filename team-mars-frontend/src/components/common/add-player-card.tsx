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
import { UserRoundPlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { PlayerCreateDto } from '@/lib/players/player.types';

interface AddPlayerCardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate?: (payload: PlayerCreateDto) => Promise<void> | void;
}

export default function AddPlayerCard({ open, onOpenChange, onCreate }: AddPlayerCardProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [jerseyNumber, setJerseyNumber] = useState<number | undefined>(undefined);
  const [defaultPosition, setDefaultPosition] = useState('');
  const [skillLevel, setSkillLevel] = useState<string | undefined>(undefined);

  const [note, setNote] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      // reset form state when opening the dialog
      setFirstName('');
      setLastName('');
      setJerseyNumber(undefined);
      setDefaultPosition('');
      setSkillLevel(undefined);
      setNote('');
      setErrors({});
      setSubmitError(null);
      setIsSubmitting(false);
    }
  }, [open]);

  const handleAddPlayer = async () => {
    setSubmitError(null);
    const newErrors: Record<string, string> = {};
    if (!firstName.trim()) newErrors.firstName = 'First name is required.';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required.';
    if (jerseyNumber === undefined || Number.isNaN(jerseyNumber))
      newErrors.jerseyNumber = 'Jersey number is required.';
    if (!defaultPosition) newErrors.defaultPosition = 'Default position is required.';
    if (!skillLevel) newErrors.skillLevel = 'Skill level is required.';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const payload: PlayerCreateDto = {
      first_name: firstName,
      last_name: lastName || undefined,
      jersey_number: jerseyNumber ?? undefined,
      default_position: defaultPosition || undefined,
    };

    setIsSubmitting(true);
    try {
      if (onCreate) await onCreate(payload);
      onOpenChange(false);
    } catch (err: unknown) {
      console.error('Failed to create player', err);
      setSubmitError((err as Error)?.message || 'Failed to create player');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 max-h-[90vh] flex flex-col md:max-w-2xl">
        <DialogHeader className="text-left -mt-2 mb-2 flex-shrink-0">
          <DialogTitle>
            <h4>Add a Player</h4>
          </DialogTitle>
        </DialogHeader>
        <hr className="w-[calc(100%+3rem)] -ml-6 border-t border-[#A3A3A3] flex-shrink-0" />
        <div className="overflow-y-auto flex-1 scrollbar-hide">
          <div className="flex flex-col gap-3 mt-6">
            <div className="flex flex-col md:grid md:grid-cols-3 gap-4">
              <div>
                <p className="text-[14px] text-black mb-1">
                  First Name <span className="text-secondary-alt">*</span>
                </p>
                <Input
                  value={firstName}
                  onChange={(e) => {
                    setFirstName((e.target as HTMLInputElement).value);
                    setErrors((prev) => {
                      const copy = { ...prev };
                      delete copy.firstName;
                      return copy;
                    });
                  }}
                  className="bg-white"
                />
                {errors.firstName && (
                  <p className="text-sm text-red-600 mt-1">{errors.firstName}</p>
                )}
              </div>
              <div>
                <p className="text-[14px] text-black mb-1">
                  Last Name <span className="text-secondary-alt">*</span>
                </p>
                <Input
                  value={lastName}
                  onChange={(e) => {
                    setLastName((e.target as HTMLInputElement).value);
                    setErrors((prev) => {
                      const copy = { ...prev };
                      delete copy.lastName;
                      return copy;
                    });
                  }}
                  className="bg-white"
                />
                {errors.lastName && <p className="text-sm text-red-600 mt-1">{errors.lastName}</p>}
              </div>
              <div>
                <p className="text-[14px] text-black mb-1">
                  Jersey Number <span className="text-secondary-alt">*</span>
                </p>
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  value={jerseyNumber?.toString() || ''}
                  onChange={(e) => {
                    // strip non-digit characters (handles paste too)
                    const raw = (e.target as HTMLInputElement).value;
                    const digits = raw.replace(/\D+/g, '');
                    setJerseyNumber(digits ? Number(digits) : undefined);
                    setErrors((prev) => {
                      const copy = { ...prev };
                      delete copy.jerseyNumber;
                      return copy;
                    });
                  }}
                  onKeyDown={(e) => {
                    // allow: backspace, delete, tab, escape, enter, arrows
                    if (
                      e.key === 'Backspace' ||
                      e.key === 'Delete' ||
                      e.key === 'Tab' ||
                      e.key === 'Escape' ||
                      e.key === 'Enter' ||
                      e.key === 'ArrowLeft' ||
                      e.key === 'ArrowRight' ||
                      e.key === 'Home' ||
                      e.key === 'End'
                    ) {
                      return;
                    }
                    // allow copy/cut/paste/select all
                    if (
                      (e.ctrlKey || e.metaKey) &&
                      ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase())
                    ) {
                      return;
                    }
                    // block non-digit keys
                    if (!/^[0-9]$/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  className="bg-white"
                />
                {errors.jerseyNumber && (
                  <p className="text-sm text-red-600 mt-1">{errors.jerseyNumber}</p>
                )}
              </div>
            </div>
            <div className="flex flex-col md:grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-[14px] text-black mb-1">
                  Default Position <span className="text-secondary-alt">*</span>
                </p>
                <Select
                  value={defaultPosition || undefined}
                  onValueChange={(val) => {
                    setDefaultPosition(val);
                    setErrors((prev) => {
                      const copy = { ...prev };
                      delete copy.defaultPosition;
                      return copy;
                    });
                  }}
                >
                  <SelectTrigger className="w-full rounded-sm border border-[#E5E5E5] bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] cursor-pointer">
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
                {errors.defaultPosition && (
                  <p className="text-sm text-red-600 mt-1">{errors.defaultPosition}</p>
                )}
              </div>
              <div>
                <p className="text-[14px] text-black mb-1">
                  Skill Level <span className="text-secondary-alt">*</span>
                </p>
                <Select
                  value={skillLevel}
                  onValueChange={(val) => {
                    setSkillLevel(val);
                    setErrors((prev) => {
                      const copy = { ...prev };
                      delete copy.skillLevel;
                      return copy;
                    });
                  }}
                >
                  <SelectTrigger className="w-full rounded-sm border border-[#E5E5E5] bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] cursor-pointer">
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
                {errors.skillLevel && (
                  <p className="text-sm text-red-600 mt-1">{errors.skillLevel}</p>
                )}
              </div>
            </div>
            {/* Skill Level Description removed per request */}
            <div>
              <p className="text-[14px] text-black mb-1">Notes</p>
              <Textarea
                value={note}
                onChange={(e) => setNote((e.target as HTMLTextAreaElement).value)}
                className="bg-white h-24"
              />
            </div>
          </div>
        </div>
        <hr className="w-[calc(100%+3rem)] -ml-6 border-t border-[#A3A3A3] mt-6 flex-shrink-0" />
        <div className="w-full mt-4 flex flex-col gap-2 flex-shrink-0">
          {submitError && <p className="text-sm text-red-600">{submitError}</p>}
          <div className="flex flex-row gap-2 justify-end">
            <Button onClick={() => onOpenChange(false)} variant={'outline'}>
              <p className="font-extralight">Cancel</p>
            </Button>
            <Button
              onClick={handleAddPlayer}
              disabled={
                isSubmitting ||
                !(
                  firstName.trim() &&
                  lastName.trim() &&
                  jerseyNumber !== undefined &&
                  !Number.isNaN(jerseyNumber) &&
                  defaultPosition &&
                  skillLevel
                )
              }
            >
              <UserRoundPlus className="mr-2 h-4 w-4" strokeWidth={2.5} />
              <p className="font-extralight">{isSubmitting ? 'Adding...' : 'Add Player'}</p>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
