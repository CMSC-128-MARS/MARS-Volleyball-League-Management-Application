import { Button } from '@/components/ui/button';
import { Undo2, SquarePlus } from 'lucide-react';

export default function TeamNavigationButtons({
  onBack,
  onNext,
  isDisabled = false,
}: {
  onBack: () => void;
  onNext: () => void;
  isDisabled?: boolean;
}) {
  return (
    <div className="flex flex-row justify-between w-full mt-4">
      <Button
        variant="outline"
        onClick={onBack}
        className="px-6 py-[9.5px] border-primary font-semibold w-[98.25px] cursor-pointer"
      >
        <Undo2 strokeWidth={2.5} />
        Back
      </Button>
      <Button
        onClick={onNext}
        disabled={isDisabled}
        className="px-6! py-[9.5px]! w-[109.25px] cursor-pointer"
      >
        <SquarePlus className="text-white w-6 h-6 m-auto" />
        <p className="text-sm font-light">Create</p>
      </Button>
    </div>
  );
}
