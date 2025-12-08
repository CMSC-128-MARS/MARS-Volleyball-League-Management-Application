import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Undo2, Trash, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';

export default function LeagueViewButtons({
  onBack,
  isEditing = false,
  onEditToggle,
  onDelete,
  leagueName,
}: {
  onBack: () => void;
  isEditing?: boolean;
  onEditToggle?: (editing: boolean) => void;
  onDelete?: () => void;
  leagueName?: string;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = () => {
    onEditToggle?.(true);
  };

  const handleCancelEdit = () => {
    onEditToggle?.(false);
  };


  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete?.();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Failed to delete league:', error);
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className="flex flex-row justify-between w-full">
      <div>
        <Button
          variant="outline"
          onClick={onBack}
          className="px-6 py-[9.5px] border-primary font-semibold w-[98.25px] h-10 cursor-pointer"
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
                aria-label="Remove league"
                className="bg-red-600 text-white p-1 rounded-sm hover:bg-red-700 transition-colors h-10 w-10 cursor-pointer"
              >
                <Trash className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-left">Delete League?</DialogTitle>
                <DialogDescription>
                  <p className="font-paragraph text-left">
                    Are you sure you want to delete the league{' '}
                    <span className="text-red-600">{leagueName || 'this league'}</span>?
                  </p>
                  <div className="flex gap-2 mt-4 justify-end items-end">
                    <Button
                      variant={'outline'}
                      className="hover:cursor-pointer h-10"
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
          <Button
            variant="default"
            onClick={handleEdit}
            className="px-6 py-[9.5px] font-semibold h-10 cursor-pointer"
          >
            <MoreHorizontal strokeWidth={2.5} />
          </Button>
        </div>
      ) : (
        <div className="flex flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleCancelEdit}
            className="px-6 py-[9.5px] border-primary font-semibold h-10 cursor-pointer"
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}
