"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";

export interface EventLayoutProps {
    data?: any;
    post?: any;
}

function parseJson<T>(raw: string | undefined | null, fallback: T): T {
    if (!raw) return fallback;
    try {
        return typeof raw === "string" ? (JSON.parse(raw) as T) : (raw as T);
    } catch {
        return fallback;
    }
}

export default function EventLayout2(props: EventLayoutProps) {
    const post = props.post || props.data || {};
    const info = post.info || {};

    const dates = parseJson<any>(info.event_dates, {});
    const venue = parseJson<any>(info.event_venue, {});
    const tickets = parseJson<any>(info.event_tickets, {});
    const speakers = parseJson<any[]>(info.event_speakers, []);
    const schedule = parseJson<any[]>(info.event_schedule, []);
    const social = parseJson<any[]>(info.event_social, []);
    const images = parseJson<string[]>(info.images, []);
    const banner = images[0] || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1400&auto=format&fit=crop";
    const galleryImages = images.slice(1);

    const [activeDayTab, setActiveDayTab] = useState(0);

    const startDateObj = dates.startDate ? new Date(dates.startDate) : null;
    const formattedDate = startDateObj && !isNaN(startDateObj.getTime())
        ? startDateObj.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
        : null;

    const fullAddress = [venue.venueName, venue.address, venue.city, venue.state, venue.country]
        .filter(Boolean)
        .join(", ");

    const hasVenueData = Boolean(fullAddress || venue.joinUrl || venue.onlinePlatform || venue.mapUrl);
    const hasSpeakers = Array.isArray(speakers) && speakers.length > 0 && speakers.some((s) => s.name);
    const hasSchedule = Array.isArray(schedule) && schedule.length > 0 && schedule.some((d) => d.sessions?.length > 0);
    const hasDescription = Boolean(info.description && info.description.replace(/<[^>]*>?/gm, "").trim().length > 0);
    const hasTiers = Array.isArray(tickets.tiers) && tickets.tiers.length > 0;
    const hasSocial = Array.isArray(social) && social.length > 0 && social.some((s) => s.url);

    return (
        <div className="bg-white min-h-screen text-slate-900 font-sans pb-24">
            {/* ─── Editorial Header ─── */}
            <div className="container space-y-6">
                <div className="flex flex-wrap items-center gap-2">
                    {venue.eventType && (
                        <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-orange-100 text-orange-800">
                            {venue.eventType === "online" ? "Virtual Live" : venue.eventType === "hybrid" ? "Hybrid Experience" : "In-Person"}
                        </span>
                    )}

                    {info.event_status && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 uppercase">
                            {info.event_status.replace("_", " ")}
                        </span>
                    )}

                    {formattedDate && (
                        <span className="text-xs font-bold text-slate-500 ml-1">
                            {formattedDate} {dates.startTime ? `at ${dates.startTime}` : ""}
                        </span>
                    )}
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 leading-[1.1]">
                    {post.title || "Untitled Event"}
                </h1>

                {/* Banner Media Showcase */}
                <div className="rounded-3xl overflow-hidden aspect-21/9 bg-slate-100 shadow-md border border-slate-200">
                    <img src={banner} alt={post.title} className="w-full h-full object-cover" />
                </div>
            </div>

            {/* ─── Content Grid ─── */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-10 pt-4">
                {/* ── Main Details Column ── */}
                <div className="lg:col-span-2 space-y-10">
                    {/* Description */}
                    {hasDescription && (
                        <div className="space-y-4">
                            <h2 className="text-2xl font-black text-slate-950 tracking-tight pb-3 border-b border-slate-100">
                                Overview & Details
                            </h2>
                            <div
                                className="prose prose-slate prose-base max-w-none text-slate-600 leading-relaxed font-normal"
                                dangerouslySetInnerHTML={{ __html: info.description }}
                            />
                        </div>
                    )}

                    {/* Schedule / Agenda Timeline */}
                    {hasSchedule && (
                        <div className="space-y-6 pt-4 border-t border-slate-100">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <h2 className="text-2xl font-black text-slate-950 tracking-tight">Event Schedule</h2>
                                {schedule.length > 1 && (
                                    <div className="flex gap-1.5 bg-slate-100 p-1 rounded-2xl">
                                        {schedule.map((day, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => setActiveDayTab(idx)}
                                                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                                                    activeDayTab === idx ? "bg-slate-900 text-white" : "text-slate-600 hover:text-slate-900"
                                                }`}
                                            >
                                                {day.dayTitle || `Day ${idx + 1}`}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="divide-y divide-slate-100 border-y border-slate-100">
                                {schedule[activeDayTab]?.sessions?.map((ses: any, sIdx: number) => (
                                    <div key={ses.id || sIdx} className="py-4.5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
                                        <div className="w-44 shrink-0">
                                            <span className="text-xs font-black text-orange-600 uppercase tracking-wide block">{ses.time}</span>
                                            {ses.room && <span className="text-[11px] text-slate-400 font-semibold">{ses.room}</span>}
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <h4 className="text-base font-extrabold text-slate-900">{ses.title}</h4>
                                            {ses.description && <p className="text-xs text-slate-500">{ses.description}</p>}
                                            {ses.speaker && (
                                                <p className="text-xs text-slate-700 font-bold flex items-center gap-1.5 pt-0.5">
                                                    <Icon icon="solar:user-bold" className="w-3.5 h-3.5 text-orange-500" />
                                                    {ses.speaker}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Speakers Roster */}
                    {hasSpeakers && (
                        <div className="space-y-6 pt-4 border-t border-slate-100">
                            <h2 className="text-2xl font-black text-slate-950 tracking-tight">Speakers & Guests</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {speakers.map((spk, idx) => (
                                    <div key={spk.id || idx} className="p-4 rounded-3xl bg-slate-50 text-center border border-slate-100 space-y-2 hover:bg-slate-100/80 transition">
                                        <div className="w-20 h-20 mx-auto rounded-full overflow-hidden bg-slate-200 border-2 border-white shadow-xs">
                                            <img
                                                src={spk.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop"}
                                                alt={spk.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-extrabold text-slate-900">{spk.name}</h4>
                                            <p className="text-xs font-bold text-orange-600">{spk.role}</p>
                                            {spk.company && <p className="text-[10px] text-slate-400 font-medium">{spk.company}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Venue Location Details */}
                    {hasVenueData && (
                        <div className="space-y-4 pt-4 border-t border-slate-100">
                            <h2 className="text-2xl font-black text-slate-950 tracking-tight">Venue & Location</h2>
                            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 space-y-3">
                                {venue.venueName && <h3 className="text-lg font-bold text-slate-900">{venue.venueName}</h3>}
                                {fullAddress && (
                                    <p className="text-xs text-slate-600 flex items-start gap-2">
                                        <Icon icon="solar:map-point-bold" className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                                        <span>{fullAddress}</span>
                                    </p>
                                )}
                                {venue.mapUrl && (
                                    <a
                                        href={venue.mapUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 transition pt-1"
                                    >
                                        <span>View Map Coordinates</span>
                                        <Icon icon="solar:arrow-right-linear" className="w-3.5 h-3.5" />
                                    </a>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Media Gallery */}
                    {galleryImages.length > 0 && (
                        <div className="space-y-4 pt-4 border-t border-slate-100">
                            <h2 className="text-2xl font-black text-slate-950 tracking-tight">Gallery</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {galleryImages.map((img, i) => (
                                    <div key={i} className="rounded-2xl overflow-hidden aspect-4/3 bg-slate-100">
                                        <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Sidebar Column ── */}
                <div className="space-y-6">
                    <div className="p-7 rounded-3xl bg-slate-950 text-white space-y-6 sticky top-6 shadow-xl border border-slate-800">
                        <div className="space-y-1 pb-4 border-b border-white/10">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Access Pass</span>
                            <div className="text-3xl font-black text-white">
                                {tickets.ticketType === "free" ? "Free Admission" : tickets.tiers?.[0]?.price ? `$${tickets.tiers[0].price}` : "Register"}
                            </div>
                        </div>

                        {/* Event Quick Info */}
                        <div className="space-y-3 text-xs text-slate-300">
                            {formattedDate && (
                                <div className="flex items-center gap-2.5">
                                    <Icon icon="solar:calendar-bold" className="w-4 h-4 text-orange-400 shrink-0" />
                                    <span>{formattedDate}</span>
                                </div>
                            )}
                            {dates.startTime && (
                                <div className="flex items-center gap-2.5">
                                    <Icon icon="solar:clock-circle-bold" className="w-4 h-4 text-orange-400 shrink-0" />
                                    <span>{dates.startTime} {dates.timezone ? `(${dates.timezone})` : ""}</span>
                                </div>
                            )}
                            {hasVenueData && (
                                <div className="flex items-center gap-2.5">
                                    <Icon icon="solar:map-point-bold" className="w-4 h-4 text-orange-400 shrink-0" />
                                    <span className="truncate">{venue.venueName || venue.city || "Online Live Stream"}</span>
                                </div>
                            )}
                        </div>

                        {/* Ticket Tiers */}
                        {hasTiers && (
                            <div className="space-y-2 pt-2 border-t border-white/10">
                                {tickets.tiers.map((t: any, i: number) => (
                                    <div key={i} className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                                        <span className="font-bold text-white">{t.name}</span>
                                        <span className="font-black text-orange-400">${t.price}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <a
                            href={tickets.registrationUrl || "#"}
                            target={tickets.registrationUrl ? "_blank" : "_self"}
                            rel="noreferrer"
                            className="block w-full py-4 text-center rounded-2xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg transition"
                        >
                            {tickets.buttonLabel || "Book Tickets / RSVP"}
                        </a>

                        {hasSocial && (
                            <div className="pt-3 border-t border-white/10 flex flex-wrap gap-2">
                                {social.map((s, i) => (
                                    <a
                                        key={i}
                                        href={s.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-bold text-slate-300 transition"
                                    >
                                        {s.platform}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
