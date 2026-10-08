"use client";

import React from "react";
import { Icon } from "@iconify/react";
import { Text, ColorPickerPopup } from "@/components/builder/controls";

export function EventTicketCardComponent({ element }: { element: any }) {
    const s = element?.schema || {};
    const c = s.content || {};
    const st = s.style || {};

    const title = c.title ?? "Choose Your Experience";
    const subtitle = c.subtitle ?? "Flexible pricing tiers for standard, VIP, and virtual attendees.";

    const {
        titleColor,
        subtitleColor,
        accentColor = "#f59e0b",
        popularBadgeBg = "#f59e0b",
        popularBadgeTextColor = "#09090b",
        vipCardBg,
        cardBg,
    } = st;

    const tiers = [
        {
            name: "Virtual Live Pass",
            price: 0,
            desc: "Full livestream access, live Q&A chat, and downloadable digital resources.",
            features: ["HD Livestream Stream", "Discord Community Access", "Digital Certificate", "Session Recordings"],
            popular: false,
        },
        {
            name: "VIP All-Access Pass",
            price: 299,
            desc: "Full in-person entry, VIP lunch lounge, speaker roundtables, and VIP Gala dinner.",
            features: ["Front-Row Reserved Seating", "Speaker Meet & Greet", "VIP Gala Access", "All Session Recordings", "Catered Lunch & Cocktails"],
            popular: true,
        },
        {
            name: "Standard In-Person",
            price: 99,
            desc: "Physical entry to all main stage talks, exhibition floor, and coffee networking breaks.",
            features: ["Exhibition Floor Access", "Main Stage Keynotes", "Networking Lounge", "Event Goodie Bag"],
            popular: false,
        },
    ];

    return (
        <div className="w-full">
            <div className="container max-w-6xl space-y-10">
                <div className="text-center space-y-2 max-w-xl mx-auto">
                    <h2
                        style={{ color: titleColor || undefined }}
                        className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-950 tracking-tight"
                    >
                        {title}
                    </h2>
                    {subtitle ? (
                        <p
                            style={{ color: subtitleColor || undefined }}
                            className="text-sm sm:text-base text-slate-500 font-medium"
                        >
                            {subtitle}
                        </p>
                    ) : null}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {tiers.map((tier, i) => (
                        <div
                            key={i}
                            style={{
                                backgroundColor: tier.popular ? (vipCardBg || undefined) : (cardBg || undefined),
                            }}
                            className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 transition duration-300 relative ${
                                tier.popular
                                    ? "bg-slate-950 text-white shadow-2xl border-2 border-amber-500 transform md:-translate-y-2"
                                    : "bg-white text-slate-900 border border-slate-200/80 shadow-xs hover:shadow-md"
                            }`}
                        >
                            {tier.popular && (
                                <span
                                    style={{
                                        backgroundColor: popularBadgeBg || undefined,
                                        color: popularBadgeTextColor || undefined,
                                    }}
                                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950"
                                >
                                    Most Popular
                                </span>
                            )}

                            <div className="space-y-4">
                                <h3 className="text-lg font-bold">{tier.name}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-black">{tier.price === 0 ? "Free" : `$${tier.price}`}</span>
                                    {tier.price > 0 && <span className="text-xs text-slate-400 font-semibold">/ person</span>}
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed">{tier.desc}</p>

                                <div className="pt-4 border-t border-slate-100/20 space-y-2.5">
                                    {tier.features.map((feat, fIdx) => (
                                        <div key={fIdx} className="flex items-center gap-2 text-xs">
                                            <Icon
                                                style={{ color: accentColor || undefined }}
                                                icon="solar:check-circle-bold"
                                                className="w-4 h-4 text-amber-500 shrink-0"
                                            />
                                            <span>{feat}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="button"
                                style={{
                                    backgroundColor: tier.popular ? (accentColor || undefined) : undefined,
                                }}
                                className={`w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-wider transition cursor-pointer ${
                                    tier.popular
                                        ? "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md"
                                        : "bg-slate-950 hover:bg-amber-500 text-white hover:text-slate-950"
                                }`}
                            >
                                Select Pass
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

const eventTicketCardElement = {
    type: "events-ticket-cards",
    category: "Events",
    label: "Event Ticket Pricing Cards",
    icon: "solar:ticket-sale-bold",

    schema: {
        content: {
            title: "Choose Your Experience",
            subtitle: "Flexible pricing tiers for standard, VIP, and virtual attendees.",
        },
        style: {
            titleColor: "",
            subtitleColor: "",
            accentColor: "#f59e0b",
            popularBadgeBg: "#f59e0b",
            popularBadgeTextColor: "#09090b",
            vipCardBg: "",
            cardBg: "",
        },
        advanced: {
            margin: { top: 0, right: 0, bottom: 40, left: 0, unit: "px" },
            padding: { top: 0, right: 0, bottom: 0, left: 0, unit: "px" },
        },
    },

    controls: [
        {
            tab: "Content",
            section: "Headers",
            controls: [
                {
                    name: "title",
                    render: (val: any, onChange: any) => <Text label="Title" value={val ?? "Choose Your Experience"} onChange={onChange} />,
                },
                {
                    name: "subtitle",
                    render: (val: any, onChange: any) => <Text label="Subtitle" value={val ?? ""} onChange={onChange} />,
                },
            ],
        },
        {
            tab: "Style",
            section: "Colors & Theming",
            controls: [
                {
                    name: "titleColor",
                    render: (val: any, onChange: any) => (
                        <ColorPickerPopup label="Heading Title Color" value={val ?? ""} onChange={onChange} />
                    ),
                },
                {
                    name: "subtitleColor",
                    render: (val: any, onChange: any) => (
                        <ColorPickerPopup label="Subtitle Text Color" value={val ?? ""} onChange={onChange} />
                    ),
                },
                {
                    name: "accentColor",
                    render: (val: any, onChange: any) => (
                        <ColorPickerPopup label="Accent & Checkmark Color" value={val ?? "#f59e0b"} onChange={onChange} />
                    ),
                },
                {
                    name: "popularBadgeBg",
                    render: (val: any, onChange: any) => (
                        <ColorPickerPopup label="Popular Badge Background" value={val ?? "#f59e0b"} onChange={onChange} />
                    ),
                },
                {
                    name: "vipCardBg",
                    render: (val: any, onChange: any) => (
                        <ColorPickerPopup label="VIP Card Background" value={val ?? ""} onChange={onChange} />
                    ),
                },
                {
                    name: "cardBg",
                    render: (val: any, onChange: any) => (
                        <ColorPickerPopup label="Standard Card Background" value={val ?? ""} onChange={onChange} />
                    ),
                },
            ],
        },
    ],

    render: (element: any) => <EventTicketCardComponent element={element} />,
};

export default eventTicketCardElement;
