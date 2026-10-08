"use client";

import React, { useState } from "react";
import EventBox1 from "../box/Box-1";
import { Icon } from "@iconify/react";

export interface EventCategoryLayoutProps {
    data?: any;
    cat?: any;
    posts?: any[];
    items?: any[];
}

export default function EventCategoryLayout1(props: EventCategoryLayoutProps) {
    const cat = props.cat || props.data || {};
    const events = props.posts || props.items || [];

    const [filterType, setFilterType] = useState<string>("all");
    const [search, setSearch] = useState<string>("");

    const filtered = events.filter((item) => {
        const matchesSearch = item.title?.toLowerCase().includes(search.toLowerCase());
        if (!matchesSearch) return false;
        if (filterType === "all") return true;

        let info: any = {};
        try {
            info = item.info || {};
            const venue = typeof info.event_venue === "string" ? JSON.parse(info.event_venue) : info.event_venue || {};
            if (filterType === "online" && venue.eventType === "online") return true;
            if (filterType === "in_person" && venue.eventType === "in_person") return true;
        } catch {
            return false;
        }
        return false;
    });

    return (
        <div className="bg-slate-50 min-h-screen py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                {/* Header */}
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xs space-y-4">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-600">
                        <Icon icon="solar:calendar-date-bold" className="w-4 h-4" />
                        <span>Event Category</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black text-gray-950">
                        {cat.title || "Events & Experiences"}
                    </h1>
                    {cat.description && (
                        <p className="text-gray-500 text-sm max-w-2xl leading-relaxed">{cat.description}</p>
                    )}

                    {/* Filter bar */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                            {["all", "in_person", "online"].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilterType(f)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition ${
                                        filterType === f
                                            ? "bg-amber-500 text-gray-950 shadow-xs"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                                >
                                    {f.replace("_", " ")}
                                </button>
                            ))}
                        </div>

                        <div className="relative w-full sm:w-64">
                            <Icon icon="solar:magnifer-linear" className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search events..."
                                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-gray-200 text-xs outline-none focus:border-amber-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Events Grid */}
                {filtered.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center text-gray-400 border border-gray-100">
                        <Icon icon="solar:calendar-minimalistic-linear" className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm font-semibold">No events found in this category.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map((ev, i) => (
                            <EventBox1 key={ev._id || i} item={ev} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
