import type { Metadata } from 'next';
import Link from 'next/link';
import { CalendarDays } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Authentication',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-12">
      {/* Logo */}
      <Link
        href="/events"
        className="flex items-center gap-2 mb-8 text-foreground hover:opacity-80 transition-opacity"
      >
        <CalendarDays className="h-5 w-5" />
        <span className="font-semibold text-base">SEU Events</span>
      </Link>

      {children}
    </div>
  );
}
