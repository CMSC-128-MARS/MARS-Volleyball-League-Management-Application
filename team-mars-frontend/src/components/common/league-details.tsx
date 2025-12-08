import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

type LeagueDetailsProps = {
  leagueId: string;
  location: string;
  description?: string | null;
};

export default function LeagueDetails({ location, description }: LeagueDetailsProps) {
  return (
    <div className="w-full h-full shadow-md">
      <Card className="gap-2 transition-all duration-200">
        <CardHeader className="items-center px-6 pt-4">
          <CardTitle className="flex flex-row justify-between items-center w-full">
            <h4>Details</h4>
          </CardTitle>
        </CardHeader>
        <hr className="w-full border-t border-gray-400" />
        <CardContent className="flex flex-col gap-6 px-6 pb-6 pt-2">
          <div>
            <p className="pg1 mb-2">Location</p>
            <Input
              type="text"
              value={location}
              readOnly
              disabled
              className="rounded-sm border border-[#E5E5E5] bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]"
            />
          </div>
          <div>
            <p className="pg1 mb-2">Description</p>
            <Textarea
              value={description || 'No description available.'}
              readOnly
              disabled
              className="rounded-sm border border-[#E5E5E5] bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] min-h-[80px]"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
