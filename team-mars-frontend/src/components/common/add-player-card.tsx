import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UserRoundPlus } from 'lucide-react';

const isDialogOpen = true; 
const setIsDialogOpen = (open: boolean) => {}; 

const currentPlayer = {
  first_name: 'John',
  last_name: 'Doe',
  jersey_number: 10,
  default_position: 'Setter',
  created_at: '2023-01-15T00:00:00Z',
  skill_level: 5,
  date_evaluated: '2023-02-20T00:00:00Z',
  skill_level_description: 'Advanced player with strong skills.',
  notes: 'Needs to improve serving accuracy.',
}; 

export default function AddPlayerCard() {
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="gap-0 max-h-[90vh] flex flex-col md:max-w-2xl">
        <DialogHeader className="text-left -mt-2 mb-2 flex-shrink-0">
          <DialogTitle>
            <h4>Player Details</h4>
          </DialogTitle>
        </DialogHeader>
        <hr className="w-[calc(100%+3rem)] -ml-6 border-t border-[#A3A3A3] flex-shrink-0" />
        <div className="overflow-y-auto flex-1 scrollbar-hide">
          {currentPlayer && (
            <div className="flex flex-col gap-3 mt-6">
              <div className="flex flex-col md:grid md:grid-cols-3 gap-4">
                <div>
                  <p className="text-[14px] text-black mb-1">First Name</p>
                  <Input
                    value={currentPlayer.first_name}
                    readOnly
                    className="bg-gray-50 text-[14px] text-gray-500"
                  />
                </div>
                <div>
                  <p className="text-[14px] text-black mb-1">Last Name</p>
                  <Input
                    value={currentPlayer.last_name || 'N/A'}
                    readOnly
                    className="bg-gray-50 text-[14px] text-gray-500"
                  />
                </div>
                <div>
                  <p className="text-[14px] text-black mb-1">Jersey Number</p>
                  <Input
                    value={currentPlayer.jersey_number?.toString() || 'N/A'}
                    readOnly
                    className="bg-gray-50 text-[14px] text-gray-500"
                  />
                </div>
              </div>
              <div className="flex flex-col md:grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-[14px] text-black mb-1">Default Position</p>
                  <Input
                    value={currentPlayer.default_position || 'N/A'}
                    readOnly
                    className="bg-gray-50 text-[14px] text-gray-500"
                  />
                </div>
                <div>
                  <p className="text-[14px] text-black mb-1">Player Creation Date</p>
                  <Input
                    value={
                      currentPlayer.created_at
                        ? new Date(currentPlayer.created_at).toLocaleDateString()
                        : 'N/A'
                    }
                    readOnly
                    className="bg-gray-50 text-[14px] text-gray-500"
                  />
                </div>
              </div>
              <div className="flex flex-col md:grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-[14px] text-black mb-1">Skill Level</p>
                  <Input
                    value={currentPlayer.skill_level?.toString() || 'N/A'}
                    readOnly
                    className="bg-gray-50 text-[14px] text-gray-500"
                  />
                </div>
                <div>
                  <p className="text-[14px] text-black mb-1">Date Evaluated</p>
                  <Input
                    value={
                      currentPlayer.date_evaluated
                        ? new Date(currentPlayer.date_evaluated).toLocaleDateString()
                        : 'N/A'
                    }
                    readOnly
                    className="bg-gray-50 text-[14px] text-gray-500"
                  />
                </div>
              </div>
              <div>
                <p className="text-[14px] text-black mb-1">Skill Level Description</p>
                <Input
                  value={currentPlayer.skill_level_description || 'N/A'}
                  readOnly
                  className="bg-gray-50 text-[14px] text-gray-500"
                />
              </div>
              <div>
                <p className="text-[14px] text-black mb-1">Notes</p>
                <Input
                  value={currentPlayer.notes || 'N/A'}
                  readOnly
                  className="bg-gray-50 text-[14px] text-gray-500"
                />
              </div>
            </div>
          )}
        </div>
        <hr className="w-[calc(100%+3rem)] -ml-6 border-t border-[#A3A3A3] mt-6 flex-shrink-0" />
        <div className="w-full mt-4 flex-shrink-0">
          <Button className="w-full" onClick={handleAddPlayer}>
            <UserRoundPlus className="mr-2 h-4 w-4" strokeWidth={2.5} />
            <p className="font-extralight">Add Player</p>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
