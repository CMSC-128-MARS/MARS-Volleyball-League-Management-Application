import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

export default function SelectedTeamButtons({
  onBack,
  onNext,
  isNextDisabled = false,
}: {
  onBack: () => void;
  onNext?: () => void;
  isNextDisabled?: boolean;
}) {
  return (
    <div className="flex flex-row justify-between w-full mt-4">
      <Button
        variant="outline"
        onClick={onBack}
        className="px-6 py-[9.5px] border-primary font-semibold"
      >
        <RotateCcw strokeWidth={2.5} />
      </Button>
      <Button onClick={onNext} disabled={isNextDisabled} className="px-6! py-[9.5px]!">
        <p className="text-sm font-light">Save</p>
      </Button>
    </div>
  );
}
