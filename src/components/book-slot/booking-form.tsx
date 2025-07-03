'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Hall } from '@/lib/types';
import { ReactNode, useState, useRef } from 'react';
import { format } from 'date-fns';
import { createBooking } from '@/lib/actions';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Spinner } from '../shared/spinner';
import { useRouter } from 'next/navigation';

interface BookingFormProps {
  hall: Hall;
  date: Date;
  time: string;
  trigger: ReactNode;
}

export function BookingForm({ hall, date, time, trigger }: BookingFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileInput = formRef.current?.elements.namedItem('fileDataUri') as HTMLInputElement;
        if(fileInput) {
            fileInput.value = event.target?.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!user) {
        toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in.' });
        setIsLoading(false);
        return;
    }
    
    const formData = new FormData(e.currentTarget);
    const result = await createBooking(user.id, formData);

    if (result.success) {
      toast({ title: 'Success', description: result.message });
      setOpen(false);
      router.refresh();
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.message });
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <form onSubmit={handleSubmit} ref={formRef}>
          <DialogHeader>
            <DialogTitle>Request Booking</DialogTitle>
            <DialogDescription>
              You are booking <strong>{hall.name}</strong> on{' '}
              <strong>{format(date, 'PPP')}</strong> at <strong>{time}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="eventName">Event Name</Label>
              <Input id="eventName" name="eventName" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="eventDescription">Event Description</Label>
              <Textarea id="eventDescription" name="eventDescription" required />
            </div>
             <div className="grid gap-2">
              <Label htmlFor="letter">Request Letter (PDF or Image)</Label>
              <Input id="letter" type="file" required onChange={handleFileChange} accept="application/pdf,image/*" />
              <input type="hidden" name="fileDataUri" />
            </div>
          </div>
          <input type="hidden" name="hallId" value={hall.id} />
          <input type="hidden" name="date" value={date.toISOString()} />
          <input type="hidden" name="startTime" value={time} />
          <input type="hidden" name="endTime" value={`${String(parseInt(time.split(':')[0]) + 1).padStart(2, '0')}:00`} />
          <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="secondary">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Spinner className="mr-2 h-4 w-4" />}
              Submit Request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
