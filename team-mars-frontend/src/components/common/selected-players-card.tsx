import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import SelectedTeamButtons from './selected-team-buttons';

export default function SelectedPlayersCard() {
  return (
    <div className="w-full h-full min-h-[300px] shadow-md bg-white">
      <Card className="gap-2 transition-all duration-200 h-full">
        <CardHeader className="items-center px-6 pt-4">
          <CardTitle className="flex flex-row justify-between items-center w-full">
            <h4>Selected Players</h4>
            <p className="text-sm text-gray-500 font-paragraph text-4">Total: </p>
          </CardTitle>
        </CardHeader>
        <hr className="w-full border-t border-[#A3A3A3]" />
        <CardContent className="flex flex-col gap-6 px-6 pb-6">
          <SelectedTeamButtons onBack={() => {}} onNext={() => {}} />
          {/* Content goes here */}
        </CardContent>
      </Card>
    </div>
  );
}
