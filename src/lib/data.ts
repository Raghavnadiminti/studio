import { User, Hall, Booking } from './types';

export const users: User[] = [
  { id: 'user-1', name: 'Alice Johnson', email: 'alice@example.com', role: 'Club Lead', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
  { id: 'user-2', name: 'Bob Williams', email: 'bob@example.com', role: 'Club Lead', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705d' },
  { id: 'user-3', name: 'Dr. Evelyn Reed', email: 'evelyn.reed@example.com', role: 'HOD', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026706d' },
  { id: 'user-4', name: 'Principal Miller', email: 'principal.miller@example.com', role: 'Principal', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026707d' },
];

export const halls: Hall[] = [
  { id: 'hall-1', name: 'Seminar Hall A', capacity: 150 },
  { id: 'hall-2', name: 'Seminar Hall B', capacity: 250 },
  { id: 'hall-3', name: 'Conference Room', capacity: 50 },
];

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
const nextWeek = new Date(today);
nextWeek.setDate(today.getDate() + 7);


export const bookings: Booking[] = [
  {
    id: 'booking-1',
    hallId: 'hall-1',
    userId: 'user-1',
    eventName: 'Annual Tech Symposium',
    eventDescription: 'A symposium about the latest trends in technology.',
    date: nextWeek.toISOString().split('T')[0],
    startTime: '10:00',
    endTime: '16:00',
    status: 'pending_hod',
    summary: 'Request for Annual Tech Symposium in Hall A. Discusses new tech trends.',
    submittedAt: today.toISOString(),
    letterUrl: '/placeholder.pdf',
  },
  {
    id: 'booking-2',
    hallId: 'hall-2',
    userId: 'user-2',
    eventName: 'Literary Fest Opening Ceremony',
    eventDescription: 'The inaugural event for the week-long literary festival.',
    date: nextWeek.toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '11:00',
    status: 'pending_principal',
    summary: 'Request for the opening ceremony of the Literary Fest in Hall B.',
    submittedAt: new Date(today.getTime() - 86400000).toISOString(), // Yesterday
    letterUrl: '/placeholder.pdf',
  },
  {
    id: 'booking-3',
    hallId: 'hall-3',
    userId: 'user-1',
    eventName: 'Debate Club Finals',
    eventDescription: 'The final round of the inter-club debate competition.',
    date: tomorrow.toISOString().split('T')[0],
    startTime: '14:00',
    endTime: '17:00',
    status: 'approved',
    summary: 'Booking for the Debate Club Finals in the Conference Room. All previous rounds are complete.',
    submittedAt: new Date(today.getTime() - 2 * 86400000).toISOString(),
    letterUrl: '/placeholder.pdf',
  },
  {
    id: 'booking-4',
    hallId: 'hall-1',
    userId: 'user-2',
    eventName: 'Guest Lecture on AI',
    eventDescription: 'A guest lecture by a prominent AI researcher.',
    date: new Date(today.setDate(today.getDate() + 10)).toISOString().split('T')[0],
    startTime: '11:00',
    endTime: '13:00',
    status: 'rejected',
    rejectionReason: 'Hall already booked for maintenance.',
    summary: 'Request for a guest lecture on AI. Clashes with scheduled maintenance.',
    submittedAt: new Date(today.getTime() - 3 * 86400000).toISOString(),
    letterUrl: '/placeholder.pdf',
  },
];
