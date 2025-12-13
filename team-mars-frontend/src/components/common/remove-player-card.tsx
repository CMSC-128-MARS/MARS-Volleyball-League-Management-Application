import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trash, User } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

type RemovePlayerCardProps = {
  ids: string[];
  onRemoveSelected: (ids: string[]) => Promise<void> | void;
  onRemoveSuccess?: () => void;
};

export default function RemovePlayerCard({
  ids,
  onRemoveSelected,
  onRemoveSuccess,
}: RemovePlayerCardProps) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleRemove = async () => {
    if (!ids || ids.length === 0) return;
    try {
      setIsDeleting(true);
      await onRemoveSelected(ids);
      setOpen(false);
      if (onRemoveSuccess) onRemoveSuccess();
    } catch (error) {
      console.error('Failed to delete player(s):', error);
      toast.error('Failed to delete player(s). Please try again.', { duration: 5000, style: {
        background: "var(--destructive)", color: "white", borderRadius: "2px", border: "none"
      } })
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <div className="w-full h-full">
      <div className="block w-full h-full rounded-xs border border-border bg-white shadow-lg transition-all duration-200">
        <Card className="h-full">
          <CardContent className="flex flex-row p-0 h-full items-center">
            <div className="flex justify-center items-center bg-[#D52020] w-1/4 p-4 border-r-2 border-secondary self-stretch">
              <User className="text-white h-10 w-10" strokeWidth={1} />
            </div>
            <div className="flex flex-col justify-center text-left pl-2 py-4 gap-2 w-3/4 pr-2">
              <div className="flex items-start gap-2">
                <p className="font-heading font-semibold leading-tight flex-1">
                  Delete selected player(s)
                </p>
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      aria-label={`Remove ${ids.length} player(s)`}
                      className="text-white hover:opacity-80 hover:cursor-pointer transition-opacity flex-shrink-0"
                    >
                      <Trash className="w-6 h-6 bg-red-600 p-1 rounded-sm mr-2" />
                    </button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="text-left">Delete Player(s)?</DialogTitle>
                      <DialogDescription>
                        <p className="font-paragraph text-left">
                          Are you sure you want to delete {ids.length} selected player(s)? This
                          action cannot be undone.
                        </p>
                        <div className="flex gap-2 mt-4 justify-end items-end">
                          <Button
                            variant={'outline'}
                            className="hover:cursor-pointer h-10 border-muted-foreground"
                            onClick={handleCancel}
                            disabled={isDeleting}
                          >
                            Cancel
                          </Button>
                          <Button
                            className="bg-[#D52020] h-10 hover:bg-[#D52020] hover:opacity-80 hover:cursor-pointer"
                            onClick={handleRemove}
                            disabled={isDeleting}
                          >
                            <Trash /> {isDeleting ? 'Deleting...' : 'Delete'}
                          </Button>
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </div>
              <p className="text-xs bg-secondary-alt text-white border rounded-xs px-2 py-1 w-fit">
                Selected: {ids.length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
