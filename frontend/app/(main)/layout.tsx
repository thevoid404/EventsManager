import { Navbar } from '@/components/navbar';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#09090B]">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {children}
      </main>

      {/* Subtle Editorial Footer */}
      <footer className="w-full border-t border-white/5 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#8A8A93]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C8FF00]" />
            <span className="text-[#F4F4F0] font-bold">SEU // EVENTS</span>
            <span>—</span>
            <span>TACTICAL CAMPUS DISPATCH</span>
          </div>
          <div className="flex items-center gap-4 text-[10px] tracking-wider uppercase">
            <span>SOUTHEAST UNIVERSITY</span>
            <span>·</span>
            <span>ALL PROTOCOLS OPERATIONAL</span>
            <span>·</span>
            <span>2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
