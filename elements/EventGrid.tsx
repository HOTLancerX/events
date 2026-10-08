"use client";

import React from "react";
import type { BuilderElementDef } from "@/hook";
import { Text, NumberControl, ColorPickerPopup, Select } from "@/components/builder/controls";
import EventCategorySorter from "./EventCategorySorter";
import EventGridUI from "../ui/EventGridUI";

const eventGridElement: BuilderElementDef = {
    type: "events-grid",
    category: "Events",
    label: "Events Grid Showcase",
    icon: "solar:calendar-date-bold",

    schema: {
        content: {
            title: "Featured Events & Experiences",
            description: "Discover upcoming masterclasses, global summits, and local workshops.",
            limit: 6,
            categoryIds: [],
            boxStyle: "box-1",
        },
        grid: {
            columnsDesktop: 3,
            columnsTablet: 2,
            columnsMobile: 1,
            gapDesktop: 6,
        },
        style: {
            titleColor: "",
            subtitleColor: "",
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
                        <Text label="Section Title" value={val ?? "Featured Events & Experiences"} onChange={onChange} />
                    ),
                },
                {
                    name: "description",
                    render: (val: any, onChange: any) => (
                        <Text label="Subtitle / Tagline" value={val ?? ""} onChange={onChange} />
                    ),
                },
                {
                    name: "limit",
                    render: (val: any, onChange: any) => (
                        <NumberControl label="Maximum Events to Show" min={1} max={36} value={val ?? 6} onChange={onChange} />
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
            section: "Grid Columns",
            controls: [
                {
                    name: "columnsDesktop",
                    render: (val: any, onChange: any) => (
                        <NumberControl label="Desktop Columns (1-4)" min={1} max={4} value={val ?? 3} onChange={onChange} />
                    ),
                },
                {
                    name: "columnsTablet",
                    render: (val: any, onChange: any) => (
                        <NumberControl label="Tablet Columns (1-3)" min={1} max={3} value={val ?? 2} onChange={onChange} />
                    ),
                },
            ],
        },
        {
            tab: "Style",
            section: "Heading Typography & Colors",
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
        const g = schema?.grid || {};
        const s = schema?.style || {};

        return (
            <EventGridUI
                title={c.title}
                description={c.description}
                events={element?.data?.events || []}
                columnsDesktop={g.columnsDesktop ?? 3}
                columnsTablet={g.columnsTablet ?? 2}
                columnsMobile={g.columnsMobile ?? 1}
                gapDesktop={g.gapDesktop ?? 6}
                boxStyle={c.boxStyle ?? "box-1"}
                style={s}
            />
        );
    },
};

export default eventGridElement;
