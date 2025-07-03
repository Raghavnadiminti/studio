# **App Name**: ClubHub Central

## Core Features:

- Slot Visualization: Display available seminar hall slots for each club.
- Booking Request Submission: Allow club leads to submit booking requests with a PDF/photo upload.
- Approval Workflow: Implement a multi-level approval workflow: Club Lead -> HOD -> Principal.
- Email Notifications: Send email notifications to HOD and Principal upon new booking requests.
- Document Summarization: Provide a short summary of the uploaded letter using Gemini API as a tool to aid HOD/Principal in their decision-making.
- Slot Locking: Restrict slots that have completed the approval process from further booking requests.
- Authentication: Secure user authentication using Firebase, with role-based access control.

## Style Guidelines:

- Primary color: A calm blue (#6699CC) to evoke trust and reliability in the booking process.
- Background color: Light, desaturated blue (#E6EEF2) to provide a gentle and unobtrusive backdrop.
- Accent color: A soft orange (#E6A919) for key actions like 'Submit' and 'Approve' to draw attention without being jarring.
- Body and headline font: 'Inter' sans-serif for a modern and neutral reading experience.
- Use clear, minimalist icons to represent hall types and booking status.
- Maintain a clean, grid-based layout to present slots and booking requests in an organized manner.
- Use subtle transitions and animations to confirm actions like submitting and approving requests.