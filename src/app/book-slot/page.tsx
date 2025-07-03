'use client';
import { AppLayout } from '@/components/layout/app-layout';
import { AuthGuard } from '@/components/layout/auth-guard';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { halls as mockHalls, bookings as mockBookings } from '@/lib/data';
import { Calendar } from '@/components/ui/calendar';
import { useState } from 'react';
import { addDays, format, isSameDay } from 'date-fns';
import { BookingForm } from '@/components/book-slot/booking-form';
import { Badge } from '@/components/ui/badge';
import { Building } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';

function BookSlotContent() {
  const { user } = useAuth();
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  if (user?.role !== 'Club Lead') {
      return (
        <div className="flex items-center justify-center h-full">
          <p>This page is only for Club Leads.</p>
        </div>
      );
  }

  const activeBookings = mockBookings.filter(b => b.status !== 'rejected');

  const isSlotBooked = (hallId: string, date: Date, time: string) => {
    return activeBookings.some(b => b.hallId === hallId && isSameDay(new Date(b.date), date) && b.startTime <= time && b.endTime > time);
  }

  const timeSlots = Array.from({ length: 10 }, (_, i) => `${String(i + 8).padStart(2, '0')}:00`); // 8 AM to 5 PM

  return (
    <>
      <PageHeader
        title="Book a Seminar Hall"
        subtitle="Select a date and an available time slot to make a request."
      />
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
            <Card>
                <CardHeader>
                    <CardTitle>Select Date</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={(day) => day < new Date() || day > addDays(new Date(), 60)}
                        initialFocus
                    />
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-2 space-y-6">
          {mockHalls.map(hall => (
            <Card key={hall.id}>
              <CardHeader>
                 <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Building className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>{hall.name}</CardTitle>
                      <CardDescription>Capacity: {hall.capacity} people</CardDescription>
                    </div>
                 </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {date && timeSlots.map(time => {
                    const isBooked = isSlotBooked(hall.id, date, time);
                    return isBooked ? (
                      <Badge key={time} variant="destructive" className="cursor-not-allowed p-2">
                        {time}
                      </Badge>
                    ) : (
                      <BookingForm
                        key={time}
                        hall={hall}
                        date={date}
                        time={time}
                        trigger={
                          <Button variant="outline" className="font-normal">
                            {time}
                          </Button>
                        }
                      />
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}

export default function BookSlotPage() {
  return (
    <AuthGuard>
      <AppLayout>
        <BookSlotContent />
      </AppLayout>
    </AuthGuard>
  );
}
