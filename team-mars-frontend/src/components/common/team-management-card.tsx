import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Trash, Volleyball } from 'lucide-react';

type TeamManagementCardProps = {
  name: string;
  playerCount: number;
  showRemoveIcon?: boolean;
};

export default function TeamManagementCard({
  name,
  playerCount,
  showRemoveIcon,
}: TeamManagementCardProps) {
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement remove functionality
    console.log('Remove team:', name);
  };

  return (
    <div className="w-full h-full">
      <Dialog>
        <DialogTrigger asChild>
          <div className="block w-full h-full rounded-xs border border-border bg-white shadow-lg transition-all duration-200 hover:cursor-pointer hover:-translate-y-0.5 hover:shadow-xl hover:border-neutral-400">
            <Card className="h-full transition-all duration-200">
              <CardContent className="flex flex-row p-0 h-full items-center">
                <div className="flex justify-center items-center bg-primary w-1/4 p-4 border-r-2 border-secondary self-stretch">
                  <Volleyball className="text-secondary h-10 w-10" strokeWidth={1} />
                </div>
                <div className="flex flex-col justify-center text-left pl-2 py-4 gap-2 w-3/4 pr-2">
                  <div className="flex items-start gap-2">
                    <p className="font-heading font-semibold leading-tight flex-1">{name}</p>
                    {showRemoveIcon && (
                      <button
                        type="button"
                        aria-label={`Remove ${name}`}
                        className="text-white hover:opacity-80 hover:cursor-pointer transition-opacity flex-shrink-0"
                        onClick={handleRemove}
                      >
                        <Trash className="w-6 h-6 bg-red-600 p-1 rounded-sm mr-2" />
                      </button>
                    )}
                  </div>
                  <p className="text-xs bg-secondary-alt text-white border rounded-xs px-2 py-1 w-fit">
                    Players: {playerCount}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>True Vach?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your account and remove
              your data from our servers.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
