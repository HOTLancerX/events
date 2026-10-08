"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import type { FieldProps } from "@/hook";

export interface TicketTier {
    id: string;
    name: string;
    price: number;
    description?: string;
    availableSeats?: number;
    soldSeats?: number;
}

export interface EventTicketingData {
    ticketType: "free" | "paid" | "rsvp";
    currency: string;
    registrationUrl: string;
    buttonLabel: string;
    totalCapacity: number;
    remainingSeats: number;
    tiers: TicketTier[];
}

export function EventTicketingFields({ name, label, value, onChange }: FieldProps) {
    const [data, setData] = useState<EventTicketingData>({
        ticketType: "free",
        currency: "USD ($)",
        registrationUrl: "",
        buttonLabel: "Register Now",
        totalCapacity: 100,
        remainingSeats: 100,
        tiers: [
            { id: "tier-1", name: "General Admission", price: 0, availableSeats: 100, soldSeats: 0 }
        ],
    });

    useEffect(() => {
        try {
            if (value) {
                const parsed = JSON.parse(value);
                setData((prev) => ({ ...prev, ...parsed }));
            }
        } catch {
            /* empty */
        }
    }, [value]);

    const update = (key: keyof EventTicketingData, val: any) => {
        const next = { ...data, [key]: val };
        setData(next);
        onChange(JSON.stringify(next));
    };

    const addTier = () => {
        const newTier: TicketTier = {
            id: `tier-${Date.now()}`,
            name: "VIP Pass",
            price: 50,
            availableSeats: 50,
            soldSeats: 0,
        };
        const nextTiers = [...data.tiers, newTier];
        update("tiers", nextTiers);
    };

    const removeTier = (index: number) => {
        const nextTiers = data.tiers.filter((_, i) => i !== index);
        update("tiers", nextTiers);
    };

    const updateTier = (index: number, field: keyof TicketTier, val: any) => {
        const nextTiers = [...data.tiers];
        nextTiers[index] = { ...nextTiers[index], [field]: val };
        update("tiers", nextTiers);
    };

    return (
        <div className="flex flex-col gap-4 bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <label className="text-xs font-bold text-gray-800 flex items-center gap-2">
                    <Icon icon="solar:ticket-sale-bold" className="w-4 h-4 text-amber-500" />
                    {label || "Ticketing & Registration"}
                </label>
            </div>

            {/* Type selector */}
            <div className="grid grid-cols-3 gap-2">
                {[
                    { id: "free", label: "Free Event" },
                    { id: "paid", label: "Paid Tickets" },
                    { id: "rsvp", label: "RSVP Only" },
                ].map((t) => (
                    <button
                        key={t.id}
                        type="button"
                        onClick={() => update("ticketType", t.id)}
                        className={`py-2 px-3 rounded-lg text-xs font-semibold border transition ${
                            data.ticketType === t.id
                                ? "bg-amber-50 border-amber-500 text-amber-800"
                                : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                    <label className="text-[10px] font-medium text-gray-600">Currency</label>
                    <input
                        type="text"
                        value={data.currency}
                        onChange={(e) => update("currency", e.target.value)}
                        placeholder="USD ($), EUR (€), etc."
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-amber-500 transition"
                    />
                </div>
                <div>
                    <label className="text-[10px] font-medium text-gray-600">Total Capacity</label>
                    <input
                        type="number"
                        value={data.totalCapacity}
                        onChange={(e) => update("totalCapacity", parseInt(e.target.value) || 0)}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-amber-500 transition"
                    />
                </div>
                <div>
                    <label className="text-[10px] font-medium text-gray-600">Button CTA Label</label>
                    <input
                        type="text"
                        value={data.buttonLabel}
                        onChange={(e) => update("buttonLabel", e.target.value)}
                        placeholder="Register Now / Buy Tickets"
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-amber-500 transition"
                    />
                </div>
            </div>

            <div>
                <label className="text-[10px] font-medium text-gray-600">External Ticket / Registration Link (Optional)</label>
                <input
                    type="url"
                    value={data.registrationUrl}
                    onChange={(e) => update("registrationUrl", e.target.value)}
                    placeholder="https://eventbrite.com/e/... or https://luma.com/..."
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-amber-500 transition"
                />
            </div>

            {/* Ticket Tiers */}
            {data.ticketType === "paid" && (
                <div className="space-y-3 pt-2 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-gray-700">Ticket Tiers & Pricing</span>
                        <button
                            type="button"
                            onClick={addTier}
                            className="text-xs text-amber-600 font-semibold hover:text-amber-700 flex items-center gap-1"
                        >
                            <Icon icon="solar:add-circle-bold" className="w-4 h-4" />
                            Add Ticket Tier
                        </button>
                    </div>

                    <div className="space-y-2">
                        {data.tiers.map((tier, idx) => (
                            <div key={tier.id || idx} className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                                <input
                                    type="text"
                                    value={tier.name}
                                    onChange={(e) => updateTier(idx, "name", e.target.value)}
                                    placeholder="Tier Name (e.g. Standard)"
                                    className="flex-1 bg-white rounded border border-gray-200 px-2.5 py-1.5 text-xs outline-none"
                                />
                                <div className="flex items-center gap-1 w-24">
                                    <span className="text-xs text-gray-400">$</span>
                                    <input
                                        type="number"
                                        value={tier.price}
                                        onChange={(e) => updateTier(idx, "price", parseFloat(e.target.value) || 0)}
                                        placeholder="Price"
                                        className="w-full bg-white rounded border border-gray-200 px-2 py-1.5 text-xs outline-none"
                                    />
                                </div>
                                <input
                                    type="number"
                                    value={tier.availableSeats || 0}
                                    onChange={(e) => updateTier(idx, "availableSeats", parseInt(e.target.value) || 0)}
                                    placeholder="Seats"
                                    className="w-20 bg-white rounded border border-gray-200 px-2 py-1.5 text-xs outline-none"
                                    title="Available Seats"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeTier(idx)}
                                    className="p-1.5 text-gray-400 hover:text-red-500 rounded transition"
                                >
                                    <Icon icon="solar:trash-bin-trash-bold" className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default EventTicketingFields;
