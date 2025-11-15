'use client'

import { LoginForm } from '@/components/LoginForm';
import { NotificationSetup } from '@/components/NotificationSetup';

export default function OwnerDashboard() {
  return (
    <div>
      <h2>Owner Dashboard</h2>
      <LoginForm />
      <NotificationSetup />
    </div>
  );
}
