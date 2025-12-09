import { Card, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { MapPin, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { leagueApiService } from '@/lib/league';
import { useNavigate } from 'react-router-dom';

type LeagueCardProps = {
  leagueId: string;
  name: string;
  location: string;
  description?: string | null;
  mode?: 'view' | 'remove';
  onRemoveSuccess?: () => void;
};

export const LeagueCard = ({
  leagueId,
  name,
  location,
  description,
  mode = 'view',
  onRemoveSuccess,
}: LeagueCardProps) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleRemove = async () => {
    try {
      setIsDeleting(true);
      await leagueApiService.deleteLeague(leagueId);
      setOpen(false);
      if (onRemoveSuccess) {
        onRemoveSuccess();
      }
      window.location.reload();
    } catch (error) {
      console.error('Failed to delete league:', error);
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleViewDetails = () => {
    navigate(`/leagues/${leagueId}`);
  };
  return (
    <Card className="w-full border border-border shadow-md bg-card">
      {/* Card Header */}
      <div
        className="h-[220px] bg-background-alt text-primary-foreground relative p-[12px]"
        style={{
          backgroundImage: `url('/assets/Dust.png')`,
          backgroundSize: 'auto',
          backgroundRepeat: 'repeat',
        }}
      >
        <div className="h-full border-[2px] border-secondary justify-center items-center flex px-[32px] py-[16px] text-center">
          <CardTitle className="w-full max-w-full">
            <h3 className="text-secondary italic text-center font-bold uppercase break-words whitespace-normal">
              {name}
            </h3>
          </CardTitle>
        </div>
      </div>
      {/* Card Content */}
      <CardContent className="px-[24px] flex flex-col gap-[12px]">
        <p className="pg2 text-foreground text-left">
          {description || 'No description available.'}
        </p>
        <div className="flex flex-row gap-[4px] text-gray-500 items-center">
          <MapPin className="w-[16px] h-[16px]" />
          <p className="pg2 text-left">{location}</p>
        </div>
      </CardContent>
      <CardFooter className="px-[24px] mb-[12px]">
        {mode === 'remove' ? (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" size="icon" className="w-full cursor-pointer">
                <Trash2 />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-left">Delete League?</DialogTitle>
                <DialogDescription>
                  <p className="font-paragraph text-left">
                    Are you sure you want to delete the league{' '}
                    <span className="text-red-600">{name}</span>?
                  </p>
                  <div className="flex gap-2 mt-4 justify-end items-end">
                    <Button
                      variant="outline"
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
                      <Trash2 /> {isDeleting ? 'Deleting...' : 'Delete'}
                    </Button>
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        ) : (
          <Button
            variant="default"
            size="default"
            className="text-primary-foreground w-full cursor-pointer"
            onClick={handleViewDetails}
          >
            View Details
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
