"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";

export interface EventHeaderProps {
    menus?: any;
    data?: any;
}

export default function EventHeader(props: EventHeaderProps) {
    return (
        <header className="sticky top-0 z-50 bg-gray-950/95 backdrop-blur-md border-b border-white/10 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2.5 font-black text-lg tracking-tight">
                    <div className="w-8 h-8 rounded-lg bg-amber-500 text-gray-950 flex items-center justify-center font-black">
                        <Icon icon="solar:calendar-date-bold" className="w-5 h-5" />
                    </div>
                    <span>EventPulse</span>
                </Link>

                <nav className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-gray-300">
                    <Link href="/" className="hover:text-amber-400 transition">Home</Link>
                    <Link href="/events" className="hover:text-amber-400 transition">All Events</Link>
                    <Link href="/schedule" className="hover:text-amber-400 transition">Schedule</Link>
                    <Link href="/speakers" className="hover:text-amber-400 transition">Speakers</Link>
                </nav>

                <div className="flex items-center gap-3">
                    <Link
                        href="/events"
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-gray-950 font-black text-xs uppercase tracking-wide transition shadow-sm"
                    >
                        Browse Events
                    </Link>
                </div>
            </div>
        </header>
    );
}
