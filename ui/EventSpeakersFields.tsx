"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import type { FieldProps } from "@/hook";
import Gallery from "@/components/Gallery";

export interface SpeakerItem {
    id: string;
    name: string;
    role: string;
    company?: string;
    avatar?: string;
    bio?: string;
    linkedin?: string;
    twitter?: string;
}

export function EventSpeakersFields({ name, label, value, onChange }: FieldProps) {
    const [speakers, setSpeakers] = useState<SpeakerItem[]>([]);

    useEffect(() => {
        try {
            if (value) {
                const parsed = JSON.parse(value);
                if (Array.isArray(parsed)) {
                    setSpeakers(parsed);
                }
            }
        } catch {
            /* ignore */
        }
    }, [value]);

    const update = (next: SpeakerItem[]) => {
        setSpeakers(next);
        onChange(JSON.stringify(next));
    };

    const addSpeaker = () => {
        const item: SpeakerItem = {
            id: `spk-${Date.now()}`,
            name: "",
            role: "Keynote Speaker",
            company: "",
            avatar: "",
            bio: "",
            linkedin: "",
            twitter: "",
        };
        update([...speakers, item]);
    };

    const removeSpeaker = (idx: number) => {
        update(speakers.filter((_, i) => i !== idx));
    };

    const updateSpeaker = (idx: number, field: keyof SpeakerItem, val: string) => {
        const next = [...speakers];
        next[idx] = { ...next[idx], [field]: val };
        update(next);
    };

    return (
        <div className="flex flex-col gap-4 bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <label className="text-xs font-bold text-gray-800 flex items-center gap-2">
                    <Icon icon="solar:users-group-two-rounded-bold" className="w-4 h-4 text-amber-500" />
                    {label || "Speakers & Performers"}
                </label>
                <button
                    type="button"
                    onClick={addSpeaker}
                    className="text-xs text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-1 bg-amber-50 px-2.5 py-1.5 rounded-lg transition"
                >
                    <Icon icon="solar:add-circle-bold" className="w-4 h-4" />
                    Add Speaker
                </button>
            </div>

            {speakers.length === 0 ? (
                <p className="text-xs text-gray-400 italic py-3 text-center bg-gray-50 rounded-lg">
                    No speakers added yet. Click &quot;Add Speaker&quot; to include keynote presenters.
                </p>
            ) : (
                <div className="space-y-4">
                    {speakers.map((spk, idx) => (
                        <div key={spk.id || idx} className="bg-gray-50/80 p-3.5 rounded-xl border border-gray-200 space-y-3">
                            <div className="flex items-center justify-between pb-1 border-b border-gray-200/60">
                                <span className="text-[11px] font-bold text-gray-700 flex items-center gap-1.5">
                                    <Icon icon="solar:user-bold" className="w-3.5 h-3.5 text-amber-500" />
                                    Speaker #{idx + 1}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => removeSpeaker(idx)}
                                    className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition"
                                    title="Remove Speaker"
                                >
                                    <Icon icon="solar:trash-bin-trash-bold" className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-start">
                                {/* Speaker Avatar using Gallery Component */}
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wide block">
                                        Speaker Avatar
                                    </label>
                                    <div className="w-full">
                                        <Gallery
                                            multiple={false}
                                            value={spk.avatar || ""}
                                            onChange={(val) => {
                                                const url = typeof val === "string" ? val : Array.isArray(val) ? val[0] || "" : "";
                                                updateSpeaker(idx, "avatar", url);
                                            }}
                                            placeholder="Select Avatar"
                                        />
                                    </div>
                                </div>

                                {/* Speaker Info Fields */}
                                <div className="md:col-span-3 space-y-2">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                        <div>
                                            <label className="text-[10px] font-medium text-gray-600 block mb-0.5">Name</label>
                                            <input
                                                type="text"
                                                value={spk.name}
                                                onChange={(e) => updateSpeaker(idx, "name", e.target.value)}
                                                placeholder="e.g. Dr. Alex Vance"
                                                className="w-full bg-white rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs outline-none focus:border-amber-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-medium text-gray-600 block mb-0.5">Role / Title</label>
                                            <input
                                                type="text"
                                                value={spk.role}
                                                onChange={(e) => updateSpeaker(idx, "role", e.target.value)}
                                                placeholder="e.g. Keynote Speaker"
                                                className="w-full bg-white rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs outline-none focus:border-amber-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-medium text-gray-600 block mb-0.5">Company / Org</label>
                                            <input
                                                type="text"
                                                value={spk.company}
                                                onChange={(e) => updateSpeaker(idx, "company", e.target.value)}
                                                placeholder="e.g. Acme AI Lab"
                                                className="w-full bg-white rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs outline-none focus:border-amber-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        <div>
                                            <label className="text-[10px] font-medium text-gray-600 block mb-0.5">LinkedIn Profile</label>
                                            <input
                                                type="url"
                                                value={spk.linkedin}
                                                onChange={(e) => updateSpeaker(idx, "linkedin", e.target.value)}
                                                placeholder="https://linkedin.com/in/..."
                                                className="w-full bg-white rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs outline-none focus:border-amber-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-medium text-gray-600 block mb-0.5">X / Twitter Profile</label>
                                            <input
                                                type="url"
                                                value={spk.twitter}
                                                onChange={(e) => updateSpeaker(idx, "twitter", e.target.value)}
                                                placeholder="https://x.com/..."
                                                className="w-full bg-white rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs outline-none focus:border-amber-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default EventSpeakersFields;
