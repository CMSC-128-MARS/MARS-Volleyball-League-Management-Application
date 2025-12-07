import {Card,  CardTitle} from '@/components/ui/card';

type LeagueCardProps = {
  name?: string;
};

export const LeagueCard = ({ name = 'Otin otin otin' }: LeagueCardProps) => {
    return (
        <Card className="w-[302px] border border-border shadow-md bg-card h-[419px]">
            {/* Card Header */}
            <div className="h-[220px] bg-background-alt text-primary-foreground relative p-[12px]"
                style={{
                    backgroundImage: `url('/assets/Dust.png')`,
                    backgroundSize: 'auto',
                    backgroundRepeat: 'repeat'
                }}
            >
                <div className="h-full border-[2px] border-secondary justify-center items-center flex px-[32x] py-[16px] text-center">
                    <CardTitle className="w-full">
                        <h2 className="text-secondary italic text-center font-bold uppercase w-full break-words">{name}</h2>
                    </CardTitle>
                </div>
            </div>
        </Card>
    );
};



            