import { Card, CardContent } from '@/components/ui/card';
import { Trash } from 'lucide-react';

type SelectedPlayersCardProps = {
  skillLevel: number;
  name: string;
  jerseyNumber: string;
  position: string;
  onRemove?: () => void;
};

export default function SelectedPlayersCard({
  skillLevel,
  name,
  jerseyNumber,
  position,
  onRemove,
}: SelectedPlayersCardProps) {
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove?.();
  };

  return (
    <div className="w-full">
      <Card className="rounded-sm border border-gray-200 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-1">
            <div className="flex items-center gap-2">
              <div className="bg-primary py-1 px-2 text-white rounded-sm text-[12px] flex items-center justify-center font-semibold">
                {skillLevel ?? '0'}
              </div>
              <span className="text-muted-foreground font-paragraph text-xs">Skill Level</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-secondary-alt font-light font-paragraph text-md">
                #{jerseyNumber ?? 'N/A'}
              </span>
              <button
                type="button"
                aria-label="Remove player"
                onClick={handleRemove}
                className="bg-red-600 text-white p-1 rounded-sm hover:bg-red-700 transition-colors"
              >
                <Trash className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-light font-paragraph text-md">{name}</p>
            <p className="font-light font-paragraph text-md text-muted-foreground">{position}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
