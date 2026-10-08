"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";

export default function UserEventPostForm() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [venueName, setVenueName] = useState("");
    const [ticketPrice, setTicketPrice] = useState("0");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Event submitted for admin review!");
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
            <div>
                <h2 className="text-xl font-bold text-gray-900">Submit New Event</h2>
                <p className="text-xs text-gray-500">Submit an event listing for moderator approval.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-4 text-xs">
                <div>
                    <label className="font-bold text-gray-700 block mb-1">Event Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Next.js Developers Meetup"
                        required
                        className="w-full p-2.5 rounded-lg border border-gray-200 outline-none focus:border-amber-500"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="font-bold text-gray-700 block mb-1">Date</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                            className="w-full p-2.5 rounded-lg border border-gray-200 outline-none focus:border-amber-500"
                        />
                    </div>
                    <div>
                        <label className="font-bold text-gray-700 block mb-1">Venue / Platform</label>
                        <input
                            type="text"
                            value={venueName}
                            onChange={(e) => setVenueName(e.target.value)}
                            placeholder="e.g. Online (Zoom) or Convention Hall"
                            required
                            className="w-full p-2.5 rounded-lg border border-gray-200 outline-none focus:border-amber-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="font-bold text-gray-700 block mb-1">Description & Agenda</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        placeholder="Detail the event schedule, target audience, and highlights..."
                        className="w-full p-2.5 rounded-lg border border-gray-200 outline-none focus:border-amber-500"
                    />
                </div>

                <div>
                    <label className="font-bold text-gray-700 block mb-1">Ticket Price ($) (0 for Free)</label>
                    <input
                        type="number"
                        value={ticketPrice}
                        onChange={(e) => setTicketPrice(e.target.value)}
                        className="w-40 p-2.5 rounded-lg border border-gray-200 outline-none focus:border-amber-500"
                    />
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center gap-3">
                    <button
                        type="submit"
                        className="px-5 py-2.5 bg-amber-500 text-gray-950 rounded-xl font-bold hover:bg-amber-400 transition"
                    >
                        Submit Event
                    </button>
                </div>
            </div>
        </form>
    );
}
