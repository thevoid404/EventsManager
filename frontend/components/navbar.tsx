'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
import { Bell, CalendarDays, LogOut, Plus, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const NAV_LINKS = [{ href: '/events', label: 'Events' }];

function NotificationBadge() {
  const { isAuthenticated } = useAuth();
  // Using dynamic import or just standard hook since Navbar is a Client Component
  // We'll conditionally fetch if authenticated inside the hook or just conditionally render it
  const { unreadCount } = useNotifications();

  if (!isAuthenticated || !unreadCount || unreadCount === 0) return null;

  return (
    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
      {unreadCount > 9 ? '9+' : unreadCount}
    </span>
  );
}

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      {/* Top subtle glow bar */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-6 justify-between">
        {/* Logo */}
        <Link
          href="/events"
          className="flex items-center gap-2 font-bold text-sm shrink-0 tracking-tight text-foreground hover:opacity-85 transition-opacity"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <CalendarDays className="h-4 w-4" />
          </div>
          <span className="bg-gradient-to-r from-foreground via-foreground/90 to-primary/80 bg-clip-text text-transparent">
            SEU Events
          </span>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-1 relative">
          {NAV_LINKS.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative text-sm px-3 py-1.5 rounded-md transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  isActive
                    ? 'text-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeNav"
                    className="absolute inset-0 bg-accent rounded-md -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-1.5">
          {isAuthenticated ? (
            <>
              {/* Create Event */}
              <Button asChild variant="ghost" size="sm" className="gap-1.5 h-8 text-sm hidden sm:inline-flex">
                <Link href="/events/create">
                  <Plus className="h-3.5 w-3.5" />
                  Create Event
                </Link>
              </Button>

              {/* Notifications */}
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="h-8 w-8 relative"
                aria-label="Notifications"
              >
                <Link href="/notifications">
                  <Bell className="h-4 w-4" />
                  <NotificationBadge />
                </Link>
              </Button>

              {/* Profile dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="h-8 w-8 rounded-full hover:bg-accent flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="Open profile menu"
                >
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="text-[11px] font-medium bg-primary text-primary-foreground">
                      {user?.name
                        ? user.name.slice(0, 2).toUpperCase()
                        : 'U'}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-2">
                    <p className="text-sm font-medium leading-none truncate">
                      {user?.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {user?.department}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  {/* Mobile only: Create Event */}
                  <DropdownMenuItem asChild className="sm:hidden">
                    <Link href="/events/create">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Event
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-destructive focus:text-destructive"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="h-8 text-sm">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild size="sm" className="h-8 text-sm">
                <Link href="/register">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
