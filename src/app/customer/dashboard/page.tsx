'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function CustomerDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadUser() {
      try {
        const { data } = await supabase.auth.getUser();
        if (!mounted) return;
        if (!data || !data.user) {
          router.push('/customer/login');
          return;
        }
        setUser(data.user);
      } catch (err) {
        console.error('failed to get user', err);
        router.push('/customer/login');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadUser();
    return () => {
      mounted = false;
    };
  }, [router]);

  if (loading) return <div>Loading...</div>;

  return (
    <main>
      <h1>Welcome, {user?.email ?? 'Customer'}</h1>
      <Link href="/customer/bookings">Your Bookings</Link>
    </main>
  );
}
