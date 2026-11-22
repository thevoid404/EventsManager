'use client';

import React from 'react';
import { Calendar, Download } from 'lucide-react';
import { Event } from '@/types';
import { Button } from '@/components/ui/button';

interface CalendarExportProps {
  event: Event;
  className?: string;
}

export function CalendarExport({ event, className = '' }: CalendarExportProps) {
  const startDate = new Date(event.eventDate);
  // Default duration 3 hours
  const endDate = new Date(startDate.getTime() + 3 * 60 * 60 * 1000);

  const formatDateForGCal = (date: Date) => {
    return date.toISOString().replace(/-|:|\.\d\d\d/g, '');
  };

  const handleGoogleCalendar = () => {
    const startStr = formatDateForGCal(startDate);
    const endStr = formatDateForGCal(endDate);
    const details = encodeURIComponent(
      `${event.description}\n\nCategory: ${event.category.toUpperCase()} // Type: ${event.eventType.toUpperCase()}\nSEU Events Platform`
    );
    const title = encodeURIComponent(`SEU // ${event.title}`);
    const location = encodeURIComponent(
      event.eventType === 'online' ? 'Online / Remote' : 'Southeast University Campus, Tejgaon, Dhaka'
    );

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startStr}/${endStr}&details=${details}&location=${location}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleDownloadICS = () => {
    const startStr = formatDateForGCal(startDate);
    const endStr = formatDateForGCal(endDate);
    const nowStr = formatDateForGCal(new Date());

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Southeast University//SEU Events//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${event.id}@seu-events.edu.bd`,
      `DTSTAMP:${nowStr}`,
      `DTSTART:${startStr}`,
      `DTEND:${endStr}`,
      `SUMMARY:SEU // ${event.title}`,
      `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
      `LOCATION:${event.eventType === 'online' ? 'Online' : 'Southeast University Campus'}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${event.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleGoogleCalendar}
        className="h-8 text-xs font-mono border-white/10 hover:border-white/20 bg-[#111114] text-[#F4F4F0] gap-1.5 flex-1"
      >
        <Calendar className="w-3.5 h-3.5 text-[#FF4D00]" />
        Google Cal
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleDownloadICS}
        className="h-8 text-xs font-mono border-white/10 hover:border-white/20 bg-[#111114] text-[#F4F4F0] gap-1.5 flex-1"
      >
        <Download className="w-3.5 h-3.5 text-[#C8FF00]" />
        .ICS File
      </Button>
    </div>
  );
}
