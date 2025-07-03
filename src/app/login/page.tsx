import { LoginForm } from '@/components/auth/login-form';
import { Building2 } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          <Building2 className="h-12 w-12 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight mt-4">
            ClubHub Central
          </h1>
          <p className="text-muted-foreground mt-2">
            Sign in to access your dashboard
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
