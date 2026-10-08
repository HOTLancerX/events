"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";

export default function EventFooter() {
    return (
        <footer className="bg-gray-950 text-white border-t border-white/10 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2.5 font-black text-lg">
                        <div className="w-8 h-8 rounded-lg bg-amber-500 text-gray-950 flex items-center justify-center font-black">
                            <Icon icon="solar:calendar-date-bold" className="w-5 h-5" />
                        </div>
                        <span>EventPulse Platform</span>
                    </div>

                    <div className="flex items-center gap-6 text-xs text-gray-400 font-semibold">
                        <Link href="/privacy" className="hover:text-amber-400 transition">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-amber-400 transition">Terms of Service</Link>
                        <Link href="/contactus" className="hover:text-amber-400 transition">Contact Organizer</Link>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-6 text-center text-xs text-gray-500">
                    &copy; {new Date().getFullYear()} Events Management System. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
