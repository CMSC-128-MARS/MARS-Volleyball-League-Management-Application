import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SquarePen, Cog } from 'lucide-react';
import { useState } from 'react';

export default function AddTeamDetails() {
  return (
    <div className="w-full h-full shadow-md">
      <Card className="gap-2">
        <CardHeader className="items-center px-6 pt-4">
          <CardTitle className="flex flex-col justify-start items-start w-full gap-1">
            <h4>Create Roster</h4>
            <p className="text-sm text-gray-500 font-paragraph text-4">
              Choose manual or automatic roster creation
            </p>
          </CardTitle>
        </CardHeader>
        <hr className="w-full border-t border-[#A3A3A3]" />
        <CardContent className="flex flex-col md:flex-row gap-6 pb-6 pt-4 items-center justify-center">
          <div className="w-full hover:cursor-pointer rounded-sm border-[#E5E5E5] hover:border-[#737373] shadow-md flex flex-col gap-2 items-center justify-center border px-6 py-8 h-[178px]">
            <SquarePen />
            <h4>Manual Creation</h4>
            <p className="text-sm text-gray-500 font-paragraph text-center">
              Choose your players manually to create a roster
            </p>
          </div>
          <div className="w-full hover:cursor-pointer rounded-sm border-[#E5E5E5] hover:border-[#737373] shadow-md flex flex-col gap-2 items-center justify-center border px-6 py-8 h-[178px]">
            <Cog />
            <h4>Automatic Creation</h4>
            <p className="text-sm text-gray-500 font-paragraph text-center">
              Chooses players by skill to form a balanced roster.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
