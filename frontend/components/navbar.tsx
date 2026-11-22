'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Bell,
  Calendar,
  LogOut,
  Plus,
  Search,
  User,
  Shield,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/features/notifications/hooks/useNotifications';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CommandPalette } from '@/components/command-palette';
import { NotificationsTray } from '@/components/notifications-tray';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const { unreadCount } = useNotifications();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto rounded-xl bg-[#111114]/85 backdrop-blur-xl border border-white/10 px-4 h-14 flex items-center justify-between gap-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          {/* Left: Brand Mark */}
          <Link
            href="/events"
            className="flex items-center gap-2.5 shrink-0 group transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg bg-[#FF4D00] flex items-center justify-center text-white shadow-[0_0_15px_rgba(255,77,0,0.5)] group-hover:scale-105 transition-transform">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-black tracking-tight text-sm text-[#F4F4F0]">
                  SEU // EVENTS
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#C8FF00] animate-pulse" />
              </div>
              <span className="font-mono text-[9px] text-[#8A8A93] tracking-widest uppercase -mt-0.5">
                CAMPUS DISPATCH
              </span>
            </div>
          </Link>

          {/* Center: Live Command Palette Trigger */}
          <div className="hidden md:flex flex-1 max-w-sm justify-center">
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-lg bg-[#18181E] border border-white/10 text-xs text-[#8A8A93] hover:text-[#F4F4F0] hover:border-white/20 transition-all shadow-inner"
            >
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-[#FF4D00]" />
                <span className="font-sans">Search events, squads...</span>
              </div>
              <kbd className="font-mono text-[10px] text-[#8A8A93] px-1.5 py-0.5 rounded bg-black/40 border border-white/10">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right: Actions, Notifications & Profile */}
          <div className="flex items-center gap-2">
            {/* Mobile Search Button */}
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              aria-label="Open search palette"
              className="md:hidden w-8 h-8 rounded-lg border border-white/10 bg-[#18181E] flex items-center justify-center text-[#8A8A93] hover:text-[#F4F4F0]"
            >
              <Search className="w-4 h-4" />
            </button>

            {isAuthenticated ? (
              <>
                {/* Host Event CTA */}
                <Button
                  asChild
                  size="sm"
                  className="hidden sm:inline-flex h-8 px-3 font-mono text-xs uppercase tracking-wider bg-[#FF4D00] text-white hover:bg-[#FF4D00]/90 font-semibold gap-1.5 shadow-[0_0_15px_rgba(255,77,0,0.3)]"
                >
                  <Link href="/events/create">
                    <Plus className="w-3.5 h-3.5" />
                    Host Event
                  </Link>
                </Button>

                {/* Notifications Bell */}
                <button
                  type="button"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  aria-label="Notifications"
                  className="relative w-8 h-8 rounded-lg border border-white/10 bg-[#18181E] flex items-center justify-center text-[#8A8A93] hover:text-[#F4F4F0] hover:border-white/20 transition-colors"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-[#FF4D00] text-[9px] font-mono font-bold text-white shadow-[0_0_8px_#FF4D00]">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* User Dossier Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger
                    aria-label="User menu"
                    className="flex items-center gap-2 p-1 pl-1.5 rounded-lg border border-white/10 bg-[#18181E] hover:border-white/20 transition-colors focus:outline-none"
                  >
                    <Avatar className="h-6 w-6 rounded border border-white/10">
                      <AvatarFallback className="bg-[#FF4D00]/20 text-[#FF4D00] text-[10px] font-mono font-bold rounded">
                        {user?.name ? user.name.slice(0, 2).toUpperCase() : 'SEU'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline-block text-xs font-mono font-medium text-[#F4F4F0] max-w-[100px] truncate">
                      {user?.name?.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3 h-3 text-[#8A8A93]" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 p-1.5 bg-[#141418] border border-white/15 text-[#F4F4F0] shadow-2xl rounded-xl"
                  >
                    <div className="px-3 py-2 border-b border-white/10">
                      <p className="text-xs font-bold font-heading truncate text-[#F4F4F0]">
                        {user?.name}
                      </p>
                      <p className="text-[10px] font-mono text-[#8A8A93] truncate mt-0.5">
                        {user?.email}
                      </p>
                      <span className="inline-block mt-1 text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/5 text-[#C8FF00]">
                        {user?.department || 'Student'}
                      </span>
                    </div>

                    <div className="py-1">
                      <DropdownMenuItem asChild>
                        <Link
                          href="/profile"
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-mono hover:bg-white/5 rounded-lg cursor-pointer"
                        >
                          <User className="w-3.5 h-3.5 text-[#FF4D00]" />
                          Competitor Dossier
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild>
                        <Link
                          href="/events/create"
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-mono hover:bg-white/5 rounded-lg cursor-pointer sm:hidden"
                        >
                          <Plus className="w-3.5 h-3.5 text-[#C8FF00]" />
                          Host New Event
                        </Link>
                      </DropdownMenuItem>
                    </div>

                    <DropdownMenuSeparator className="bg-white/10 my-1" />

                    <DropdownMenuItem
                      onClick={logout}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-mono text-[#FF2E4C] hover:bg-[#FF2E4C]/10 rounded-lg cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs font-mono text-[#8A8A93] hover:text-[#F4F4F0] hover:bg-white/5"
                >
                  <Link href="/login">SIGN IN</Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="h-8 px-3 text-xs font-mono uppercase bg-[#FF4D00] text-white hover:bg-[#FF4D00]/90 font-semibold shadow-[0_0_15px_rgba(255,77,0,0.3)]"
                >
                  <Link href="/register">JOIN // FREE</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global Modals */}
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
      <NotificationsTray
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
    </>
  );
}
