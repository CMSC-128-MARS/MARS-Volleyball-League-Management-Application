import { Card, CardContent } from '@/components/ui/card';

export default function PlayerCard() {
  return (
    <div className="w-full h-full">
      <Card className="h-full transition-all duration-200 items-center justify-center border border-[#C4C4C4]">
        <CardContent className="flex flex-col gap-2">
          <p className="text-xs font-paragraph">Player Name</p>
          <p className="text-xs font-paragraph">Position</p>
        </CardContent>
      </Card>
    </div>
  );
}
