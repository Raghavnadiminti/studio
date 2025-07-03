export type UserRole = 'Club Lead' | 'HOD' | 'Principal';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
};

export type BookingStatus =
  | 'pending_hod'
  | 'pending_principal'
  | 'approved'
  | 'rejected';

export type Hall = {
  id: string;
  name: string;
  capacity: number;
};

export type Booking = {
  id: string;
  hallId: string;
  userId: string;
  eventName: string;
  eventDescription: string;
  date: string; // Using string to ensure serializability between server/client
  startTime: string;
  endTime: string;
  status: BookingStatus;
  rejectionReason?: string;
  summary?: string;
  submittedAt: string; // Using string for serializability
  letterUrl: string; // Path to the uploaded letter
};
