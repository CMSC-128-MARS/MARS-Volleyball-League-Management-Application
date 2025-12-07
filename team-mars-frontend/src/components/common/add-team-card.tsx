import { Card, CardContent } from '@/components/ui/card';
import { SquarePlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AddTeamCard() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/addteam');
  };

  return (
    <div className="w-full h-full">
      <Card
        onClick={handleClick}
        className="h-full transition-all duration-200 items-center justify-center border-dashed border-2 border-[#C4C4C4] hover:cursor-pointer hover:-translate-y-0.5 hover:shadow-xl hover:border-neutral-400"
      >
        <CardContent className="flex flex-row gap-2 items-center justify-center h-full">
          <SquarePlus className="text-[#525252] w-6 h-6 m-auto" />
          <p className="text-sm font-paragraph">Create team</p>
        </CardContent>
      </Card>
    </div>
  );
}
