import { Card, CardContent } from '@/components/ui/card';
import { SquarePlus } from 'lucide-react';
import AddLeagueDialog from '@/components/forms/add-league';

export default function AddLeagueCard() {
  return (
    <div className="w-full h-full">
      <AddLeagueDialog>
        <Card className="h-full transition-all duration-200 items-center justify-center border-dashed border-2 border-[#C4C4C4] hover:cursor-pointer hover:-translate-y-0.5 hover:shadow-xl hover:border-neutral-400">
          <CardContent className="flex flex-row gap-2 items-center justify-center h-full py-8">
            <SquarePlus className="text-foreground w-6 h-6 m-auto" />
            <p className="text-sm font-paragraph">Add a league</p>
          </CardContent>
        </Card>
      </AddLeagueDialog>
    </div>
  );
}
