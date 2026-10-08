"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import type { FieldProps } from "@/hook";

export interface ScheduleSession {
    id: string;
    time: string;
    title: string;
    speaker?: string;
    room?: string;
    description?: string;
}

export interface DayAgenda {
    dayTitle: string;
    date: string;
    sessions: ScheduleSession[];
}

export function EventScheduleAgenda({ name, label, value, onChange }: FieldProps) {
    const [agenda, setAgenda] = useState<DayAgenda[]>([
        {
            dayTitle: "Day 1 - Main Conference",
            date: "",
            sessions: [
                { id: "ses-1", time: "09:00 AM - 10:00 AM", title: "Opening Keynote & Welcome", speaker: "Main Speaker", room: "Grand Hall", description: "Introduction to the event." }
            ]
        }
    ]);

    useEffect(() => {
        try {
            if (value) {
                const parsed = JSON.parse(value);
                if (Array.isArray(parsed)) {
                    setAgenda(parsed);
                }
            }
        } catch {
            /* ignore */
        }
    }, [value]);

    const update = (next: DayAgenda[]) => {
        setAgenda(next);
        onChange(JSON.stringify(next));
    };

    const addDay = () => {
        const newDay: DayAgenda = {
            dayTitle: `Day ${agenda.length + 1}`,
            date: "",
            sessions: [],
        };
        update([...agenda, newDay]);
    };

    const removeDay = (dayIdx: number) => {
        update(agenda.filter((_, i) => i !== dayIdx));
    };

    const addSession = (dayIdx: number) => {
        const next = [...agenda];
        const newSession: ScheduleSession = {
            id: `ses-${Date.now()}`,
            time: "10:00 AM - 11:00 AM",
            title: "New Session / Workshop",
            speaker: "",
            room: "",
            description: "",
        };
        next[dayIdx].sessions.push(newSession);
        update(next);
    };

    const removeSession = (dayIdx: number, sessionIdx: number) => {
        const next = [...agenda];
        next[dayIdx].sessions = next[dayIdx].sessions.filter((_, i) => i !== sessionIdx);
        update(next);
    };

    const updateSession = (dayIdx: number, sessionIdx: number, field: keyof ScheduleSession, val: string) => {
        const next = [...agenda];
        next[dayIdx].sessions[sessionIdx] = {
            ...next[dayIdx].sessions[sessionIdx],
            [field]: val,
        };
        update(next);
    };

    return (
        <div className="flex flex-col gap-4 bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <label className="text-xs font-bold text-gray-800 flex items-center gap-2">
                    <Icon icon="solar:history-bold" className="w-4 h-4 text-amber-500" />
                    {label || "Agenda & Timeline Schedule"}
                </label>
                <button
                    type="button"
                    onClick={addDay}
                    className="text-xs text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-1 bg-amber-50 px-2.5 py-1.5 rounded-lg transition"
                >
                    <Icon icon="solar:add-circle-bold" className="w-4 h-4" />
                    Add Day Track
                </button>
            </div>

            <div className="space-y-4">
                {agenda.map((day, dIdx) => (
                    <div key={dIdx} className="bg-gray-50/70 p-3.5 rounded-xl border border-gray-200 space-y-3">
                        <div className="flex items-center justify-between gap-3">
                            <input
                                type="text"
                                value={day.dayTitle}
                                onChange={(e) => {
                                    const next = [...agenda];
                                    next[dIdx].dayTitle = e.target.value;
                                    update(next);
                                }}
                                placeholder="Track / Day Title"
                                className="font-bold text-xs bg-white rounded border border-gray-200 px-3 py-1.5 flex-1"
                            />
                            <input
                                type="date"
                                value={day.date}
                                onChange={(e) => {
                                    const next = [...agenda];
                                    next[dIdx].date = e.target.value;
                                    update(next);
                                }}
                                className="text-xs bg-white rounded border border-gray-200 px-2 py-1"
                            />
                            <button
                                type="button"
                                onClick={() => addSession(dIdx)}
                                className="text-[11px] text-amber-600 font-medium hover:underline flex items-center gap-1"
                            >
                                <Icon icon="solar:add-circle-bold" className="w-3.5 h-3.5" />
                                Add Session
                            </button>
                            <button
                                type="button"
                                onClick={() => removeDay(dIdx)}
                                className="text-gray-400 hover:text-red-500 p-1"
                            >
                                <Icon icon="solar:trash-bin-trash-bold" className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        {/* Sessions */}
                        <div className="space-y-2 pl-2 border-l-2 border-amber-300">
                            {day.sessions.map((ses, sIdx) => (
                                <div key={ses.id || sIdx} className="bg-white p-2.5 rounded-lg border border-gray-100 shadow-2xs space-y-1.5">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={ses.time}
                                            onChange={(e) => updateSession(dIdx, sIdx, "time", e.target.value)}
                                            placeholder="e.g. 09:00 AM - 10:00 AM"
                                            className="w-40 text-xs border border-gray-200 rounded px-2 py-1 font-semibold text-amber-700 bg-amber-50/50"
                                        />
                                        <input
                                            type="text"
                                            value={ses.title}
                                            onChange={(e) => updateSession(dIdx, sIdx, "title", e.target.value)}
                                            placeholder="Session Topic / Title"
                                            className="flex-1 text-xs border border-gray-200 rounded px-2 py-1 font-bold"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeSession(dIdx, sIdx)}
                                            className="text-gray-400 hover:text-red-500 p-1"
                                        >
                                            <Icon icon="solar:trash-bin-trash-bold" className="w-3 h-3" />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="text"
                                            value={ses.speaker || ""}
                                            onChange={(e) => updateSession(dIdx, sIdx, "speaker", e.target.value)}
                                            placeholder="Speaker / Host"
                                            className="text-[11px] border border-gray-200 rounded px-2 py-1"
                                        />
                                        <input
                                            type="text"
                                            value={ses.room || ""}
                                            onChange={(e) => updateSession(dIdx, sIdx, "room", e.target.value)}
                                            placeholder="Hall / Room / Stage"
                                            className="text-[11px] border border-gray-200 rounded px-2 py-1"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default EventScheduleAgenda;
