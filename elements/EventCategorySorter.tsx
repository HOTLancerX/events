"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { xFetch } from "@/lib/express";

export interface Cat {
    _id: string;
    title: string;
    image?: string;
    slug?: string;
}

export default function EventCategorySorter({
    value = [],
    onChange,
    single = false,
}: {
    value: string[] | string;
    onChange: (v: any) => void;
    single?: boolean;
}) {
    const [cats, setCats] = useState<Cat[]>([]);
    const [loading, setLoading] = useState(false);
    const [dragIdx, setDragIdx] = useState<number | null>(null);

    const selectedIds: string[] = Array.isArray(value) ? value : value ? [value] : [];

    useEffect(() => {
        setLoading(true);
        xFetch("/builder-post/cats?type=event-category")
            .then((r) => r.json())
            .then((data) => {
                setCats(data.cats ?? []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const toggle = (id: string) => {
        if (single) {
            onChange(selectedIds.includes(id) ? "" : id);
            return;
        }
        onChange(selectedIds.includes(id) ? selectedIds.filter((v) => v !== id) : [...selectedIds, id]);
    };

    const handleDrop = (toIdx: number) => {
        if (dragIdx === null || dragIdx === toIdx) return;
        const next = [...selectedIds];
        const [moved] = next.splice(dragIdx, 1);
        next.splice(toIdx, 0, moved);
        onChange(next);
        setDragIdx(null);
    };

    if (loading) {
        return (
            <div className="flex items-center gap-2 text-xs text-gray-400 px-1 py-2">
                <Icon icon="svg-spinners:ring-resize" width={14} className="animate-spin text-amber-500" />
                <span>Loading event categories...</span>
            </div>
        );
    }

    if (cats.length === 0) {
        return <p className="text-xs text-gray-400 px-1">No event categories found.</p>;
    }

    const activeSelected = selectedIds.filter((id) => cats.some((c) => c._id === id));
    const unselectedCats = cats.filter((c) => !activeSelected.includes(c._id));
    const catById = Object.fromEntries(cats.map((c) => [c._id, c]));

    return (
        <div className="flex flex-col gap-1.5 p-2 bg-gray-50/70 rounded-xl border border-gray-200/80">
            {!single && (
                <label className="flex items-center gap-2 px-1.5 py-1 rounded-lg cursor-pointer hover:bg-white transition">
                    <input
                        type="checkbox"
                        checked={selectedIds.length === 0}
                        onChange={() => onChange([])}
                        className="w-3.5 h-3.5 accent-amber-500 cursor-pointer"
                    />
                    <span className="text-xs text-gray-800 font-bold">All Categories (Latest Events)</span>
                </label>
            )}

            {activeSelected.length > 0 && (
                <div className="space-y-1 pt-1 border-t border-gray-200">
                    <p className="text-[10px] text-gray-400 px-1 uppercase tracking-wide font-bold">
                        Selected {single ? "" : "(Drag to Reorder)"}
                    </p>
                    {activeSelected.map((id, idx) => {
                        const cat = catById[id];
                        if (!cat) return null;
                        return (
                            <div
                                key={id}
                                draggable={!single}
                                onDragStart={() => setDragIdx(idx)}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={() => handleDrop(idx)}
                                className={`flex items-center gap-2 px-2 py-1.5 rounded-lg bg-white border border-gray-200 shadow-2xs ${
                                    !single ? "cursor-grab hover:bg-amber-50/50" : ""
                                } ${dragIdx === idx ? "opacity-50" : ""}`}
                            >
                                {!single && <Icon icon="mdi:drag" width={14} className="text-gray-400 shrink-0" />}
                                <input
                                    type={single ? "radio" : "checkbox"}
                                    checked
                                    onChange={() => toggle(id)}
                                    className="w-3.5 h-3.5 accent-amber-500 cursor-pointer"
                                />
                                <span className="text-xs text-gray-800 font-medium truncate flex-1">{cat.title}</span>
                                {!single && (
                                    <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded">
                                        #{idx + 1}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {unselectedCats.length > 0 && (
                <div className="space-y-1 pt-1 border-t border-gray-200 max-h-48 overflow-y-auto pr-1">
                    <p className="text-[10px] text-gray-400 px-1 uppercase tracking-wide font-bold">
                        Available Categories
                    </p>
                    {unselectedCats.map((cat) => (
                        <label
                            key={cat._id}
                            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white cursor-pointer transition"
                        >
                            <input
                                type={single ? "radio" : "checkbox"}
                                checked={false}
                                onChange={() => toggle(cat._id)}
                                className="w-3.5 h-3.5 accent-amber-500 cursor-pointer"
                            />
                            <span className="text-xs text-gray-700 truncate">{cat.title}</span>
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
}
