import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';

export default function Login() {
  const form = useForm();
  return (
    <Form {...form}>
      <form className="rounded-sm border border-border relative z-10 bg-white flex flex-col justify-center paragraph-s-regular items-center gap-6 p-8">
        <div className="flex flex-col gap-2 md:w-lg w-full">
          <h4>Contact Support</h4>
          <p className="text-muted-foreground">Input the necessary fields for us to help you</p>
        </div>
        <div className="flex flex-col gap-7 w-full md:w-lg">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Enter email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Enter subject" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter message" rows={6} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="w-full">
          <p>Done</p>
        </Button>
      </form>
    </Form>
  );
}
