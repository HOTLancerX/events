"use client";

import React from "react";
import EventBox2 from "../box/Box-2";
import { Icon } from "@iconify/react";

export interface EventCategoryLayoutProps {
    data?: any;
    cat?: any;
    posts?: any[];
    items?: any[];
}

export default function EventCategoryLayout2(props: EventCategoryLayoutProps) {
    const cat = props.cat || props.data || {};
    const events = props.posts || props.items || [];

    return (
        <div className="bg-white min-h-screen py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
                {/* Header */}
                <div className="space-y-2 border-b border-gray-100 pb-6">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 uppercase tracking-wide">
                        <Icon icon="solar:calendar-date-bold" className="w-4 h-4" />
                        <span>Schedule Timeline</span>
                    </div>
                    <h1 className="text-3xl font-black text-gray-900">{cat.title || "Upcoming Events Schedule"}</h1>
                    {cat.description && <p className="text-sm text-gray-500 leading-relaxed">{cat.description}</p>}
                </div>

                {/* Event rows */}
                <div className="space-y-4">
                    {events.map((ev, i) => (
                        <EventBox2 key={ev._id || i} item={ev} />
                    ))}
                </div>
            </div>
        </div>
    );
}
