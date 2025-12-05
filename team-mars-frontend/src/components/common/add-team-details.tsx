import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectLabel,
  SelectGroup,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useLeagues } from '@/hooks/use-leagues';

type AddTeamDetailsProps = {
  teamName: string;
  onTeamNameChange: (name: string) => void;
  leagueId: string;
  onLeagueChange: (leagueId: string) => void;
};

export default function AddTeamDetails({
  teamName,
  onTeamNameChange,
  leagueId,
  onLeagueChange,
}: AddTeamDetailsProps) {
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const { leagues, isLoading, error } = useLeagues();

  return (
    <div className="w-full h-full shadow-md ">
      <Card className={`gap-2 transition-all duration-200 ${isSelectOpen ? 'pb-35 lg:pb-0' : ''}`}>
        <CardHeader className="items-center px-6 pt-4">
          <CardTitle className="flex flex-row justify-between items-center w-full">
            <h4>Add Details</h4>
            <p className="text-sm text-gray-500 font-paragraph text-4">ID: #12345</p>
          </CardTitle>
        </CardHeader>
        <hr className="w-full border-t border-[#A3A3A3]" />
        <CardContent className="flex flex-col gap-6 px-6 pb-6 pt-2">
          <div>
            <p>
              Team Name <span className="text-secondary-alt">*</span>
            </p>
            <Input
              type="text"
              placeholder="Enter a unique team name"
              className="rounded-sm"
              value={teamName}
              onChange={(e) => onTeamNameChange(e.target.value)}
            />
          </div>
          <div>
            <p>
              League Selection <span className="text-secondary-alt">*</span>
            </p>
            <Select onOpenChange={setIsSelectOpen} value={leagueId} onValueChange={onLeagueChange}>
              <SelectTrigger className="w-full rounded-sm border border-[#E5E5E5] bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
                <SelectValue placeholder={isLoading ? 'Loading leagues...' : '--'} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Select a league</SelectLabel>
                  {error && (
                    <div className="px-2 py-1.5 text-sm text-red-600">Error loading leagues</div>
                  )}
                  {!isLoading && !error && leagues.length === 0 && (
                    <div className="px-2 py-1.5 text-sm text-muted-foreground">
                      No leagues available
                    </div>
                  )}
                  {leagues.map((league) => (
                    <SelectItem key={league.league_id} value={league.league_id}>
                      {league.league_name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
