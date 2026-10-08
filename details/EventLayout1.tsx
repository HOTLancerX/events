"use client";

import React, { useState, useEffect, useMemo } from "react";
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

export default function EventLayout1(props: EventLayoutProps) {
    const post = props.post || props.data || {};
    const info = post.info || {};

    const dates = parseJson<any>(info.event_dates, {});
    const venue = parseJson<any>(info.event_venue, {});
    const tickets = parseJson<any>(info.event_tickets, {});
    const speakers = parseJson<any[]>(info.event_speakers, []);
    const schedule = parseJson<any[]>(info.event_schedule, []);
    const social = parseJson<any[]>(info.event_social, []);
    const images = parseJson<string[]>(info.images, []);
    const banner = images[0] || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1400&auto=format&fit=crop";
    const galleryImages = images.slice(1);

    const [activeDayTab, setActiveDayTab] = useState(0);
    const [selectedTier, setSelectedTier] = useState<number>(0);
    const [calendarOpen, setCalendarOpen] = useState(false);

    // Live Countdown Timer
    const targetDateStr = dates.startDate ? `${dates.startDate}T${dates.startTime || "09:00"}:00` : null;
    const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

    useEffect(() => {
        if (!targetDateStr || dates.countdownEnabled === false) return;
        const target = new Date(targetDateStr).getTime();
        if (isNaN(target)) return;

        const updateTimer = () => {
            const now = new Date().getTime();
            const diff = target - now;
            if (diff > 0) {
                setTimeLeft({
                    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((diff / 1000 / 60) % 60),
                    seconds: Math.floor((diff / 1000) % 60),
                });
            } else {
                setTimeLeft(null);
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [targetDateStr, dates.countdownEnabled]);

    // Format Dates
    const startDateObj = dates.startDate ? new Date(dates.startDate) : null;
    const endDateObj = dates.endDate ? new Date(dates.endDate) : null;

    const formattedStartDate = startDateObj && !isNaN(startDateObj.getTime())
        ? startDateObj.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })
        : null;

    const formattedEndDate = endDateObj && !isNaN(endDateObj.getTime())
        ? endDateObj.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })
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

    // Google Calendar & ICS links
    const calendarLinks = useMemo(() => {
        if (!startDateObj || isNaN(startDateObj.getTime())) return null;
        const title = encodeURIComponent(post.title || "Event");
        const details = encodeURIComponent(info.description?.replace(/<[^>]*>?/gm, "") || "");
        const loc = encodeURIComponent(fullAddress || venue.joinUrl || "");

        const startIso = startDateObj.toISOString().replace(/-|:|\.\d\d\d/g, "");
        const endIso = endDateObj && !isNaN(endDateObj.getTime())
            ? endDateObj.toISOString().replace(/-|:|\.\d\d\d/g, "")
            : startIso;

        return {
            google: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${loc}`,
            ics: `data:text/calendar;charset=utf8,BEGIN:VCALENDAR%0AVERSION:2.0%0ABEGIN:VEVENT%0ASUMMARY:${title}%0ADESCRIPTION:${details}%0ALOCATION:${loc}%0AEND:VEVENT%0AEND:VCALENDAR`,
        };
    }, [startDateObj, endDateObj, post.title, info.description, fullAddress, venue.joinUrl]);

    return (
        <div className="bg-slate-50 min-h-screen pb-24 text-slate-900 font-sans">
            {/* ─── Hero Section ─── */}
            <div className="relative bg-slate-950 text-white overflow-hidden pt-12 pb-24 md:pt-16 md:pb-32">
                {/* Background Image with Blur & Dark Gradients */}
                <div className="absolute inset-0 opacity-30 mix-blend-luminosity">
                    <img src={banner} alt={post.title || "Event Banner"} className="w-full h-full object-cover blur-sm scale-105" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/90 to-slate-950" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(245,158,11,0.15),transparent_60%)]" />

                <div className="relative container space-y-6">
                    {/* Top Badges & Tags */}
                    <div className="flex flex-wrap items-center gap-2.5">
                        {venue.eventType && (
                            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500 text-slate-950 shadow-sm">
                                <Icon
                                    icon={
                                        venue.eventType === "online"
                                            ? "solar:videocamera-record-bold"
                                            : venue.eventType === "hybrid"
                                            ? "solar:devices-bold"
                                            : "solar:buildings-bold"
                                    }
                                    className="w-3.5 h-3.5"
                                />
                                {venue.eventType === "online" ? "Virtual Live Stream" : venue.eventType === "hybrid" ? "Hybrid Experience" : "In-Person Event"}
                            </span>
                        )}

                        {info.event_status && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-white backdrop-blur-md border border-white/15 uppercase tracking-wide">
                                <span className={`w-2 h-2 rounded-full ${info.event_status === "sold_out" ? "bg-red-400" : "bg-emerald-400 animate-pulse"}`} />
                                {info.event_status.replace("_", " ")}
                            </span>
                        )}

                        {post.category?.title && (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 text-slate-300 border border-white/10">
                                {post.category.title}
                            </span>
                        )}
                    </div>

                    {/* Main Title */}
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white max-w-4xl leading-[1.15]">
                        {post.title || "Untitled Event"}
                    </h1>

                    {/* Metadata Strip */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-6 border-t border-white/10">
                        {formattedStartDate && (
                            <div className="flex items-center gap-3.5 bg-white/5 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
                                <div className="w-11 h-11 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30 shadow-inner">
                                    <Icon icon="solar:calendar-date-bold" className="w-6 h-6" />
                                </div>
                                <div className="min-w-0">
                                    <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Date</span>
                                    <span className="font-bold text-white text-sm truncate block">
                                        {formattedStartDate} {formattedEndDate && formattedEndDate !== formattedStartDate ? `— ${formattedEndDate}` : ""}
                                    </span>
                                </div>
                            </div>
                        )}

                        {dates.startTime && (
                            <div className="flex items-center gap-3.5 bg-white/5 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
                                <div className="w-11 h-11 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30 shadow-inner">
                                    <Icon icon="solar:clock-circle-bold" className="w-6 h-6" />
                                </div>
                                <div className="min-w-0">
                                    <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Schedule Time</span>
                                    <span className="font-bold text-white text-sm truncate block">
                                        {dates.startTime} {dates.endTime ? `to ${dates.endTime}` : ""} {dates.timezone ? `(${dates.timezone})` : ""}
                                    </span>
                                </div>
                            </div>
                        )}

                        {hasVenueData && (
                            <div className="flex items-center gap-3.5 bg-white/5 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 sm:col-span-2 lg:col-span-1">
                                <div className="w-11 h-11 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30 shadow-inner">
                                    <Icon icon="solar:map-point-bold" className="w-6 h-6" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Location / Venue</span>
                                    <span className="font-bold text-white text-sm truncate block" title={fullAddress || venue.onlinePlatform}>
                                        {venue.venueName || venue.city || (venue.eventType === "online" ? `Virtual (${venue.onlinePlatform || "Live Stream"})` : "Main Venue")}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ─── Live Countdown Bar (Only if enabled and future) ─── */}
            {timeLeft && (
                <div className="container -mt-12 relative z-20">
                    <div className="bg-linear-to-r from-slate-900 via-slate-950 to-slate-900 text-white rounded-3xl p-5 sm:p-6 border border-amber-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="space-y-1 text-center md:text-left">
                            <div className="inline-flex items-center gap-2 text-amber-400 font-black text-xs uppercase tracking-wider">
                                <Icon icon="solar:flame-bold" className="w-4 h-4" />
                                Event Starts In
                            </div>
                            <h3 className="text-lg font-bold text-white">Save the Date & Secure Your Spot</h3>
                        </div>

                        {/* Countdown Digits */}
                        <div className="grid grid-cols-4 gap-2.5 sm:gap-4 w-full md:w-auto">
                            {[
                                { label: "Days", val: timeLeft.days },
                                { label: "Hours", val: timeLeft.hours },
                                { label: "Minutes", val: timeLeft.minutes },
                                { label: "Seconds", val: timeLeft.seconds },
                            ].map((item, i) => (
                                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl px-3 py-2.5 sm:px-5 sm:py-3 text-center min-w-[65px] sm:min-w-[80px]">
                                    <span className="block text-xl sm:text-3xl font-black text-amber-400 leading-none">
                                        {String(item.val).padStart(2, "0")}
                                    </span>
                                    <span className="block text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase mt-1">
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Calendar Dropdown */}
                        {calendarLinks && (
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setCalendarOpen(!calendarOpen)}
                                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wide border border-white/15 transition flex items-center gap-2"
                                >
                                    <Icon icon="solar:calendar-add-bold" className="w-4 h-4 text-amber-400" />
                                    <span>Add to Calendar</span>
                                    <Icon icon="solar:alt-arrow-down-bold" className="w-3 h-3" />
                                </button>

                                {calendarOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white text-slate-900 rounded-2xl shadow-xl border border-slate-100 p-2 z-30 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                                        <a
                                            href={calendarLinks.google}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-xl hover:bg-amber-50 hover:text-amber-700 transition"
                                        >
                                            <Icon icon="logos:google-icon" className="w-4 h-4 shrink-0" />
                                            Google Calendar
                                        </a>
                                        <a
                                            href={calendarLinks.ics}
                                            download="event.ics"
                                            className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-xl hover:bg-amber-50 hover:text-amber-700 transition"
                                        >
                                            <Icon icon="solar:calendar-bold" className="w-4 h-4 text-slate-700 shrink-0" />
                                            Apple / Outlook (.ICS)
                                        </a>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ─── Main Content Grid ─── */}
            <div className={`container relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 ${timeLeft ? "mt-8" : "-mt-10"}`}>
                {/* ── Left Column (About, Schedule, Speakers, Venue, Gallery) ── */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Featured Image Banner Card (if no large hero or as gallery feature) */}
                    {banner && (
                        <div className="rounded-3xl overflow-hidden shadow-sm border border-slate-200/80 bg-white aspect-16/9">
                            <img src={banner} alt={post.title} className="w-full h-full object-cover" />
                        </div>
                    )}

                    {/* About Section */}
                    {hasDescription && (
                        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/80 space-y-4">
                            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                                <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                                    <Icon icon="solar:document-text-bold" className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-black text-slate-900">About This Event</h2>
                            </div>
                            <div
                                className="prose prose-slate prose-sm sm:prose-base max-w-none text-slate-600 leading-relaxed font-normal"
                                dangerouslySetInnerHTML={{ __html: info.description }}
                            />
                        </div>
                    )}

                    {/* Agenda & Schedule Timeline */}
                    {hasSchedule && (
                        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/80 space-y-6">
                            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                                        <Icon icon="solar:history-bold" className="w-5 h-5" />
                                    </div>
                                    <h2 className="text-xl font-black text-slate-900">Event Agenda & Schedule</h2>
                                </div>

                                {/* Track / Day Selector */}
                                {schedule.length > 1 && (
                                    <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1.5 rounded-2xl">
                                        {schedule.map((day, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => setActiveDayTab(idx)}
                                                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                                                    activeDayTab === idx
                                                        ? "bg-white text-slate-900 shadow-xs"
                                                        : "text-slate-600 hover:text-slate-900"
                                                }`}
                                            >
                                                {day.dayTitle || `Day ${idx + 1}`}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Timeline Sessions */}
                            <div className="space-y-4 relative pl-5 border-l-2 border-amber-300">
                                {schedule[activeDayTab]?.sessions?.map((ses: any, sIdx: number) => (
                                    <div key={ses.id || sIdx} className="relative group">
                                        {/* Timeline Node Dot */}
                                        <div className="absolute -left-[27px] top-3 w-3.5 h-3.5 rounded-full bg-amber-500 border-2 border-white shadow-xs group-hover:scale-125 transition-transform" />

                                        <div className="bg-slate-50/80 hover:bg-white p-5 rounded-2xl border border-slate-200/70 hover:border-amber-300 hover:shadow-md transition-all space-y-2">
                                            <div className="flex flex-wrap items-center justify-between gap-2">
                                                <span className="inline-flex items-center gap-1.5 text-xs font-black text-amber-700 bg-amber-100/70 px-2.5 py-1 rounded-lg">
                                                    <Icon icon="solar:clock-circle-bold" className="w-3.5 h-3.5" />
                                                    {ses.time || "Time TBD"}
                                                </span>

                                                {ses.room && (
                                                    <span className="text-[11px] font-bold text-slate-600 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-2xs">
                                                        {ses.room}
                                                    </span>
                                                )}
                                            </div>

                                            <h3 className="text-base font-extrabold text-slate-900">{ses.title || "Session Topic"}</h3>

                                            {ses.description && (
                                                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                                                    {ses.description}
                                                </p>
                                            )}

                                            {ses.speaker && (
                                                <div className="pt-2 flex items-center gap-2 text-xs text-slate-700 font-semibold border-t border-slate-200/60">
                                                    <Icon icon="solar:user-bold" className="w-4 h-4 text-amber-500 shrink-0" />
                                                    <span>Speaker: <strong className="text-slate-900">{ses.speaker}</strong></span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Featured Speakers Lineup */}
                    {hasSpeakers && (
                        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/80 space-y-6">
                            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                                <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                                    <Icon icon="solar:users-group-two-rounded-bold" className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-black text-slate-900">Featured Keynote Speakers</h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {speakers.map((spk, idx) => (
                                    <div
                                        key={spk.id || idx}
                                        className="flex items-start gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-amber-200 hover:shadow-md transition-all group"
                                    >
                                        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-200 shrink-0 border-2 border-white shadow-xs">
                                            <img
                                                src={spk.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop"}
                                                alt={spk.name || "Speaker"}
                                                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                            />
                                        </div>

                                        <div className="min-w-0 flex-1 space-y-1">
                                            <h4 className="text-sm font-extrabold text-slate-900 truncate group-hover:text-amber-600 transition">
                                                {spk.name || "Speaker"}
                                            </h4>
                                            <p className="text-xs font-bold text-amber-600 truncate">{spk.role || "Keynote Presenter"}</p>
                                            {spk.company && <p className="text-[11px] text-slate-500 truncate font-medium">{spk.company}</p>}

                                            {/* Social Handles */}
                                            {(spk.linkedin || spk.twitter) && (
                                                <div className="flex items-center gap-2 pt-1">
                                                    {spk.linkedin && (
                                                        <a href={spk.linkedin} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-600 transition">
                                                            <Icon icon="solar:share-circle-bold" className="w-3.5 h-3.5" />
                                                        </a>
                                                    )}
                                                    {spk.twitter && (
                                                        <a href={spk.twitter} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-sky-500 transition">
                                                            <Icon icon="ri:twitter-x-fill" className="w-3.5 h-3.5" />
                                                        </a>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Venue & Location Deep Details */}
                    {hasVenueData && (
                        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/80 space-y-6">
                            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                                <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                                    <Icon icon="solar:map-point-bold" className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-black text-slate-900">Venue & Access Information</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                                <div className="space-y-4 text-xs text-slate-600">
                                    {venue.venueName && (
                                        <div>
                                            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Venue Name</span>
                                            <span className="text-sm font-extrabold text-slate-900">{venue.venueName}</span>
                                        </div>
                                    )}

                                    {venue.address && (
                                        <div>
                                            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Physical Address</span>
                                            <span className="font-semibold text-slate-800 text-xs leading-relaxed block mt-0.5">
                                                {venue.address}, {venue.city} {venue.state} {venue.postalCode}, {venue.country}
                                            </span>
                                        </div>
                                    )}

                                    {venue.onlinePlatform && (
                                        <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 space-y-1 text-sky-950">
                                            <span className="inline-flex items-center gap-1.5 font-extrabold text-sky-800 text-xs">
                                                <Icon icon="solar:videocamera-record-bold" className="w-4 h-4" />
                                                Live Stream via {venue.onlinePlatform}
                                            </span>
                                            {venue.streamPassword && (
                                                <p className="text-[11px] font-medium text-sky-700">Passcode: <strong className="font-mono">{venue.streamPassword}</strong></p>
                                            )}
                                            {venue.joinUrl && (
                                                <a
                                                    href={venue.joinUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-block mt-2 px-3 py-1.5 bg-sky-600 text-white font-bold text-[11px] rounded-lg hover:bg-sky-700 transition"
                                                >
                                                    Join Stream Link
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {venue.mapUrl && (
                                    <div className="rounded-2xl overflow-hidden border border-slate-200 aspect-video bg-slate-100 flex items-center justify-center relative shadow-inner">
                                        <a
                                            href={venue.mapUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="px-4 py-2.5 rounded-xl bg-slate-900/90 text-white font-bold text-xs hover:bg-amber-600 transition flex items-center gap-2 shadow-md"
                                        >
                                            <Icon icon="solar:map-arrow-square-bold" className="w-4 h-4 text-amber-400" />
                                            Open in Google Maps
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Image Gallery Showcase (if multiple images present) */}
                    {galleryImages.length > 0 && (
                        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/80 space-y-4">
                            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                                <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                                    <Icon icon="solar:gallery-wide-bold" className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-black text-slate-900">Event Media Gallery</h2>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {galleryImages.map((img, gIdx) => (
                                    <div key={gIdx} className="rounded-2xl overflow-hidden aspect-4/3 border border-slate-100 bg-slate-100 group">
                                        <img src={img} alt={`Gallery ${gIdx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Right Column (Sticky Ticket Checkout & Passes) ── */}
                <div className="space-y-6">
                    <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-lg border border-slate-200/90 sticky top-6 space-y-6">
                        <div className="space-y-1.5 pb-5 border-b border-slate-100">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Admission & Passes</span>
                            <div className="text-3xl font-black text-slate-950 flex items-baseline gap-1">
                                {tickets.ticketType === "free" ? (
                                    <span className="text-emerald-600">Free Entry</span>
                                ) : hasTiers && tickets.tiers[selectedTier]?.price !== undefined ? (
                                    <>
                                        <span>${tickets.tiers[selectedTier].price}</span>
                                        <span className="text-xs font-bold text-slate-400">/ person</span>
                                    </>
                                ) : (
                                    <span>Registration Required</span>
                                )}
                            </div>
                        </div>

                        {/* Multi-Tier Pass Selector */}
                        {hasTiers && (
                            <div className="space-y-2.5">
                                <label className="text-[11px] font-extrabold text-slate-700 block">Select Ticket Tier</label>
                                {tickets.tiers.map((t: any, tIdx: number) => (
                                    <button
                                        key={t.id || tIdx}
                                        type="button"
                                        onClick={() => setSelectedTier(tIdx)}
                                        className={`w-full p-3.5 rounded-2xl border text-left transition flex items-center justify-between ${
                                            selectedTier === tIdx
                                                ? "border-amber-500 bg-amber-50/50 shadow-xs ring-1 ring-amber-400"
                                                : "border-slate-200 bg-slate-50/50 hover:bg-slate-100"
                                        }`}
                                    >
                                        <div className="space-y-0.5">
                                            <span className="text-xs font-bold text-slate-900 block">{t.name || `Tier ${tIdx + 1}`}</span>
                                            {t.availableSeats && (
                                                <span className="text-[10px] text-slate-500 font-semibold">{t.availableSeats} tickets left</span>
                                            )}
                                        </div>
                                        <span className="text-sm font-black text-amber-600">${t.price ?? 0}</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Direct Register Action CTA */}
                        <a
                            href={tickets.registrationUrl || "#register"}
                            target={tickets.registrationUrl ? "_blank" : "_self"}
                            rel="noreferrer"
                            className="w-full block text-center py-4 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition transform active:scale-98"
                        >
                            {tickets.buttonLabel || "Register / Get Tickets"}
                        </a>

                        {/* Perks Checklist */}
                        <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs font-medium text-slate-600">
                            <div className="flex items-center gap-2">
                                <Icon icon="solar:check-circle-bold" className="w-4 h-4 text-emerald-500 shrink-0" />
                                <span>Instant Digital Entry Pass QR Code</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Icon icon="solar:check-circle-bold" className="w-4 h-4 text-emerald-500 shrink-0" />
                                <span>Access to Live Q&A and Networking</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Icon icon="solar:check-circle-bold" className="w-4 h-4 text-emerald-500 shrink-0" />
                                <span>Session Recordings & Slides Download</span>
                            </div>
                        </div>

                        {/* Social & Community Links */}
                        {hasSocial && (
                            <div className="pt-4 border-t border-slate-100 space-y-2">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Official Community Links</span>
                                <div className="flex flex-wrap gap-2">
                                    {social.map((s, sIdx) => (
                                        <a
                                            key={sIdx}
                                            href={s.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-amber-50 hover:text-amber-700 text-slate-700 text-xs font-bold transition flex items-center gap-1.5"
                                        >
                                            <Icon icon="solar:link-circle-bold" className="w-3.5 h-3.5" />
                                            {s.platform || "Link"}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
