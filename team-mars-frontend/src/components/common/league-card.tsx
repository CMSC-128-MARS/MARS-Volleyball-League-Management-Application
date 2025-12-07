import {Card, CardTitle, CardContent, CardFooter} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

type LeagueCardProps = {
  leagueId: string;
  name: string;
  location: string;
  description?: string | null;
};

export const LeagueCard = ({ leagueId, name, location, description }: LeagueCardProps) => {
    return (
        <Card className="w-full border border-border shadow-md bg-card">
            {/* Card Header */}
            <div className="h-[220px] bg-background-alt text-primary-foreground relative p-[12px]"
                style={{
                    backgroundImage: `url('/assets/Dust.png')`,
                    backgroundSize: 'auto',
                    backgroundRepeat: 'repeat'
                }}
            >
                <div className="h-full border-[2px] border-secondary justify-center items-center flex px-[32px] py-[16px] text-center">
                    <CardTitle className="w-full max-w-full">
                        <h3 className="text-secondary italic text-center font-bold uppercase break-words whitespace-normal">{name}</h3>
                    </CardTitle>
                </div>
            </div>
            {/* Card Content */}
            <CardContent className="px-[24px] flex flex-col gap-[12px]">
                <p className="pg2 text-foreground text-left">
                    {description || 'No description available.'}
                </p>
                <div className="flex flex-row gap-[4px] text-gray-500 items-center">
                    <MapPin className="w-[16px] h-[16px]" />
                    <p className="pg2 text-left">
                    {location}
                </p>
                </div>
            </CardContent>
            <CardFooter className="px-[24px] mb-[12px]">
                <Button
                    variant="default"
                    size="default"
                    className="text-primary-foreground w-full cursor-pointer"
                    onClick={() => {
                        // Navigate to league details page
                        window.location.href = `/leagues/${leagueId}`;
                    }}
                >
                View Details
                </Button>
            </CardFooter>
        </Card>
    );
};



            