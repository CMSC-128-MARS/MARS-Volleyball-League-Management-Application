import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { useLeagues } from '@/hooks/use-leagues';
import { RectangleEllipsis } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LeagueOverviewCard = () => {
  const { leagues, isLoading, error } = useLeagues();
  const navigate = useNavigate();

  if (error) {
    return (
      <Card className="w-full border border-border shadow-md">
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-foreground">Leagues</h3>
                <p className="pg2 text-destructive mt-1">Error loading Leagues: {error}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                Retry
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="w-full border border-border shadow-md">
        <CardContent className="p-6">
          <div className="space-y-24">
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-9 w-20" />
            </div>
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-4 border-b border-border last:border-b-0"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                  <Skeleton className="h-6 w-6 rounded-[2px]" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full border border-border shadow-md ">
      <div className="flex justify-between items-center px-6 py-4.5 border-b border-gray-200">
        <div>
          <h4 className="text-foreground text-xl">Leagues</h4>
        </div>
        <Button
          variant="default"
          className="bg-primary text-primary-foreground h-6 px-3 py-4 text-sm mr-2 font-medium cursor-pointer"
          onClick={() => navigate('/leagues')}
        >
          Manage
        </Button>
      </div>

      <CardContent className="space-y-[24px] flex flex-col p-6 pt-6"> 
        {/* --- Table --- */}
        <div className="space-y-0">
          <div className="overflow-x-auto">
            
            <div className="grid grid-cols-12 border-b-2 border-foreground/10 pb-2">
              <div className="col-span-4">
                <span className="pg2-bold block w-full text-xs">Name</span>
              </div>
              <div className="col-span-4">
                <span className="pg2-bold text-center block w-full text-xs">Location</span>
              </div>
              <div className="col-span-4">
                <span></span>
              </div>
            </div>

            {/* Table Rows */}
            <div className="space-y-0">
              <TooltipProvider>
                {leagues.length > 0 ? (
                  leagues.map((league) => (
                    <div
                      key={league.league_id}
                      className="grid grid-cols-12 items-center border-b border-border odd:bg-muted/50 last:border-b-0 hover:bg-muted/30 transition-colors py-3"
                    >
                      <div className="col-span-4">
                        <span className="pg1 text-foreground">{league.league_name}</span>
                      </div>
                      
                      <div className="col-span-4 text-center">
                        <span className="pg1 text-foreground">{league.location || '—'}</span>
                      </div>
                      <div className="col-span-4 flex justify-end pr-4">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-primary cursor-pointer"
                              onClick={() => {
                                console.log("Navigating to league:", league.league_id);
                                navigate(`/leagues/${league.league_id}`);
                              }}
                              aria-label="View League Details"
                            >
                              <RectangleEllipsis className="h-5 w-5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent
                            showArrow={false}
                            className="bg-muted border border-muted-foreground text-black font-paragraph rounded-sm"
                          >
                            <p>View Details</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center">
                    <p className="pg1 text-muted-foreground">No leagues found</p>
                  </div>
                )}
              </TooltipProvider>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};