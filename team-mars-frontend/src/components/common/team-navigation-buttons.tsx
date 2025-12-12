import { Button } from '@/components/ui/button';
import { Undo2, SquarePlus, Loader2 } from 'lucide-react';

export default function TeamNavigationButtons({
  onBack,
  onNext,
  isDisabled = false,
  isCreating = false,
}: {
  onBack: () => void;
  onNext: () => void;
  isDisabled?: boolean;
  isCreating?: boolean;
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
        disabled={isDisabled || isCreating}
        className={`px-6 py-[9.5px] w-[109.25px] flex items-center justify-center gap-2 transition-all duration-150 ${
          isCreating ? 'cursor-wait' : 'cursor-pointer'
        }`}
      >
        {isCreating ? (
          <Loader2 className="text-white w-4 h-4 animate-spin" />
        ) : (
          <SquarePlus className="text-white w-5 h-5" />
        )}
        <p className="text-sm font-light truncate">{isCreating ? 'Creating...' : 'Create'}</p>
      </Button>
    </div>
  );
}
