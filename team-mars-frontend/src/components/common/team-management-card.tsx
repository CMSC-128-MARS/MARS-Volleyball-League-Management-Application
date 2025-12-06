import { Card, CardContent } from '@/components/ui/card';
import { Volleyball } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type TeamManagementCardProps = {
  name: string;
  playerCount: number;
  teamId: string;
};

export default function TeamManagementCard({ name, playerCount, teamId }: TeamManagementCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/teams/${teamId}`);
  };

  return (
    <div className="w-full">
      <div
        onClick={handleClick}
        className="block w-full rounded-xs border border-border bg-white shadow-lg transition-all duration-200 hover:cursor-pointer hover:-translate-y-0.5 hover:shadow-xl hover:border-neutral-400"
      >
        <Card className="transition-all duration-200">
          <CardContent className="flex flex-row p-0 items-center">
            <div className="flex justify-center items-center bg-primary w-1/4 p-4 border-r-2 border-secondary self-stretch">
              <Volleyball className="text-secondary h-10 w-10" strokeWidth={1} />
            </div>
            <div className="flex flex-col justify-center text-left pl-2 py-4 gap-2 w-3/4 pr-2">
              <div className="flex items-start gap-2">
                <p className="font-heading font-semibold leading-tight flex-1">{name}</p>
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
