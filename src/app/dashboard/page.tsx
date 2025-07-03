'use client';
import { AppLayout } from '@/components/layout/app-layout';
import { AuthGuard } from '@/components/layout/auth-guard';
import { useAuth } from '@/hooks/use-auth';
import { PageHeader } from '@/components/shared/page-header';
import { BookingList } from '@/components/dashboard/booking-list';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

function DashboardContent() {
  const { user } = useAuth();
  
  if (!user) return null;

  const getTitle = () => {
    switch(user.role) {
      case 'Club Lead': return 'My Booking Requests';
      case 'HOD': return 'Pending HOD Approvals';
      case 'Principal': return 'Pending Principal Approvals';
      default: return 'Dashboard';
    }
  }

  const getSubtitle = () => {
    switch(user.role) {
      case 'Club Lead': return 'Track the status of your hall booking requests.';
      case 'HOD': return 'Review and approve or reject requests from club leads.';
      case 'Principal': return 'Review and provide final approval for booking requests.';
      default: return 'Welcome to ClubHub Central';
    }
  }

  return (
    <>
      <PageHeader
        title={getTitle()}
        subtitle={getSubtitle()}
      >
        {user.role === 'Club Lead' && (
           <Link href="/book-slot" passHref>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Booking Request
            </Button>
          </Link>
        )}
      </PageHeader>
      <div className="mt-6">
        <BookingList />
      </div>
    </>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <AppLayout>
        <DashboardContent />
      </AppLayout>
    </AuthGuard>
  );
}
