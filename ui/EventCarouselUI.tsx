"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import useEmblaCarousel from "embla-carousel-react";
import EventBox1 from "../box/Box-1";
import EventBox2 from "../box/Box-2";

export interface EventCarouselUIProps {
    title?: string;
    subtitle?: string;
    events?: any[];
    slidesDesktop?: number;
    slidesTablet?: number;
    slidesMobile?: number;
    loop?: boolean;
    showArrows?: boolean;
    showDots?: boolean;
    boxStyle?: string;
    permalinkMap?: Record<string, string>;
    style?: {
        titleColor?: string;
        subtitleColor?: string;
        arrowBg?: string;
        arrowColor?: string;
        arrowBorder?: string;
        activeDotColor?: string;
        inactiveDotColor?: string;
        viewAllText?: string;
        viewAllUrl?: string;
        viewAllBg?: string;
        viewAllTextColor?: string;
    };
}

export default function EventCarouselUI({
    title,
    subtitle,
    events = [],
    slidesDesktop = 3,
    slidesTablet = 2,
    slidesMobile = 1,
    loop = true,
    showArrows = true,
    showDots = true,
    boxStyle = "box-1",
    permalinkMap = {},
    style = {},
}: EventCarouselUIProps) {
    if (!events || events.length === 0) {
        return null;
    }

    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop,
        align: "start",
        slidesToScroll: 1,
    });

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
    const scrollTo = useCallback((idx: number) => emblaApi && emblaApi.scrollTo(idx), [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
        setCanScrollPrev(emblaApi.canScrollPrev());
        setCanScrollNext(emblaApi.canScrollNext());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        setScrollSnaps(emblaApi.scrollSnapList());
        emblaApi.on("select", onSelect);
        emblaApi.on("reInit", onSelect);
        return () => {
            emblaApi.off("select", onSelect);
            emblaApi.off("reInit", onSelect);
        };
    }, [emblaApi, onSelect]);

    // Responsive slide flex classes
    const desktopFlexClass =
        slidesDesktop === 4
            ? "lg:flex-[0_0_25%]"
            : slidesDesktop === 2
            ? "lg:flex-[0_0_50%]"
            : slidesDesktop === 1
            ? "lg:flex-[0_0_100%]"
            : "lg:flex-[0_0_33.333%]";

    const tabletFlexClass =
        slidesTablet === 3
            ? "md:flex-[0_0_33.333%]"
            : slidesTablet === 1
            ? "md:flex-[0_0_100%]"
            : "md:flex-[0_0_50%]";

    const mobileFlexClass = slidesMobile === 2 ? "flex-[0_0_50%]" : "flex-[0_0_100%]";

    const {
        titleColor,
        subtitleColor,
        arrowBg,
        arrowColor,
        arrowBorder,
        activeDotColor,
        inactiveDotColor,
        viewAllText,
        viewAllUrl = "/events",
        viewAllBg,
        viewAllTextColor,
    } = style;

    const BoxComponent = boxStyle === "box-2" ? EventBox2 : EventBox1;

    return (
        <div className="w-full">
            <div className="container space-y-6">
                {/* Header & Carousel Navigation */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    {(title || subtitle) ? (
                        <div className="space-y-1 max-w-2xl">
                            {title ? (
                                <h2
                                    style={{ color: titleColor || undefined }}
                                    className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-950 tracking-tight"
                                >
                                    {title}
                                </h2>
                            ) : null}
                            {subtitle ? (
                                <p
                                    style={{ color: subtitleColor || undefined }}
                                    className="text-sm sm:text-base text-slate-500 font-medium"
                                >
                                    {subtitle}
                                </p>
                            ) : null}
                        </div>
                    ) : (
                        <div />
                    )}

                    {showArrows && events.length > 1 && (
                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                            <button
                                type="button"
                                onClick={scrollPrev}
                                disabled={!loop && !canScrollPrev}
                                style={{
                                    backgroundColor: arrowBg || undefined,
                                    color: arrowColor || undefined,
                                    borderColor: arrowBorder || undefined,
                                }}
                                className="w-10 h-10 rounded-full border border-slate-200 bg-white text-slate-800 hover:bg-slate-950 hover:text-white hover:border-slate-950 transition flex items-center justify-center shadow-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                                aria-label="Previous Slide"
                            >
                                <Icon icon="solar:arrow-left-linear" className="w-5 h-5" />
                            </button>
                            <button
                                type="button"
                                onClick={scrollNext}
                                disabled={!loop && !canScrollNext}
                                style={{
                                    backgroundColor: arrowBg || undefined,
                                    color: arrowColor || undefined,
                                    borderColor: arrowBorder || undefined,
                                }}
                                className="w-10 h-10 rounded-full border border-slate-200 bg-white text-slate-800 hover:bg-slate-950 hover:text-white hover:border-slate-950 transition flex items-center justify-center shadow-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                                aria-label="Next Slide"
                            >
                                <Icon icon="solar:arrow-right-linear" className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Embla Carousel Viewport */}
                <div className="overflow-hidden -mx-3 px-3 py-2" ref={emblaRef}>
                    <div className="flex -ml-4 sm:-ml-6">
                        {events.map((ev: any, idx: number) => (
                            <div
                                key={ev._id || `ev-slide-${idx}`}
                                className={`min-w-0 pl-4 sm:pl-6 shrink-0 ${mobileFlexClass} ${tabletFlexClass} ${desktopFlexClass}`}
                            >
                                <BoxComponent item={ev} permalinkMap={permalinkMap} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Dots Pagination */}
                {showDots && scrollSnaps.length > 1 && (
                    <div className="flex items-center justify-center gap-2 pt-2">
                        {scrollSnaps.map((_, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => scrollTo(idx)}
                                style={{
                                    backgroundColor:
                                        selectedIndex === idx
                                            ? activeDotColor || "#f59e0b"
                                            : inactiveDotColor || undefined,
                                }}
                                className={`h-2.5 rounded-full transition-all duration-300 ${
                                    selectedIndex === idx
                                        ? "w-8 bg-amber-500 shadow-xs"
                                        : "w-2.5 bg-slate-200 hover:bg-slate-300"
                                }`}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>
                )}

                {/* Optional View All Button */}
                {viewAllText ? (
                    <div className="text-center pt-2">
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
