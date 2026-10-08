"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { xFetch } from "@/lib/express";

export interface EventPostOption {
    _id: string;
    title: string;
    slug?: string;
}

export default function EventPostSelector({
    value = "",
    onChange,
}: {
    value?: string;
    onChange: (v: string) => void;
}) {
    const [events, setEvents] = useState<EventPostOption[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        xFetch("/builder-post/posts?type=event&limit=50")
            .then((r) => r.json())
            .then((data) => {
                setEvents(data.posts ?? []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex items-center gap-2 text-xs text-gray-400 py-1.5">
                <Icon icon="svg-spinners:ring-resize" width={14} className="animate-spin text-amber-500" />
                <span>Loading events...</span>
            </div>
        );
    }

    return (
        <div className="space-y-1">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-white rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-800 outline-none focus:border-amber-500 transition shadow-2xs"
            >
                <option value="">— Latest Published Event (Default) —</option>
                {events.map((ev) => (
                    <option key={ev._id} value={ev._id}>
                        {ev.title || "Untitled Event"}
                    </option>
                ))}
            </select>
        </div>
    );
}
