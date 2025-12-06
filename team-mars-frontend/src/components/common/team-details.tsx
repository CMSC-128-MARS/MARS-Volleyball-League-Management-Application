import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type TeamDetailsProps = {
  teamName: string;
  leagueName: string;
  teamId: string;
};

export default function TeamDetails({ teamName, leagueName, teamId }: TeamDetailsProps) {
  return (
    <div className="w-full h-full shadow-md ">
      <Card className="gap-2 transition-all duration-200">
        <CardHeader className="items-center px-6 pt-4">
          <CardTitle className="flex flex-row justify-between items-center w-full">
            <h4>Details</h4>
          </CardTitle>
        </CardHeader>
        <hr className="w-full border-t border-[#A3A3A3]" />
        <CardContent className="flex flex-col gap-6 px-6 pb-6 pt-2">
          <div>
            <p className="mb-2">Team Name</p>
            <Input
              type="text"
              value={teamName}
              readOnly
              disabled
              className="rounded-sm border border-[#E5E5E5] bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]"
            />
          </div>
          <div>
            <p className="mb-2">League</p>
            <Input
              type="text"
              value={leagueName}
              readOnly
              disabled
              className="rounded-sm border border-[#E5E5E5] bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
