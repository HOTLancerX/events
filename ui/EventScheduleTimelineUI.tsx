"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";

export interface SessionItem {
    id?: string;
    time?: string;
    title?: string;
    speaker?: string;
    room?: string;
    description?: string;
}

export interface DayTrack {
    dayTitle?: string;
    date?: string;
    sessions?: SessionItem[];
}

export interface EventScheduleTimelineUIProps {
    title?: string;
    subtitle?: string;
    eventTitle?: string;
    schedule?: DayTrack[];
    style?: {
        titleColor?: string;
        subtitleColor?: string;
        eventTagBg?: string;
        eventTagColor?: string;
        timelineColor?: string;
        activeTabBg?: string;
        activeTabTextColor?: string;
        sessionCardBg?: string;
        sessionCardBorder?: string;
        timeBadgeBg?: string;
        timeBadgeColor?: string;
    };
}

export default function EventScheduleTimelineUI({
    title,
    subtitle,
    eventTitle,
    schedule = [],
    style = {},
}: EventScheduleTimelineUIProps) {
    const [activeTab, setActiveTab] = useState(0);

    if (!schedule || schedule.length === 0 || !schedule.some((d) => d.sessions && d.sessions.length > 0)) {
        return null;
    }

    const {
        titleColor,
        subtitleColor,
        eventTagBg,
        eventTagColor,
        timelineColor,
        activeTabBg,
        activeTabTextColor,
        sessionCardBg,
        sessionCardBorder,
        timeBadgeBg,
        timeBadgeColor,
    } = style;

    const currentTrack = schedule[activeTab] || schedule[0];
    const sessions = currentTrack?.sessions || [];

    return (
        <div className="w-full">
            <div className="container max-w-4xl space-y-8">
                {/* Header */}
                <div className="text-center space-y-2 max-w-2xl mx-auto">
                    {title && (
                        <h2
                            style={{ color: titleColor || undefined }}
                            className="text-2xl md:text-3xl xl:text-4xl font-black text-slate-950 tracking-tight"
                        >
                            {title}
                        </h2>
                    )}
                    {subtitle && (
                        <p
                            style={{ color: subtitleColor || undefined }}
                            className="text-md md:text-base text-slate-500 font-medium"
                        >
                            {subtitle}
                        </p>
                    )}
                    {eventTitle && (
                        <span
                            style={{
                                backgroundColor: eventTagBg || undefined,
                                color: eventTagColor || undefined,
                            }}
                            className="inline-block mt-1 px-3.5 py-1 rounded-full text-xs font-extrabold bg-amber-50 text-amber-700 border border-amber-200/60"
                        >
                            {eventTitle}
                        </span>
                    )}
                </div>

                {/* Day Track Tabs */}
                {schedule.length > 1 && (
                    <div className="flex flex-wrap justify-center gap-2">
                        {schedule.map((track, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => setActiveTab(idx)}
                                style={{
                                    backgroundColor:
                                        activeTab === idx
                                            ? activeTabBg || undefined
                                            : undefined,
                                    color:
                                        activeTab === idx
                                            ? activeTabTextColor || undefined
                                            : undefined,
                                }}
                                className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition shadow-xs ${
                                    activeTab === idx
                                        ? "bg-slate-950 text-white shadow-md ring-2 ring-slate-900"
                                        : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                                }`}
                            >
                                {track.dayTitle || `Day ${idx + 1}`}
                                {track.date && <span className="opacity-70 ml-1.5 font-normal">({track.date})</span>}
                            </button>
                        ))}
                    </div>
                )}

                {/* Timeline Sessions List */}
                <div
                    style={{ borderColor: timelineColor || undefined }}
                    className="relative pl-6 md:pl-8 border-l-2 border-amber-400 space-y-4"
                >
                    {sessions.map((ses, sIdx) => (
                        <div key={ses.id || sIdx} className="relative group">
                            {/* Glowing Timeline Node */}
                            <div
                                style={{ backgroundColor: timelineColor || undefined }}
                                className="absolute -left-7.75 md:-left-9.75 top-4 w-4 h-4 rounded-full bg-amber-500 border-3 border-white shadow-md group-hover:scale-125 transition-transform"
                            />

                            <div
                                style={{
                                    backgroundColor: sessionCardBg || undefined,
                                    borderColor: sessionCardBorder || undefined,
                                }}
                                className="bg-white hover:bg-amber-50/20 p-5 md:p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:border-amber-300 hover:shadow-md transition-all space-y-2.5"
                            >
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <span
                                        style={{
                                            backgroundColor: timeBadgeBg || undefined,
                                            color: timeBadgeColor || undefined,
                                        }}
                                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wide bg-amber-50 text-amber-700 border border-amber-200/60"
                                    >
                                        <Icon icon="solar:clock-circle-bold" className="w-3.5 h-3.5" />
                                        {ses.time || "Scheduled Time"}
                                    </span>

                                    {ses.room && (
                                        <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                                            {ses.room}
                                        </span>
                                    )}
                                </div>

                                <h3 className="text-base md:text-lg font-extrabold text-slate-900 leading-snug">
                                    {ses.title}
                                </h3>

                                {ses.description && (
                                    <p className="text-xs md:text-md text-slate-600 leading-relaxed font-normal">
                                        {ses.description}
                                    </p>
                                )}

                                {ses.speaker && (
                                    <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-slate-700 border-t border-slate-100">
                                        <Icon
                                            style={{ color: timelineColor || undefined }}
                                            icon="solar:user-bold"
                                            className="w-4 h-4 text-amber-500 shrink-0"
                                        />
                                        <span>Hosted by: <strong className="text-slate-900">{ses.speaker}</strong></span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
