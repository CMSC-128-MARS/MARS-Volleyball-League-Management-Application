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

export default function AddTeamDetails() {
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  return (
    <div className="w-full h-full">
      <Card className={`gap-2 transition-all duration-100 ${isSelectOpen ? 'pb-35' : ''}`}>
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
            <Input type="text" placeholder="Enter a unique team name" className="rounded-sm" />
          </div>
          <div>
            <p>
              League Selection <span className="text-secondary-alt">*</span>
            </p>
            <Select onOpenChange={setIsSelectOpen}>
              <SelectTrigger className="w-full rounded-sm border border-[#E5E5E5] bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
                <SelectValue placeholder="--" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Select a league</SelectLabel>
                  <SelectItem value="Errol League">Errol League</SelectItem>
                  <SelectItem value="Chicken League">Chicken League</SelectItem>
                  <SelectItem value="League of Legends">League of Legends</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
