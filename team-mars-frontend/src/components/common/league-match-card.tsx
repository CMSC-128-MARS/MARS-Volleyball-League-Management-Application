import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Pencil, Trash} from 'lucide-react';

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
  num_of_sets?: number;
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
  num_of_sets = 3,
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

  const winner =
    team1Score !== undefined && team2Score !== undefined && team1Score > team2Score
      ? 1
      : team1Score !== undefined && team2Score !== undefined && team2Score > team1Score
        ? 2
        : null;

  return (
    <Card className="p-[24px] shadow-md border border-border">
      {/* Top Row */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <Badge
            className="text-white rounded-[2px] px-[8px] py-[4px]"
            style={{
              backgroundColor: isCompleted ? 'var(--primary)' : 'var(--secondary-alt)',
            }}
          >
            {formatDate(matchDate)}
          </Badge>
          {isCompleted && location && (
            <div className="flex items-center gap-1 text-muted-foreground pg2">
              <MapPin className="h-3 w-3" />
              <span>{location}</span>
            </div>
          )}
        </div>

        {/* Edit/Delete Buttons */}
        {isEditing && (
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="default"
              className="h-8 w-8 rounded-[2px] hover:bg-primary hover:opacity-80 cursor-pointer"
              onClick={() => onEdit?.(matchId)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="destructive"
              className="h-8 w-8 rounded-[2px] hover:bg-red-600 hover:opacity-80 cursor-pointer"
              onClick={() => onDelete?.(matchId)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex justify-between items-start gap-6">
        {/* Teams and Scores */}
        <div className={`space-y-0 flex flex-col ${isCompleted ? 'w-full' : ''}`}>
          {/* Team 1 */}
          <div className="flex justify-between items-center py-2">
            <p className={`pg1-bold ${winner === 1 && isCompleted ? 'text-[#B8860B]' : ''}`}>
              {team1Name}
            </p>
            {isCompleted && team1Score !== undefined && (
              <div className="flex items-center gap-4">
                <span className={`text-2xl font-bold ${winner === 1 ? 'text-[#B8860B]' : ''}`}>
                  {team1Score}
                </span>
                {team1Sets.length > 0 && (
                  <div className="flex gap-2 text-sm">
                    {team1Sets.map((set, idx) => (
                      <span key={idx} className="font-semibold text-right min-w-[20px]">
                        {set}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Divider */}
          <hr className="border-gray-300" />

          {/* Team 2 */}
          <div className="flex justify-between items-center py-2">
            <p className={`pg1-bold ${winner === 2 && isCompleted ? 'text-[#B8860B]' : ''}`}>
              {team2Name}
            </p>
            {isCompleted && team2Score !== undefined && (
              <div className="flex items-center gap-4">
                <span className={`text-2xl font-bold ${winner === 2 ? 'text-[#B8860B]' : ''}`}>
                  {team2Score}
                </span>
                {team2Sets.length > 0 && (
                  <div className="flex gap-2 text-sm">
                    {team2Sets.map((set, idx) => (
                      <span key={idx} className="font-semibold text-right min-w-[20px]">
                        {set}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sets and Location Info for Upcoming Matches */}
        {!isCompleted && (
          <div className="flex flex-col gap-2 text-right h-full justify-center">
            <div>
              <p className="pg2 text-muted-foreground">
                <span className="font-bold text-black">{num_of_sets}</span> set
                {num_of_sets !== 1 ? 's' : ''}
              </p>
            </div>
            {location && (
              <div className="flex items-center justify-end gap-1 text-muted-foreground pg2">
                <MapPin className="h-3 w-3" />
                <span>{location}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
