'use client';

import { useAuth } from '@/hooks/use-auth';
import { Booking, Hall, User, halls as mockHalls, users as mockUsers } from '@/lib/data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { approveBooking, rejectBooking, getBookings } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, XCircle, Hourglass, AlertTriangle, Eye } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { format } from 'date-fns';
import { useState, useEffect, useCallback } from 'react';
import { Skeleton } from '@/components/ui/skeleton';


function BookingDetailsDialog({ booking, hall, user }: { booking: Booking, hall?: Hall, user?: User }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{booking.eventName}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
            <p><strong>Status:</strong> <BookingStatusBadge status={booking.status} /></p>
            <p><strong>Submitted by:</strong> {user?.name || 'Unknown'}</p>
            <p><strong>Hall:</strong> {hall?.name || 'Unknown'}</p>
            <p><strong>Date:</strong> {format(new Date(booking.date), 'PPP')}</p>
            <p><strong>Time:</strong> {booking.startTime} - {booking.endTime}</p>
            <p><strong>Summary:</strong> {booking.summary || 'N/A'}</p>
            {booking.rejectionReason && <p><strong>Rejection Reason:</strong> {booking.rejectionReason}</p>}
             <Button variant="outline" asChild>
                <a href={booking.letterUrl} target="_blank" rel="noopener noreferrer">View Submitted Letter</a>
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const BookingStatusBadge = ({ status }: { status: Booking['status'] }) => {
  const statusConfig = {
    pending_hod: { label: 'Pending HOD', color: 'bg-yellow-500', icon: <Hourglass className="h-3 w-3 mr-1" /> },
    pending_principal: { label: 'Pending Principal', color: 'bg-yellow-500', icon: <Hourglass className="h-3 w-3 mr-1" /> },
    approved: { label: 'Approved', color: 'bg-green-500', icon: <CheckCircle2 className="h-3 w-3 mr-1" /> },
    rejected: { label: 'Rejected', color: 'bg-red-500', icon: <XCircle className="h-3 w-3 mr-1" /> },
  };

  const config = statusConfig[status] || { label: 'Unknown', color: 'bg-gray-400', icon: null };
  return <Badge className={`${config.color} hover:${config.color} text-white`}>{config.icon}{config.label}</Badge>;
};

const BookingListSkeleton = () => (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event</TableHead>
              <TableHead>Hall</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 3 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
);


export function BookingList() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookings = useCallback(async () => {
    try {
      const allBookings = await getBookings();
      setBookings(allBookings);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to fetch bookings.' });
    }
  }, [toast]);

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      fetchBookings().finally(() => setIsLoading(false));
    }
  }, [user, fetchBookings]);


  const handleApprove = async (bookingId: string) => {
    const result = await approveBooking(bookingId, user!.role);
    if (result.success) {
      toast({ title: 'Success', description: result.message });
      await fetchBookings();
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.message });
    }
  };

  const handleReject = async (bookingId: string) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
      const result = await rejectBooking(bookingId, reason);
      if (result.success) {
        toast({ title: 'Success', description: result.message });
        await fetchBookings();
      } else {
        toast({ variant: 'destructive', title: 'Error', description: result.message });
      }
    }
  };

  if (isLoading) {
    return <BookingListSkeleton />;
  }
  
  const filteredBookings = bookings.filter(booking => {
    if (!user) return false;
    if (user.role === 'Club Lead') {
      return booking.userId === user.id;
    }
    if (user.role === 'HOD') {
      return booking.status === 'pending_hod';
    }
    if (user.role === 'Principal') {
      return booking.status === 'pending_principal';
    }
    return false;
  }).sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

  if (filteredBookings.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardHeader>
          <div className="mx-auto bg-secondary rounded-full p-3 w-fit">
            <AlertTriangle className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle className="mt-4">No Requests Found</CardTitle>
          <CardDescription>
            {user?.role === 'Club Lead' 
                ? "You haven't submitted any booking requests yet."
                : "There are no pending requests for you at the moment."
            }
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event</TableHead>
              <TableHead>Hall</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.map((booking) => {
              const hall = mockHalls.find(h => h.id === booking.hallId);
              const bookingUser = mockUsers.find(u => u.id === booking.userId);
              const canAct = (user?.role === 'HOD' && booking.status === 'pending_hod') || (user?.role === 'Principal' && booking.status === 'pending_principal');
              return (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.eventName}</TableCell>
                  <TableCell>{hall?.name}</TableCell>
                  <TableCell>{format(new Date(booking.date), 'MMM d, yyyy')}</TableCell>
                  <TableCell><BookingStatusBadge status={booking.status} /></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-2">
                      <BookingDetailsDialog booking={booking} hall={hall} user={bookingUser} />
                      {canAct && (
                        <>
                          <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => handleApprove(booking.id)}>Approve</Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleReject(booking.id)}>Reject</Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
