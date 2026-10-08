"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";

export interface EventBoxProps {
    item?: any;
    data?: any;
    itemUrl?: string;
    postUrl?: string;
}

function parseJson<T>(raw: string | undefined, fallback: T): T {
    if (!raw) return fallback;
    try {
        return JSON.parse(raw) as T;
    } catch {
        return fallback;
    }
}

export default function EventBox2(props: EventBoxProps) {
    const item = props.item || props.data || {};
    const info = item.info || {};
    const targetUrl = props.itemUrl || props.postUrl || (item.slug ? `/${item.slug}` : "#");

    const images = parseJson<string[]>(info.images, []);
    const cover = images[0] || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=700&auto=format&fit=crop";

    const dates = parseJson<any>(info.event_dates, {});
    const venue = parseJson<any>(info.event_venue, {});
    const tickets = parseJson<any>(info.event_tickets, {});
    const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    let month = "TBD";
    let day = "--";

    if (dates.startDate && typeof dates.startDate === "string") {
        const parts = dates.startDate.split("T")[0].split("-");
        if (parts.length === 3) {
            const mIdx = parseInt(parts[1], 10) - 1;
            month = MONTHS[mIdx] || "TBD";
            day = String(parseInt(parts[2], 10));
        }
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200/80 p-4 hover:border-amber-400 hover:shadow-md transition duration-200 flex flex-col md:flex-row items-center gap-4 group">
            {/* Date Box */}
            <div className="w-full md:w-20 bg-amber-50 rounded-xl p-3 text-center border border-amber-200 shrink-0">
                <span className="block text-[11px] font-black text-amber-700 tracking-wider uppercase">{month}</span>
                <span className="block text-2xl font-black text-gray-900 leading-none mt-1">{day}</span>
            </div>

            {/* Thumbnail */}
            <div className="w-full md:w-32 h-20 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                <img src={cover} alt={item.title || "Event Thumbnail"} className="w-full h-full object-cover group-hover:scale-105 transition" />
            </div>

            {/* Middle info */}
            <div className="flex-1 space-y-1 w-full">
                <div className="flex items-center gap-2 text-[11px] text-gray-500 font-medium">
                    {dates.startTime && (
                        <span className="flex items-center gap-1 text-amber-600 font-bold">
                            <Icon icon="solar:clock-circle-bold" className="w-3.5 h-3.5" />
                            {dates.startTime}
                        </span>
                    )}
                    <span>•</span>
                    <span className="flex items-center gap-1">
                        <Icon icon="solar:map-point-bold" className="w-3.5 h-3.5" />
                        {venue.venueName || venue.city || (venue.eventType === "online" ? "Virtual Online" : "Main Venue")}
                    </span>
                </div>

                <h4 className="text-base font-bold text-gray-900 group-hover:text-amber-600 transition truncate">
                    <Link href={targetUrl}>{item.title || "Untitled Event"}</Link>
                </h4>

                {info.description && (
                    <p className="text-xs text-gray-500 line-clamp-1">
                        {info.description.replace(/<[^>]*>?/gm, "")}
                    </p>
                )}
            </div>

            {/* Right Action */}
            <div className="shrink-0 flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0">
                <div className="text-right">
                    <span className="text-[10px] text-gray-400 font-semibold block uppercase">Price</span>
                    <span className="text-sm font-black text-gray-900">
                        {tickets.ticketType === "free" ? "Free" : tickets.tiers?.[0]?.price ? `$${tickets.tiers[0].price}` : "RSVP"}
                    </span>
                </div>
                <Link
                    href={targetUrl}
                    className="px-4 py-2 rounded-lg bg-gray-900 text-white text-xs font-bold hover:bg-amber-600 transition"
                >
                    Get Tickets
                </Link>
            </div>
        </div>
    );
}
