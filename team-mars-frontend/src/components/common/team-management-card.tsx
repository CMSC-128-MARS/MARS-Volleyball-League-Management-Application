import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Volleyball } from 'lucide-react';

type TeamManagementCardProps = {
  name: string;
  playerCount: number;
};

export default function TeamManagementCard({ name, playerCount }: TeamManagementCardProps) {
  return (
    <div className="w-full h-full">
      <Dialog>
        <DialogTrigger className="block w-full h-full rounded-xs border border-border bg-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:border-neutral-400">
          <Card className="h-full transition-all duration-200">
            <CardContent className="flex flex-row p-0">
              <div className="flex justify-center items-center bg-primary w-1/4 p-4 border-r-2 border-secondary">
                <Volleyball className="text-secondary h-10 w-10" strokeWidth={1} />
              </div>
              <div className="flex flex-col justify-start text-left pl-2 py-4 gap-1">
                <div className="font-heading font-semibold">{name}</div>
                <p className="text-xs bg-secondary-alt text-white border rounded-xs px-2 py-1 w-fit">
                  Players: {playerCount}
                </p>
              </div>
            </CardContent>
          </Card>
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
