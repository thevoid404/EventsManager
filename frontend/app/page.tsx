import { redirect } from 'next/navigation';

// Root URL redirects to /events (the real home).
export default function RootPage() {
  redirect('/events');
}
