import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Pencil, Trash } from 'lucide-react';

type MatchCardProps = {
  matchId: string;
  matchDate: string;
  location?: string;
  team1Name: string;
  team2Name: string;
  team1Score?: number;
  team2Score?: number;
  team1Sets?: number[];
  team2Sets?: number[];
  firstToSets?: number;
  isCompleted?: boolean;
  isEditing?: boolean;
  onEdit?: (matchId: string) => void;
  onDelete?: (matchId: string) => void;
};

export default function LeagueMatchCard({
  matchId,
  matchDate,
  location,
  team1Name,
  team2Name,
  team1Score,
  team2Score,
  team1Sets = [],
  team2Sets = [],
  firstToSets = 3,
  isCompleted = false,
  isEditing = false,
  onEdit,
  onDelete,
}: MatchCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });
  };

  const winner = team1Score !== undefined && team2Score !== undefined && team1Score > team2Score ? 1 : team1Score !== undefined && team2Score !== undefined && team2Score > team1Score ? 2 : null;

  return (
    <Card className="p-4 bg-white shadow-sm border border-gray-200">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          {/* Date Badge */}
          <div className="mb-3">
            <Badge className="bg-secondary-alt text-white hover:bg-opacity-80 rounded-[2px] px-3 py-1 text-sm font-medium">
              {formatDate(matchDate)}
            </Badge>
          </div>

          {/* Teams */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <p className={`pg1-bold ${winner === 1 ? 'text-[#B8860B]' : ''}`}>
                {team1Name}
              </p>
              {isCompleted && team1Score !== undefined && (
                <div className="flex items-center gap-3">
                  <span className={`text-2xl font-bold ${winner === 1 ? 'text-[#B8860B]' : ''}`}>
                    {team1Score}
                  </span>
                  {team1Sets.length > 0 && (
                    <div className="flex gap-1 text-sm text-muted-foreground">
                      {team1Sets.map((set, idx) => (
                        <span key={idx} className="text-[#B8860B]">{set}</span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 my-2"></div>

            <div className="flex items-center justify-between">
              <p className={`pg1-bold ${winner === 2 ? 'text-[#B8860B]' : ''}`}>
                {team2Name}
              </p>
              {isCompleted && team2Score !== undefined && (
                <div className="flex items-center gap-3">
                  <span className={`text-2xl font-bold ${winner === 2 ? 'text-[#B8860B]' : ''}`}>
                    {team2Score}
                  </span>
                  {team2Sets.length > 0 && (
                    <div className="flex gap-1 text-sm text-muted-foreground">
                      {team2Sets.map((set, idx) => (
                        <span key={idx} className="text-[#B8860B]">{set}</span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Location/Sets Info */}
          <div className="mt-3 flex items-center gap-4">
            {location && isCompleted && (
              <div className="flex items-center gap-1 text-muted-foreground pg2">
                <MapPin className="h-3 w-3" />
                <span>{location}</span>
              </div>
            )}
            {!isCompleted && (
              <p className="pg2 text-muted-foreground">First to {firstToSets} set{firstToSets !== 1 ? 's' : ''}</p>
            )}
          </div>
        </div>

        {/* Edit/Delete Buttons */}
        {isEditing && (
          <div className="flex gap-2 ml-4">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-sm hover:bg-primary hover:text-white cursor-pointer"
              onClick={() => onEdit?.(matchId)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-sm hover:bg-red-600 hover:text-white cursor-pointer"
              onClick={() => onDelete?.(matchId)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
