import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Calendar } from 'lucide-react';
import { AuthShowcase } from '@/features/auth/components/auth-showcase';

export const metadata: Metadata = {
  title: 'Authentication // SEU Events',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex w-full bg-[#09090B] text-[#F4F4F0] overflow-x-hidden">
      {/* Left Pane (Desktop Showcase) */}
      <AuthShowcase />

      {/* Right Pane (Auth Forms) */}
      <div className="relative flex-1 flex flex-col justify-between p-6 sm:p-12 overflow-y-auto">
        {/* Top Header / Back Link */}
        <div className="flex items-center justify-between w-full max-w-md mx-auto">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-xs font-mono text-[#8A8A93] hover:text-[#FF4D00] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            RETURN TO CAMPUS DISPATCH
          </Link>

          <div className="lg:hidden flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#FF4D00] flex items-center justify-center text-white text-xs font-bold font-mono">
              SEU
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="my-auto py-8 w-full flex justify-center">
          {children}
        </div>

        {/* Footer */}
        <div className="w-full max-w-md mx-auto text-center text-[10px] font-mono text-[#8A8A93] border-t border-white/5 pt-4">
          <span>SECURED UNIVERSITY GATEWAY // @SEU.EDU.BD</span>
        </div>
      </div>
    </div>
  );
}
