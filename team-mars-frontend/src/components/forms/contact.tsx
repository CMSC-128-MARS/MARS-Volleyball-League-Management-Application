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
import { Headset } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';

export default function Login() {
  const form = useForm();
  const [rows, setRows] = useState(6);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setRows(2);
      } else {
        setRows(6);
      }
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Form {...form}>
      <form className="rounded-[2px] border border-border relative z-10 bg-white flex flex-col justify-center paragraph-s-regular items-center gap-6 p-8 w-full md:w-md lg:w-lg max-w-lg">
        <div className="flex flex-col gap-2 w-full">
          <h4>Contact Support</h4>
          <p className="text-muted-foreground">Input the necessary fields for us to help you</p>
        </div>
        <div className="flex flex-col gap-7 w-full">
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
                  <Textarea placeholder="Enter message" rows={rows} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="w-full">
          <Headset className="w-4 text-white" />
          <p>Done</p>
        </Button>
      </form>
    </Form>
  );
}
