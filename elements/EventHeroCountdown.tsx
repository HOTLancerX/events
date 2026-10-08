"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { ColorPickerPopup, Text } from "@/components/builder/controls";

export function EventHeroCountdownComponent({ element }: { element: any }) {
    const s = element?.schema || {};
    const c = s.content || {};
    const st = s.style || {};

    const tagText = c.tagText ?? "Biggest Tech Gathering of the Year";
    const title = c.title ?? "AI Innovation World Summit 2026";
    const subtitle = c.subtitle ?? "November 15-18, 2026 • Moscone Center, San Francisco & Online";
    const buttonText = c.buttonText ?? "Claim Early Bird Tickets";
    const buttonUrl = c.buttonUrl ?? "#tickets";
    const targetDateStr = c.targetDate ?? "2026-11-15T09:00:00";

    const {
        cardBg,
        titleColor,
        subtitleColor,
        tagBg,
        tagTextColor,
        digitsColor,
        digitsCardBg,
        btnBg,
        btnTextColor,
    } = st;

    const [timeLeft, setTimeLeft] = useState({ days: 42, hours: 14, minutes: 28, seconds: 50 });

    useEffect(() => {
        const update = () => {
            const target = new Date(targetDateStr).getTime();
            const now = new Date().getTime();
            const diff = target - now;

            if (diff > 0) {
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((diff / 1000 / 60) % 60);
                const seconds = Math.floor((diff / 1000) % 60);
                setTimeLeft({ days, hours, minutes, seconds });
            }
        };

        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, [targetDateStr]);

    return (
        <div
            style={{ backgroundColor: cardBg || "#09090b" }}
            className="relative text-white py-16 sm:py-20 px-4 sm:px-8 rounded-3xl overflow-hidden shadow-2xl border border-white/10 my-4"
        >
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-600/20 via-transparent to-purple-600/20 pointer-events-none" />
            
            <div className="relative max-w-4xl mx-auto text-center space-y-8">
                {tagText ? (
                    <div
                        style={{
                            backgroundColor: tagBg || undefined,
                            color: tagTextColor || undefined,
                        }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-black uppercase tracking-wider"
                    >
                        <Icon icon="solar:fire-bold" className="w-4 h-4 text-amber-400" />
                        <span>{tagText}</span>
                    </div>
                ) : null}

                <h1
                    style={{ color: titleColor || undefined }}
                    className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight"
                >
                    {title}
                </h1>
                
                {subtitle ? (
                    <p
                        style={{ color: subtitleColor || undefined }}
                        className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto font-medium"
                    >
                        {subtitle}
                    </p>
                ) : null}

                {/* Countdown Cards */}
                <div className="grid grid-cols-4 gap-3 sm:gap-6 max-w-lg mx-auto">
                    {[
                        { label: "Days", val: timeLeft.days },
                        { label: "Hours", val: timeLeft.hours },
                        { label: "Mins", val: timeLeft.minutes },
                        { label: "Secs", val: timeLeft.seconds },
                    ].map((item, i) => (
                        <div
                            key={i}
                            style={{ backgroundColor: digitsCardBg || undefined }}
                            className="bg-white/5 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/10 text-center"
                        >
                            <span
                                style={{ color: digitsColor || undefined }}
                                className="block text-2xl sm:text-4xl font-black text-amber-400 leading-none"
                            >
                                {String(item.val).padStart(2, "0")}
                            </span>
                            <span className="block text-[10px] sm:text-xs text-gray-400 uppercase font-bold mt-1.5">
                                {item.label}
                            </span>
                        </div>
                    ))}
                </div>

                {buttonText ? (
                    <div className="pt-2">
                        <Link
                            href={buttonUrl}
                            style={{
                                backgroundColor: btnBg || undefined,
                                color: btnTextColor || undefined,
                            }}
                            className="inline-block px-9 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-gray-950 font-black text-xs uppercase tracking-wider shadow-lg transition transform hover:-translate-y-0.5"
                        >
                            {buttonText}
                        </Link>
                    </div>
                ) : null}
            </div>
        </div>
    );
}

const eventHeroCountdownElement = {
    type: "events-hero-countdown",
    category: "Events",
    label: "Event Hero & Live Countdown",
    icon: "solar:clock-circle-bold",

    schema: {
        content: {
            tagText: "Biggest Tech Gathering of the Year",
            title: "AI Innovation World Summit 2026",
            subtitle: "November 15-18, 2026 • Moscone Center, San Francisco & Online",
            buttonText: "Claim Early Bird Tickets",
            buttonUrl: "#tickets",
            targetDate: "2026-11-15T09:00:00",
        },
        style: {
            cardBg: "#09090b",
            titleColor: "",
            subtitleColor: "",
            tagBg: "",
            tagTextColor: "",
            digitsColor: "",
            digitsCardBg: "",
            btnBg: "",
            btnTextColor: "",
        },
    },

    controls: [
        {
            tab: "Content",
            section: "Hero Text & Details",
            controls: [
                {
                    name: "tagText",
                    render: (val: any, onChange: any) => (
                        <Text label="Top Badge Tag" value={val ?? "Biggest Tech Gathering of the Year"} onChange={onChange} />
                    ),
                },
                {
                    name: "title",
                    render: (val: any, onChange: any) => (
                        <Text label="Hero Heading" value={val ?? "AI Innovation World Summit 2026"} onChange={onChange} />
                    ),
                },
                {
                    name: "subtitle",
                    render: (val: any, onChange: any) => (
                        <Text label="Date & Location Line" value={val ?? ""} onChange={onChange} />
                    ),
                },
                {
                    name: "targetDate",
                    render: (val: any, onChange: any) => (
                        <Text label="Target Countdown Date (YYYY-MM-DDTHH:mm:ss)" value={val ?? "2026-11-15T09:00:00"} onChange={onChange} />
                    ),
                },
                {
                    name: "buttonText",
                    render: (val: any, onChange: any) => (
                        <Text label="Button Label" value={val ?? "Claim Early Bird Tickets"} onChange={onChange} />
                    ),
                },
                {
                    name: "buttonUrl",
                    render: (val: any, onChange: any) => (
                        <Text label="Button URL" value={val ?? "#tickets"} onChange={onChange} />
                    ),
                },
            ],
        },
        {
            tab: "Style",
            section: "Colors & Theming",
            controls: [
                {
                    name: "cardBg",
                    render: (val: any, onChange: any) => (
                        <ColorPickerPopup label="Container Background" value={val ?? "#09090b"} onChange={onChange} />
                    ),
                },
                {
                    name: "titleColor",
                    render: (val: any, onChange: any) => (
                        <ColorPickerPopup label="Title Color" value={val ?? ""} onChange={onChange} />
                    ),
                },
                {
                    name: "subtitleColor",
                    render: (val: any, onChange: any) => (
                        <ColorPickerPopup label="Subtitle Color" value={val ?? ""} onChange={onChange} />
                    ),
                },
                {
                    name: "digitsColor",
                    render: (val: any, onChange: any) => (
                        <ColorPickerPopup label="Countdown Numbers Color" value={val ?? ""} onChange={onChange} />
                    ),
                },
                {
                    name: "digitsCardBg",
                    render: (val: any, onChange: any) => (
                        <ColorPickerPopup label="Digit Box Background" value={val ?? ""} onChange={onChange} />
                    ),
                },
                {
                    name: "btnBg",
                    render: (val: any, onChange: any) => (
                        <ColorPickerPopup label="CTA Button Background" value={val ?? ""} onChange={onChange} />
                    ),
                },
                {
                    name: "btnTextColor",
                    render: (val: any, onChange: any) => (
                        <ColorPickerPopup label="CTA Button Text Color" value={val ?? ""} onChange={onChange} />
                    ),
                },
            ],
        },
    ],

    render: (element: any) => <EventHeroCountdownComponent element={element} />,
};

export default eventHeroCountdownElement;
