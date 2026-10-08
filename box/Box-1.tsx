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

export default function EventBox1(props: EventBoxProps) {
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

    const isOnline = venue.eventType === "online";
    const isHybrid = venue.eventType === "hybrid";

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group h-full">
            {/* Cover & Badges */}
            <div className="relative aspect-16/10 w-full overflow-hidden bg-gray-100">
                <img
                    src={cover}
                    alt={item.title || "Event Cover"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Date Badge Overlay */}
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md rounded-xl shadow-md px-2.5 py-1.5 text-center min-w-[50px] border border-gray-100">
                    <span className="block text-[10px] font-black tracking-wider text-amber-600">{month}</span>
                    <span className="block text-base font-black text-gray-900 leading-none mt-0.5">{day}</span>
                </div>

                {/* Format Tag */}
                <div className="absolute top-3 right-3 flex items-center gap-1">
                    {isOnline ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-sky-500/90 text-white backdrop-blur-xs shadow-xs flex items-center gap-1">
                            <Icon icon="solar:videocamera-record-bold" className="w-3 h-3" />
                            Online
                        </span>
                    ) : isHybrid ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-600/90 text-white backdrop-blur-xs shadow-xs flex items-center gap-1">
                            <Icon icon="solar:devices-bold" className="w-3 h-3" />
                            Hybrid
                        </span>
                    ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-900/80 text-white backdrop-blur-xs shadow-xs flex items-center gap-1">
                            <Icon icon="solar:map-point-bold" className="w-3 h-3" />
                            {venue.city || "In-Person"}
                        </span>
                    )}
                </div>
            </div>

            {/* Content Body */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                    {/* Time info */}
                    {dates.startTime && (
                        <div className="flex items-center gap-1.5 text-[11px] text-amber-600 font-bold uppercase tracking-wide">
                            <Icon icon="solar:clock-circle-bold" className="w-3.5 h-3.5" />
                            <span>{dates.startTime} {dates.timezone ? `(${dates.timezone})` : ""}</span>
                        </div>
                    )}

                    <h3 className="text-base font-extrabold text-gray-900 group-hover:text-amber-600 transition-colors line-clamp-2">
                        <Link href={targetUrl}>{item.title || "Untitled Event"}</Link>
                    </h3>

                    {info.description && (
                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                            {info.description.replace(/<[^>]*>?/gm, "")}
                        </p>
                    )}
                </div>

                {/* Bottom details & CTA */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div>
                        <span className="text-[10px] font-semibold text-gray-400 block uppercase">Admission</span>
                        <span className="text-xs font-black text-gray-900">
                            {tickets.ticketType === "free"
                                ? "Free"
                                : tickets.tiers?.[0]?.price
                                ? `$${tickets.tiers[0].price}`
                                : "Registration Req."}
                        </span>
                    </div>

                    <Link
                        href={targetUrl}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-50 text-amber-700 hover:bg-amber-500 hover:text-white transition"
                    >
                        <span>Details</span>
                        <Icon icon="solar:arrow-right-linear" className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
