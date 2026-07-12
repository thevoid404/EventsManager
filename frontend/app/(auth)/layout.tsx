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
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-background px-4 py-12 overflow-hidden">
      {/* Decorative background grid pattern and blobs */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(99,102,241,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(99,102,241,0.02)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[350px] h-[350px] rounded-full bg-violet-500/10 blur-[100px] pointer-events-none" />

      {/* Logo */}
      <Link
        href="/events"
        className="relative z-10 flex items-center gap-2 mb-8 text-foreground hover:opacity-85 transition-opacity"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-md shadow-primary/10">
          <CalendarDays className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-foreground to-primary/80 bg-clip-text text-transparent">
          SEU Events
        </span>
      </Link>

      <div className="relative z-10 w-full flex justify-center">
        {children}
      </div>
    </div>
  );
}
