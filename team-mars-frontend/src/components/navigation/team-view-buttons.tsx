import { Button } from '@/components/ui/button';
import { Undo2, Trash, Pencil } from 'lucide-react';

export default function TeamViewButtons({
  onBack,
  onNext,
  isDisabled = false,
  isEditing = false,
  onEditToggle,
}: {
  onBack: () => void;
  onNext: () => void;
  isDisabled?: boolean;
  isEditing?: boolean;
  onEditToggle?: (editing: boolean) => void;
}) {
  const handleEdit = () => {
    onEditToggle?.(true);
    onNext();
  };

  const handleCancel = () => {
    onEditToggle?.(false);
  };

  const handleSave = () => {
    onEditToggle?.(false);
    // TODO: Implement save logic
  };

  return (
    <div className="flex flex-row justify-between w-full mt-4">
      <div>
        <Button
          variant="outline"
          onClick={onBack}
          className="px-6 py-[9.5px] border-primary font-semibold w-[98.25px] h-10"
        >
          <Undo2 strokeWidth={2.5} />
          Back
        </Button>
      </div>
      {!isEditing ? (
        <div className="flex flex-row gap-2">
          <Button
            type="button"
            aria-label="Remove team"
            className="bg-red-600 text-white p-1 rounded-sm hover:bg-red-700 transition-colors h-10 w-10"
          >
            <Trash className="w-5 h-5" />
          </Button>
          <Button onClick={handleEdit} disabled={isDisabled} className="rounded-sm h-10 w-10">
            <Pencil className="text-white w-5 h-5 m-auto" />
          </Button>
        </div>
      ) : (
        <div className="flex flex-row gap-2">
          <Button
            variant={'outline'}
            className="hover:cursor-pointer h-10 border-muted-foreground"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button className="px-6 py-[9.5px] h-10" onClick={handleSave}>
            <p className="text-sm font-light">Save</p>
          </Button>
        </div>
      )}
    </div>
  );
}
