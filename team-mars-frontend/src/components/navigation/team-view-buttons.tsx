import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Undo2, Trash, Pencil } from 'lucide-react';
import { useState } from 'react';

export default function TeamViewButtons({
  onBack,
  onNext,
  isDisabled = false,
  isEditing = false,
  onEditToggle,
  onSave,
  onDelete,
  teamName,
}: {
  onBack: () => void;
  onNext: () => void;
  isDisabled?: boolean;
  isEditing?: boolean;
  onEditToggle?: (editing: boolean) => void;
  onSave?: () => void;
  onDelete?: () => void;
  teamName?: string;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const handleEdit = () => {
    onEditToggle?.(true);
    onNext();
  };

  const handleCancelEdit = () => {
    onEditToggle?.(false);
  };

  const handleSave = () => {
    onSave?.();
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete?.();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Failed to delete team:', error);
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setIsDialogOpen(false);
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
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                type="button"
                aria-label="Remove team"
                className="bg-red-600 text-white p-1 rounded-sm hover:bg-red-700 transition-colors h-10 w-10"
              >
                <Trash className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-left">Delete Team?</DialogTitle>
                <DialogDescription>
                  <p className="font-paragraph text-left">
                    Are you sure you want to delete the team{' '}
                    <span className="text-red-600">{teamName || 'this team'}</span>?
                  </p>
                  <div className="flex gap-2 mt-4 justify-end items-end">
                    <Button
                      variant={'outline'}
                      className="hover:cursor-pointer h-10 border-muted-foreground"
                      onClick={handleCancelDelete}
                      disabled={isDeleting}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="bg-[#D52020] h-10 hover:bg-[#D52020] hover:opacity-80 hover:cursor-pointer"
                      onClick={handleDelete}
                      disabled={isDeleting}
                    >
                      <Trash /> {isDeleting ? 'Deleting...' : 'Delete'}
                    </Button>
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          <Button onClick={handleEdit} disabled={isDisabled} className="rounded-sm h-10 w-10">
            <Pencil className="text-white w-5 h-5 m-auto" />
          </Button>
        </div>
      ) : (
        <div className="flex flex-row gap-2">
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
        </div>
      )}
    </div>
  );
}
