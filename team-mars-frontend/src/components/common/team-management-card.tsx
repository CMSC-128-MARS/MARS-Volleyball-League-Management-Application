import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Volleyball } from 'lucide-react';

export default function TeamManagementCard() {
  return (
    <Card className="w-full max-w-sm rounded-[2px] border border-border bg-white shadow-lg">
      <CardHeader>
        <CardTitle><Volleyball className='text-secondary-alt'/></CardTitle>
      </CardHeader>
      <CardContent>
        <div>
            Jaepril's Warriors
        </div>
      </CardContent>
    </Card>
  );
}
