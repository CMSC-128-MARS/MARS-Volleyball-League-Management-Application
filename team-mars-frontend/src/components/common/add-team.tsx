import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SquarePlus } from 'lucide-react';

export default function AddTeamCard() {
  return (
    <div className="w-full h-full">
      <Dialog>
        <DialogTrigger className="block w-full h-full rounded-xs border border-border bg-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:border-neutral-400">
          <Card className="h-full transition-all duration-200 items-center justify-center border-dashed border-2 border-[#C4C4C4]">
            <CardContent className="flex flex-col gap-2">
              <SquarePlus className="text-[#525252] w-6 h-6 m-auto" />
              <p className="text-xs font-paragraph">Add a team</p>
            </CardContent>
          </Card>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex flex-col gap-2">
              Add a team
              <hr className="" />
            </DialogTitle>
            <DialogDescription>
              <div>
                <p>
                  <b>ID: #12345</b>
                </p>
                <p>Input all important details of the team.</p>
              </div>
              <div>
                <p>Team Name</p>
                <Input type="text" placeholder="Enter a unique team name" />
              </div>
              <div>
                <p>League Joined</p>
                <DropdownMenu>
                  <DropdownMenuTrigger><Button variant={'outline'} className='w-full'>Choose League</Button></DropdownMenuTrigger>
                  <DropdownMenuContent className='w-full'>
                    <DropdownMenuItem>Errol League</DropdownMenuItem>
                    <DropdownMenuItem>Chicken League</DropdownMenuItem>
                    <DropdownMenuItem>League of Legends</DropdownMenuItem>
                    <DropdownMenuItem>Leagasus</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
