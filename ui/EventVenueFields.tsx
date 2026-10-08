"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import type { FieldProps } from "@/hook";

export interface EventVenueData {
    eventType: "in_person" | "online" | "hybrid";
    venueName: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    mapUrl: string;
    onlinePlatform: string;
    joinUrl: string;
    streamPassword?: string;
    accessInstructions?: string;
}

export function EventVenueFields({ name, label, value, onChange }: FieldProps) {
    const [data, setData] = useState<EventVenueData>({
        eventType: "in_person",
        venueName: "",
        address: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
        mapUrl: "",
        onlinePlatform: "Zoom",
        joinUrl: "",
        streamPassword: "",
        accessInstructions: "",
    });

    useEffect(() => {
        try {
            if (value) {
                const parsed = JSON.parse(value);
                setData((prev) => ({ ...prev, ...parsed }));
            }
        } catch {
            /* ignore */
        }
    }, [value]);

    const update = (key: keyof EventVenueData, val: any) => {
        const next = { ...data, [key]: val };
        setData(next);
        onChange(JSON.stringify(next));
    };

    return (
        <div className="flex flex-col gap-4 bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <label className="text-xs font-bold text-gray-800 flex items-center gap-2">
                    <Icon icon="solar:map-point-bold" className="w-4 h-4 text-amber-500" />
                    {label || "Location & Venue Settings"}
                </label>
            </div>

            {/* Event Type Switcher */}
            <div className="grid grid-cols-3 gap-2">
                {[
                    { id: "in_person", label: "In-Person", icon: "solar:buildings-bold" },
                    { id: "online", label: "Virtual / Online", icon: "solar:videocamera-record-bold" },
                    { id: "hybrid", label: "Hybrid", icon: "solar:devices-bold" },
                ].map((t) => (
                    <button
                        key={t.id}
                        type="button"
                        onClick={() => update("eventType", t.id)}
                        className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold border transition ${
                            data.eventType === t.id
                                ? "bg-amber-50 border-amber-500 text-amber-800"
                                : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                        <Icon icon={t.icon} className="w-4 h-4" />
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Physical Venue Fields */}
            {(data.eventType === "in_person" || data.eventType === "hybrid") && (
                <div className="space-y-3 pt-2 border-t border-gray-100">
                    <div className="text-[11px] font-bold text-gray-700 flex items-center gap-1.5">
                        <Icon icon="solar:buildings-2-bold" className="w-3.5 h-3.5 text-amber-500" />
                        Physical Venue Details
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label className="text-[10px] font-medium text-gray-600">Venue Name</label>
                            <input
                                type="text"
                                value={data.venueName}
                                onChange={(e) => update("venueName", e.target.value)}
                                placeholder="e.g. Grand City Convention Center"
                                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-amber-500 transition"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-medium text-gray-600">Street Address</label>
                            <input
                                type="text"
                                value={data.address}
                                onChange={(e) => update("address", e.target.value)}
                                placeholder="e.g. 100 Expo Blvd"
                                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-amber-500 transition"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <div>
                            <label className="text-[10px] font-medium text-gray-600">City</label>
                            <input
                                type="text"
                                value={data.city}
                                onChange={(e) => update("city", e.target.value)}
                                className="w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs outline-none focus:border-amber-500 transition"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-medium text-gray-600">State / Region</label>
                            <input
                                type="text"
                                value={data.state}
                                onChange={(e) => update("state", e.target.value)}
                                className="w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs outline-none focus:border-amber-500 transition"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-medium text-gray-600">Country</label>
                            <input
                                type="text"
                                value={data.country}
                                onChange={(e) => update("country", e.target.value)}
                                className="w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs outline-none focus:border-amber-500 transition"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-medium text-gray-600">Postal Code</label>
                            <input
                                type="text"
                                value={data.postalCode}
                                onChange={(e) => update("postalCode", e.target.value)}
                                className="w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs outline-none focus:border-amber-500 transition"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-medium text-gray-600">Google Maps Link or Coordinates</label>
                        <input
                            type="url"
                            value={data.mapUrl}
                            onChange={(e) => update("mapUrl", e.target.value)}
                            placeholder="https://maps.google.com/..."
                            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-amber-500 transition"
                        />
                    </div>
                </div>
            )}

            {/* Virtual / Online Fields */}
            {(data.eventType === "online" || data.eventType === "hybrid") && (
                <div className="space-y-3 pt-2 border-t border-gray-100">
                    <div className="text-[11px] font-bold text-gray-700 flex items-center gap-1.5">
                        <Icon icon="solar:laptop-minimalistic-bold" className="w-3.5 h-3.5 text-amber-500" />
                        Virtual Event & Streaming Access
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label className="text-[10px] font-medium text-gray-600">Platform</label>
                            <input
                                type="text"
                                value={data.onlinePlatform}
                                onChange={(e) => update("onlinePlatform", e.target.value)}
                                placeholder="Zoom, Google Meet, YouTube Live..."
                                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-amber-500 transition"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-medium text-gray-600">Passcode (Optional)</label>
                            <input
                                type="text"
                                value={data.streamPassword}
                                onChange={(e) => update("streamPassword", e.target.value)}
                                placeholder="Meeting password / PIN"
                                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-amber-500 transition"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-medium text-gray-600">Join / Live Stream URL</label>
                        <input
                            type="url"
                            value={data.joinUrl}
                            onChange={(e) => update("joinUrl", e.target.value)}
                            placeholder="https://zoom.us/j/... or https://meet.google.com/..."
                            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-amber-500 transition"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default EventVenueFields;
