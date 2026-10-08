"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";

export default function UserEventPostList() {
    const [events] = useState([
        {
            id: "ev-1",
            title: "Global Tech AI & Web3 Summit 2026",
            startDate: "2026-11-15",
            status: "Published",
            attendees: 142,
        },
        {
            id: "ev-2",
            title: "Modern Fullstack Workshop",
            startDate: "2026-12-05",
            status: "Pending Review",
            attendees: 38,
        },
    ]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">My Submitted Events</h2>
                    <p className="text-xs text-gray-500">Manage and track your published event listings and attendees.</p>
                </div>
                <Link
                    href="/account/events/submit"
                    className="px-4 py-2 bg-amber-500 text-gray-950 rounded-xl text-xs font-bold hover:bg-amber-400 transition flex items-center gap-1.5"
                >
                    <Icon icon="solar:add-circle-bold" className="w-4 h-4" />
                    Create New Event
                </Link>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs text-gray-600">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-700 font-bold uppercase tracking-wider text-[10px]">
                        <tr>
                            <th className="p-3.5">Event Title</th>
                            <th className="p-3.5">Start Date</th>
                            <th className="p-3.5">Status</th>
                            <th className="p-3.5">Bookings</th>
                            <th className="p-3.5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium">
                        {events.map((ev) => (
                            <tr key={ev.id} className="hover:bg-gray-50/50">
                                <td className="p-3.5 font-bold text-gray-900">{ev.title}</td>
                                <td className="p-3.5">{ev.startDate}</td>
                                <td className="p-3.5">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                        ev.status === "Published" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                                    }`}>
                                        {ev.status}
                                    </span>
                                </td>
                                <td className="p-3.5 font-bold text-gray-900">{ev.attendees}</td>
                                <td className="p-3.5 text-right">
                                    <Link href={`/account/events/submit?id=${ev.id}`} className="text-amber-600 hover:underline font-bold">
                                        Edit
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
