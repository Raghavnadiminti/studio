'use server';
import { summarizeBookingRequest } from '@/ai/flows/summarize-booking-request';
import { bookings } from './data';
import type { Booking, UserRole } from './types';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

export async function getBookings() {
  return JSON.parse(JSON.stringify(bookings));
}

const BookingFormSchema = z.object({
  eventName: z.string().min(3, 'Event name is required.'),
  eventDescription: z.string().min(10, 'Description is required.'),
  hallId: z.string(),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  fileDataUri: z.string().min(1, 'Letter is required.'),
});

export async function createBooking(userId: string, formData: FormData) {
  const rawFormData = Object.fromEntries(formData.entries());
  
  const validatedFields = BookingFormSchema.safeParse(rawFormData);
  if (!validatedFields.success) {
    return { success: false, message: "Invalid form data." };
  }
  const data = validatedFields.data;

  try {
    const { summary } = await summarizeBookingRequest({ fileDataUri: data.fileDataUri });
    
    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      userId,
      eventName: data.eventName,
      eventDescription: data.eventDescription,
      hallId: data.hallId,
      date: new Date(data.date).toISOString().split('T')[0],
      startTime: data.startTime,
      endTime: data.endTime,
      status: 'pending_hod',
      summary: summary,
      submittedAt: new Date().toISOString(),
      letterUrl: '/placeholder.pdf', // In a real app, upload and get URL
    };
    
    bookings.unshift(newBooking);
    revalidatePath('/dashboard');
    revalidatePath('/book-slot');
    return { success: true, message: 'Booking request submitted successfully!' };

  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to process booking request.' };
  }
}

export async function approveBooking(bookingId: string, role: UserRole) {
  const bookingIndex = bookings.findIndex(b => b.id === bookingId);
  if (bookingIndex === -1) return { success: false, message: 'Booking not found.' };

  const booking = bookings[bookingIndex];
  let newStatus: Booking['status'] | undefined;

  if (role === 'HOD' && booking.status === 'pending_hod') {
    newStatus = 'pending_principal';
    bookings[bookingIndex].status = newStatus;
  } else if (role === 'Principal' && booking.status === 'pending_principal') {
    newStatus = 'approved';
    bookings[bookingIndex].status = newStatus;
  } else {
    return { success: false, message: 'You do not have permission to approve this request at its current state.' };
  }
  
  revalidatePath('/dashboard');
  revalidatePath('/book-slot');
  return { success: true, message: 'Booking approved.', newStatus };
}

export async function rejectBooking(bookingId: string, reason: string) {
    const bookingIndex = bookings.findIndex(b => b.id === bookingId);
    if (bookingIndex === -1) return { success: false, message: 'Booking not found.' };

    bookings[bookingIndex].status = 'rejected';
    bookings[bookingIndex].rejectionReason = reason;

    revalidatePath('/dashboard');
    revalidatePath('/book-slot');
    return { success: true, message: 'Booking rejected.' };
}
