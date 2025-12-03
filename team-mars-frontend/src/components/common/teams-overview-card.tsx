import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { useTeams } from '@/hooks/use-teams';
import { RectangleEllipsis } from 'lucide-react';

export const TeamsOverviewCard = () => {
  const { teams, isLoading, error, formatDate } = useTeams();

  if (error) {
    return (
      <Card className="w-full border border-border shadow-md">
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-foreground">Teams</h3>
                <p className="pg2 text-destructive mt-1">Error loading teams: {error}</p>
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
          <div className="space-y-4">
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
    <Card className="w-full h-full border border-border shadow-md">
      <CardContent className="space-y-[24px] h-full flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-end">
          <div>
            <h4 className="text-foreground">Teams</h4>
            <p className="pg2 text-muted-foreground">
              {teams.length > 0 ? `${teams.length} teams recently registered` : 'No teams found'}
            </p>
          </div>
          <Button
            variant="default"
            size="sm"
            className="bg-primary text-primary-foreground cursor-pointer"
          >
            Manage
            {/* Add onclick path when team page form is made */}
          </Button>
        </div>

        {/* Table */}
        <div className="space-y-0">
          <div className="overflow-x-auto">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 pb-3 border-b-2 border-foreground/30 min-w-[600px]">
              <div className="col-span-2">
                <span className="pg2-bold text-muted-foreground">ID</span>
              </div>
              <div className="col-span-5">
                <span className="pg2-bold text-muted-foreground">Name</span>
              </div>
              <div className="col-span-4">
                <span className="pg2-bold text-muted-foreground">Created at</span>
              </div>
            </div>

            {/* Table Rows */}
            <div className="space-y-0">
              {teams.length > 0 ? (
                teams.map((team) => (
                  <div
                    key={team.team_id}
                    className="grid grid-cols-12 gap-4 py-4 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors min-w-[600px]"
                  >
                    <div className="col-span-2">
                      <span className="pg1 text-foreground ">{team.team_id}</span>
                    </div>
                    <div className="col-span-5">
                      <span className="pg1 text-foreground">{team.team_name}</span>
                    </div>
                    <div className="col-span-4">
                      <span className="pg1 text-foreground">{formatDate(team.created_at)}</span>
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="h-6 w-6 hover:bg-muted-foreground/20 cursor-pointer"
                          >
                            <RectangleEllipsis />
                            {/* Add onclick path when team page form is made */}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent
                          side="top"
                          align="center"
                          sideOffset={4}
                          className="[&>div]:hidden bg-muted text-foreground border border-foreground/30"
                        >
                          <p>Team details</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center">
                  <p className="pg1 text-muted-foreground">No teams found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
