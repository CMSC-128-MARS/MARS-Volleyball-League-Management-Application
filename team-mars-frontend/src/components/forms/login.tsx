import { LogIn } from 'lucide-react';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';

interface LoginFormProps {
  onContactClick?: () => void;
}

export default function Login({ onContactClick }: LoginFormProps) {
  const form = useForm();
  return (
    <Form {...form}>
      <form className="rounded-sm border border-border relative z-10 bg-white flex flex-col justify-center paragraph-s-regular items-center gap-6 p-8">
        <div className="flex flex-col gap-2 md:w-lg w-full">
          <h4>Log in</h4>
          <p className="text-muted-foreground">Enter your username and password to proceed.</p>
        </div>
        <div className="flex flex-col gap-7 w-full md:w-lg">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Enter username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Enter password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="w-full">
          <LogIn className="h-4 w-4 text-white" />
          <p>Sign In</p>
        </Button>

        <p className="text-muted-foreground">
          Having trouble signing in?{' '}
          <button type="button" onClick={onContactClick} className="text-secondary-alt underline">
            Contact Support
          </button>
        </p>
      </form>
    </Form>
  );
}
