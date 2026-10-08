"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";

export default function UserEventBookingList() {
    const [tickets] = useState([
        {
            id: "tkt-101",
            eventName: "Global Tech AI & Web3 Summit 2026",
            tier: "VIP Pass",
            date: "2026-11-15",
            venue: "Moscone Center, SF",
            qrCode: "TKT-99214-XYZ",
            status: "Confirmed",
        },
    ]);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold text-gray-900">My Bookings & Tickets</h2>
                <p className="text-xs text-gray-500">Access your digital entry passes and event registration receipts.</p>
            </div>

            <div className="space-y-4">
                {tickets.map((tkt) => (
                    <div key={tkt.id} className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="space-y-1">
                            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">{tkt.tier}</span>
                            <h3 className="text-base font-extrabold text-gray-900">{tkt.eventName}</h3>
                            <div className="flex items-center gap-3 text-xs text-gray-500 font-medium pt-1">
                                <span className="flex items-center gap-1">
                                    <Icon icon="solar:calendar-bold" className="w-3.5 h-3.5 text-amber-500" />
                                    {tkt.date}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    <Icon icon="solar:map-point-bold" className="w-3.5 h-3.5 text-amber-500" />
                                    {tkt.venue}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 border-t md:border-t-0 pt-3 md:pt-0 w-full md:w-auto justify-between md:justify-end">
                            <div className="text-right">
                                <span className="text-[10px] text-gray-400 font-semibold block uppercase">Pass Code</span>
                                <span className="text-xs font-mono font-bold text-gray-900">{tkt.qrCode}</span>
                            </div>
                            <button
                                type="button"
                                className="px-4 py-2 bg-gray-900 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                            >
                                <Icon icon="solar:printer-bold" className="w-4 h-4" />
                                Download Pass
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
