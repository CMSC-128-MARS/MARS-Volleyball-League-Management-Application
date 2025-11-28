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
import { authSignIn } from '@/lib/auth';

interface LoginFormProps {
  onContactClick?: () => void;
}

interface LoginFormData {
  username: string;
  password: string;
}

export default function Login({ onContactClick }: LoginFormProps) {
  const form = useForm<LoginFormData>();
  const handleSubmit = async (data: LoginFormData) => {
    const result = await authSignIn({
      username: data.username,
      password: data.password,
    });

    if (result.success) {
      console.log('Login successful!', result.user);
    } else {
      console.error('Login failed:', result.error);
    }
  };
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
        <Button
          type="submit"
          className="w-full cursor-pointer"
          onClick={form.handleSubmit(handleSubmit)}
        >
          <LogIn className="h-4 w-4 text-white" />
          <p>Sign In</p>
        </Button>

        <p className="text-muted-foreground">
          Having trouble signing in?{' '}
          <button
            type="button"
            onClick={onContactClick}
            className="text-secondary-alt underline cursor-pointer"
          >
            Contact Support
          </button>
        </p>
      </form>
    </Form>
  );
}
