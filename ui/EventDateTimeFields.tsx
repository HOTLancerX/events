"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import type { FieldProps } from "@/hook";

export interface EventDateTimeData {
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    timezone: string;
    allDay: boolean;
    countdownEnabled: boolean;
}

const COMMON_TIMEZONES = [
    "UTC",
    "America/New_York (EST/EDT)",
    "America/Los_Angeles (PST/PDT)",
    "America/Chicago (CST/CDT)",
    "Europe/London (GMT/BST)",
    "Europe/Paris (CET/CEST)",
    "Asia/Dubai (GST)",
    "Asia/Dhaka (BST)",
    "Asia/Kolkata (IST)",
    "Asia/Singapore (SGT)",
    "Asia/Tokyo (JST)",
    "Australia/Sydney (AEST/AEDT)",
];

export function EventDateTimeFields({ name, label, value, onChange }: FieldProps) {
    const [data, setData] = useState<EventDateTimeData>({
        startDate: "",
        startTime: "09:00",
        endDate: "",
        endTime: "17:00",
        timezone: "UTC",
        allDay: false,
        countdownEnabled: true,
    });

    useEffect(() => {
        try {
            if (value) {
                const parsed = JSON.parse(value);
                setData((prev) => ({ ...prev, ...parsed }));
            }
        } catch {
            /* ignore JSON parse errors */
        }
    }, [value]);

    const updateField = (key: keyof EventDateTimeData, val: any) => {
        const next = { ...data, [key]: val };
        setData(next);
        onChange(JSON.stringify(next));
    };

    return (
        <div className="flex flex-col gap-4 bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <label className="text-xs font-bold text-gray-800 flex items-center gap-2">
                    <Icon icon="solar:calendar-date-bold" className="w-4 h-4 text-amber-500" />
                    {label || "Date & Time Settings"}
                </label>
                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer font-medium">
                        <input
                            type="checkbox"
                            checked={data.allDay}
                            onChange={(e) => updateField("allDay", e.target.checked)}
                            className="rounded border-gray-300 text-amber-500 focus:ring-amber-400"
                        />
                        All Day Event
                    </label>
                    <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer font-medium">
                        <input
                            type="checkbox"
                            checked={data.countdownEnabled}
                            onChange={(e) => updateField("countdownEnabled", e.target.checked)}
                            className="rounded border-gray-300 text-amber-500 focus:ring-amber-400"
                        />
                        Show Countdown
                    </label>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Start Date & Time */}
                <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-gray-700">Start Date & Time</label>
                    <div className="flex gap-2">
                        <input
                            type="date"
                            value={data.startDate}
                            onChange={(e) => updateField("startDate", e.target.value)}
                            className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-amber-500 transition"
                        />
                        {!data.allDay && (
                            <input
                                type="time"
                                value={data.startTime}
                                onChange={(e) => updateField("startTime", e.target.value)}
                                className="w-28 rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-amber-500 transition"
                            />
                        )}
                    </div>
                </div>

                {/* End Date & Time */}
                <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-gray-700">End Date & Time</label>
                    <div className="flex gap-2">
                        <input
                            type="date"
                            value={data.endDate}
                            onChange={(e) => updateField("endDate", e.target.value)}
                            className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-amber-500 transition"
                        />
                        {!data.allDay && (
                            <input
                                type="time"
                                value={data.endTime}
                                onChange={(e) => updateField("endTime", e.target.value)}
                                className="w-28 rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-amber-500 transition"
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Timezone */}
            <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-gray-700">Timezone</label>
                <select
                    value={data.timezone}
                    onChange={(e) => updateField("timezone", e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-amber-500 transition bg-white"
                >
                    {COMMON_TIMEZONES.map((tz) => (
                        <option key={tz} value={tz}>
                            {tz}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}

export default EventDateTimeFields;
