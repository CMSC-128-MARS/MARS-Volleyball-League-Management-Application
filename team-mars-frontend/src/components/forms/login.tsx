import { LogIn } from 'lucide-react';
import { toast } from 'sonner';
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
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';

interface LoginFormProps {
  onContactClick?: () => void;
}

interface LoginFormData {
  username: string;
  password: string;
}

export default function Login({ onContactClick }: LoginFormProps) {
  const form = useForm<LoginFormData>();
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const setLoading = useAuthStore((s) => s.setLoading);
  const handleSubmit = async (data: LoginFormData) => {
    let loadingToastId: string | number | undefined;
    try {
      setLoading(true);
      loadingToastId = toast.loading('Signing in...', {
        duration: 10000,
        style: {
          borderRadius: '2px',
          border: '2px solid var(--border)',
        },
      });
      const result = await authSignIn({ username: data.username, password: data.password });

      if (!result.success) {
        console.error('Login failed:', result.error);
        toast.dismiss(loadingToastId);
        toast.error('Login failed. Please try again.', { duration: 5000, style: {
          color: "var(--destructive)", borderRadius: "2px", border: "2px solid var(--destructive)"
        } });
        return;
      }

      // If Cognito requires new password, do not navigate yet
      if (
        result.success &&
        (result as { success: true; challenge?: string }).challenge === 'NEW_PASSWORD_REQUIRED'
      ) {
        console.warn('NEW_PASSWORD_REQUIRED challenge returned. Complete new password flow.');
        toast.dismiss(loadingToastId);
        toast.warning('Warning: NEW_PASSWORD_REQUIRED challenge returned. Complete new password flow.', { duration: 5000, style: {
        color: "var(--warning)", borderRadius: "2px", border: "2px solid var(--warning)"
        } });
        // TODO: show modal to complete new password
        return;
      }

      // Mark user authenticated and navigate to dashboard
      setUser(data.username);
      console.log('Login successful:', { username: data.username });
      toast.dismiss(loadingToastId);
      navigate('/dashboard');
      toast.success('Login successful!', { duration: 5000, style: {
        color: "var(--success)", borderRadius: "2px", border: "2px solid var(--success)"
      } })
    } finally {
      setLoading(false);
    }
  };
  return (
    <Form {...form}>
      <form className="rounded-[2px] border border-border relative z-10 bg-white flex flex-col justify-center paragraph-s-regular items-center gap-6 p-8 w-full md:w-md lg:w-lg max-w-lg">
        <div className="flex flex-col gap-2 w-full">
          <h4>Log in</h4>
          <p className="text-muted-foreground">Enter your username and password to proceed.</p>
        </div>
        <div className="flex flex-col gap-7 w-full">
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
          className="w-full hover:cursor-pointer"
          onClick={form.handleSubmit(handleSubmit)}
        >
          <LogIn className="it4 w-4 text-white" />
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
