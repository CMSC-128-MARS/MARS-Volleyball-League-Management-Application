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
import { Trash, Volleyball } from 'lucide-react';

type RemoveTeamCardProps = {
  name: string;
  playerCount: number;
};

export default function RemoveTeamCard({ name, playerCount }: RemoveTeamCardProps) {
  const handleRemove = () => {
    console.log('Remove team:', name);
    // TODO: Implement actual remove logic
  };

  return (
    <div className="w-full h-full">
      <div className="block w-full h-full rounded-xs border border-border bg-white shadow-lg transition-all duration-200">
        <Card className="h-full">
          <CardContent className="flex flex-row p-0 h-full items-center">
            <div className="flex justify-center items-center bg-primary w-1/4 p-4 border-r-2 border-secondary self-stretch">
              <Volleyball className="text-secondary h-10 w-10" strokeWidth={1} />
            </div>
            <div className="flex flex-col justify-center text-left pl-2 py-4 gap-2 w-3/4 pr-2">
              <div className="flex items-start gap-2">
                <p className="font-heading font-semibold leading-tight flex-1">{name}</p>
                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      aria-label={`Remove ${name}`}
                      className="text-white hover:opacity-80 hover:cursor-pointer transition-opacity flex-shrink-0"
                    >
                      <Trash className="w-6 h-6 bg-red-600 p-1 rounded-sm mr-2" />
                    </button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="text-left">Delete Team?</DialogTitle>
                      <DialogDescription>
                        <p className="font-paragraph text-left">
                          Are you sure you want to delete the team{' '}
                          <span className="text-red-600">{name}</span>?{' '}
                        </p>
                        <div className="flex gap-2 mt-4 justify-end items-end">
                          <Button
                            variant={'outline'}
                            className="hover:cursor-pointer h-10 border-muted-foreground"
                          >
                            Cancel
                          </Button>
                          <Button className="bg-[#D52020] h-10 hover:bg-[#D52020] hover:opacity-80 hover:cursor-pointer">
                            <Trash /> Delete
                          </Button>
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </div>
              <p className="text-xs bg-secondary-alt text-white border rounded-xs px-2 py-1 w-fit">
                Players: {playerCount}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
