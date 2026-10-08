"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import type { FieldProps } from "@/hook";

interface SocialLink {
    platform: string;
    url: string;
}

const PLATFORMS = [
    "Website",
    "Facebook",
    "Instagram",
    "Twitter / X",
    "LinkedIn",
    "YouTube",
    "Discord",
    "Telegram",
];

export function EventSocialFields({ name, label, value, onChange }: FieldProps) {
    const [links, setLinks] = useState<SocialLink[]>([]);

    useEffect(() => {
        try {
            if (value) {
                const parsed = JSON.parse(value);
                if (Array.isArray(parsed)) {
                    setLinks(parsed);
                }
            }
        } catch {
            /* empty */
        }
    }, [value]);

    const update = (next: SocialLink[]) => {
        setLinks(next);
        onChange(JSON.stringify(next));
    };

    const addLink = () => {
        update([...links, { platform: "Website", url: "" }]);
    };

    const removeLink = (idx: number) => {
        update(links.filter((_, i) => i !== idx));
    };

    const updateLink = (idx: number, field: keyof SocialLink, val: string) => {
        const next = [...links];
        next[idx] = { ...next[idx], [field]: val };
        update(next);
    };

    return (
        <div className="flex flex-col gap-3 bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-xs">
            <div className="flex items-center justify-between pb-1.5 border-b border-gray-100">
                <label className="text-xs font-bold text-gray-800 flex items-center gap-2">
                    <Icon icon="solar:share-circle-bold" className="w-4 h-4 text-amber-500" />
                    {label || "Event Links"}
                </label>
                <button
                    type="button"
                    onClick={addLink}
                    className="text-[11px] text-amber-600 font-semibold hover:underline flex items-center gap-1"
                >
                    <Icon icon="solar:add-circle-bold" className="w-3.5 h-3.5" />
                    Add Link
                </button>
            </div>

            {links.length === 0 ? (
                <p className="text-[11px] text-gray-400 italic py-2 text-center">
                    No external links attached.
                </p>
            ) : (
                <div className="space-y-2">
                    {links.map((link, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                            <select
                                value={link.platform}
                                onChange={(e) => updateLink(idx, "platform", e.target.value)}
                                className="w-24 text-[11px] rounded border border-gray-200 p-1.5 outline-none bg-white"
                            >
                                {PLATFORMS.map((p) => (
                                    <option key={p} value={p}>
                                        {p}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="url"
                                value={link.url}
                                onChange={(e) => updateLink(idx, "url", e.target.value)}
                                placeholder="https://..."
                                className="flex-1 text-[11px] rounded border border-gray-200 p-1.5 outline-none focus:border-amber-500"
                            />
                            <button
                                type="button"
                                onClick={() => removeLink(idx)}
                                className="p-1 text-gray-400 hover:text-red-500"
                            >
                                <Icon icon="solar:trash-bin-trash-bold" className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default EventSocialFields;
