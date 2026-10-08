"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import EventBox1 from "../box/Box-1";
import EventBox2 from "../box/Box-2";

export interface EventGridUIProps {
    title?: string;
    description?: string;
    events?: any[];
    columnsDesktop?: number;
    columnsTablet?: number;
    columnsMobile?: number;
    gapDesktop?: number;
    boxStyle?: string;
    permalinkMap?: Record<string, string>;
    style?: {
        titleColor?: string;
        subtitleColor?: string;
        accentColor?: string;
        viewAllText?: string;
        viewAllUrl?: string;
        viewAllBg?: string;
        viewAllTextColor?: string;
    };
}

export default function EventGridUI({
    title,
    description,
    events = [],
    columnsDesktop = 3,
    columnsTablet = 2,
    columnsMobile = 1,
    gapDesktop = 6,
    boxStyle = "box-1",
    permalinkMap = {},
    style = {},
}: EventGridUIProps) {
    if (!events || events.length === 0) {
        return null;
    }

    const {
        titleColor,
        subtitleColor,
        viewAllText,
        viewAllUrl = "/events",
        viewAllBg,
        viewAllTextColor,
    } = style;

    const gridColsClass =
        columnsDesktop === 4
            ? "lg:grid-cols-4"
            : columnsDesktop === 2
            ? "lg:grid-cols-2"
            : columnsDesktop === 1
            ? "lg:grid-cols-1"
            : "lg:grid-cols-3";

    const tabletColsClass =
        columnsTablet === 3
            ? "md:grid-cols-3"
            : columnsTablet === 1
            ? "md:grid-cols-1"
            : "md:grid-cols-2";

    const mobileColsClass = columnsMobile === 2 ? "grid-cols-2" : "grid-cols-1";

    const BoxComponent = boxStyle === "box-2" ? EventBox2 : EventBox1;

    return (
        <div className="w-full">
            <div className="container space-y-8">
                {(title || description) ? (
                    <div className="text-center max-w-2xl mx-auto space-y-2">
                        {title ? (
                            <h2
                                style={{ color: titleColor || undefined }}
                                className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-950 tracking-tight"
                            >
                                {title}
                            </h2>
                        ) : null}
                        {description ? (
                            <p
                                style={{ color: subtitleColor || undefined }}
                                className="text-sm sm:text-base text-slate-500 font-medium"
                            >
                                {description}
                            </p>
                        ) : null}
                    </div>
                ) : null}

                <div className={`grid ${mobileColsClass} ${tabletColsClass} ${gridColsClass} gap-6`}>
                    {events.map((ev: any, idx: number) => (
                        <BoxComponent key={ev._id || `ev-${idx}`} item={ev} permalinkMap={permalinkMap} />
                    ))}
                </div>

                {viewAllText ? (
                    <div className="text-center pt-4">
                        <Link
                            href={viewAllUrl}
                            style={{
                                backgroundColor: viewAllBg || undefined,
                                color: viewAllTextColor || undefined,
                            }}
                            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-slate-950 hover:bg-amber-600 text-white font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5"
                        >
                            <span>{viewAllText}</span>
                            <Icon icon="solar:arrow-right-linear" className="w-4 h-4" />
                        </Link>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
