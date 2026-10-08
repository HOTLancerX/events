"use client";

import React from "react";
import type { BuilderElementDef } from "@/hook";
import { Text, NumberControl, ColorPickerPopup, Select, Toggle } from "@/components/builder/controls";
import EventCategorySorter from "./EventCategorySorter";
import EventCarouselUI from "../ui/EventCarouselUI";

const eventCarouselElement: BuilderElementDef = {
    type: "events-carousel",
    category: "Events",
    label: "Events Carousel Slider",
    icon: "solar:slider-horizontal-bold",

    schema: {
        content: {
            title: "Upcoming Highlights & Summits",
            subtitle: "Swipe to explore the most anticipated tech gatherings and masterclasses.",
            limit: 8,
            categoryIds: [],
            boxStyle: "box-1",
        },
        slider: {
            slidesDesktop: 3,
            slidesTablet: 2,
            slidesMobile: 1,
            loop: true,
            showArrows: true,
            showDots: true,
        },
        style: {
            titleColor: "",
            subtitleColor: "",
            arrowBg: "",
            arrowColor: "",
            arrowBorder: "",
            activeDotColor: "#f59e0b",
            inactiveDotColor: "",
            viewAllText: "",
            viewAllUrl: "/events",
            viewAllBg: "",
            viewAllTextColor: "",
        },
        advanced: {
            margin: { top: 0, right: 0, bottom: 40, left: 0, unit: "px" },
            padding: { top: 0, right: 0, bottom: 0, left: 0, unit: "px" },
        },
    },

    controls: [
        {
            tab: "Content",
            section: "Event Query & Filtering",
            controls: [
                {
                    name: "title",
                    render: (val: any, onChange: any) => (
                        <Text label="Section Title" value={val ?? "Upcoming Highlights & Summits"} onChange={onChange} />
                    ),
                },
                {
                    name: "subtitle",
                    render: (val: any, onChange: any) => (
                        <Text label="Subtitle / Tagline" value={val ?? ""} onChange={onChange} />
                    ),
                },
                {
                    name: "limit",
                    render: (val: any, onChange: any) => (
                        <NumberControl label="Maximum Events to Load" min={2} max={36} value={val ?? 8} onChange={onChange} />
                    ),
                },
                {
                    name: "boxStyle",
                    render: (val: any, onChange: any) => (
                        <Select
                            label="Card Style"
                            value={val ?? "box-1"}
                            options={[
                                { label: "Standard Card (Box 1)", value: "box-1" },
                                { label: "Horizontal Schedule Row (Box 2)", value: "box-2" },
                            ]}
                            onChange={onChange}
                        />
                    ),
                },
                {
                    name: "categoryIds",
                    render: (val: any, onChange: any) => (
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-700 block">Filter by Category</label>
                            <EventCategorySorter value={val ?? []} onChange={onChange} />
                        </div>
                    ),
                },
            ],
        },
        {
            tab: "Style",
            section: "Carousel Slider Settings",
            controls: [
                {
                    name: "slidesDesktop",
                    render: (val: any, onChange: any) => (
                        <NumberControl label="Desktop Slides (1-4)" min={1} max={4} value={val ?? 3} onChange={onChange} />
                    ),
                },
                {
                    name: "slidesTablet",
                    render: (val: any, onChange: any) => (
                        <NumberControl label="Tablet Slides (1-3)" min={1} max={3} value={val ?? 2} onChange={onChange} />
                    ),
                },
                {
                    name: "slidesMobile",
                    render: (val: any, onChange: any) => (
                        <NumberControl label="Mobile Slides (1-2)" min={1} max={2} value={val ?? 1} onChange={onChange} />
                    ),
                },
                {
                    name: "loop",
                    render: (val: any, onChange: any) => (
                        <Toggle label="Infinite Loop" value={val ?? true} onChange={onChange} />
                    ),
                },
                {
                    name: "showArrows",
                    render: (val: any, onChange: any) => (
                        <Toggle label="Show Navigation Arrows" value={val ?? true} onChange={onChange} />
                    ),
                },
                {
                    name: "showDots",
                    render: (val: any, onChange: any) => (
                        <Toggle label="Show Dots Pagination" value={val ?? true} onChange={onChange} />
                    ),
                },
            ],
        },
        {
            tab: "Style",
            section: "Typography & Color Palette",
            controls: [
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
                    name: "arrowBg",
                    render: (val: any, onChange: any) => (
                        <ColorPickerPopup label="Arrow Button Background" value={val ?? ""} onChange={onChange} />
                    ),
                },
                {
                    name: "arrowColor",
                    render: (val: any, onChange: any) => (
                        <ColorPickerPopup label="Arrow Icon Color" value={val ?? ""} onChange={onChange} />
                    ),
                },
                {
                    name: "activeDotColor",
                    render: (val: any, onChange: any) => (
                        <ColorPickerPopup label="Active Dot Color" value={val ?? "#f59e0b"} onChange={onChange} />
                    ),
                },
            ],
        },
        {
            tab: "Style",
            section: "View All Button CTA",
            controls: [
                {
                    name: "viewAllText",
                    render: (val: any, onChange: any) => (
                        <Text label="Button Label (leave empty to hide)" value={val ?? ""} onChange={onChange} />
                    ),
                },
                {
                    name: "viewAllUrl",
                    render: (val: any, onChange: any) => (
                        <Text label="Button Destination URL" value={val ?? "/events"} onChange={onChange} />
                    ),
                },
                {
                    name: "viewAllBg",
                    render: (val: any, onChange: any) => (
                        <ColorPickerPopup label="Button Background Color" value={val ?? ""} onChange={onChange} />
                    ),
                },
                {
                    name: "viewAllTextColor",
                    render: (val: any, onChange: any) => (
                        <ColorPickerPopup label="Button Text Color" value={val ?? ""} onChange={onChange} />
                    ),
                },
            ],
        },
    ],

    render: (element: any) => {
        const schema = element?.schema || element || {};
        const c = schema?.content || {};
        const sl = schema?.slider || {};
        const s = schema?.style || {};

        return (
            <EventCarouselUI
                title={c.title}
                subtitle={c.subtitle}
                events={element?.data?.events || []}
                slidesDesktop={sl.slidesDesktop ?? 3}
                slidesTablet={sl.slidesTablet ?? 2}
                slidesMobile={sl.slidesMobile ?? 1}
                loop={sl.loop ?? true}
                showArrows={sl.showArrows ?? true}
                showDots={sl.showDots ?? true}
                boxStyle={c.boxStyle ?? "box-1"}
                style={s}
            />
        );
    },
};

export default eventCarouselElement;
