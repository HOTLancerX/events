"use client";

import React from "react";
import type { BuilderElementDef } from "@/hook";
import { Text, ColorPickerPopup } from "@/components/builder/controls";
import EventPostSelector from "./EventPostSelector";
import EventScheduleTimelineUI from "../ui/EventScheduleTimelineUI";

const eventScheduleTimelineElement: BuilderElementDef = {
    type: "events-schedule-timeline",
    category: "Events",
    label: "Event Agenda Timeline",
    icon: "solar:history-bold",

    schema: {
        content: {
            title: "Conference Schedule & Highlights",
            subtitle: "Explore key sessions, keynote addresses, and interactive workshops.",
            eventId: "",
        },
        style: {
            titleColor: "",
            subtitleColor: "",
            eventTagBg: "",
            eventTagColor: "",
            timelineColor: "#f59e0b",
            activeTabBg: "",
            activeTabTextColor: "",
            sessionCardBg: "",
            sessionCardBorder: "",
            timeBadgeBg: "",
            timeBadgeColor: "",
        },
        advanced: {
            margin: { top: 0, right: 0, bottom: 40, left: 0, unit: "px" },
            padding: { top: 0, right: 0, bottom: 0, left: 0, unit: "px" },
        },
    },

    controls: [
        {
            tab: "Content",
            section: "Event Source & Heading",
            controls: [
                {
                    name: "title",
                    render: (val: any, onChange: any) => (
                        <Text label="Section Title" value={val ?? "Conference Schedule & Highlights"} onChange={onChange} />
                    ),
                },
                {
                    name: "subtitle",
                    render: (val: any, onChange: any) => (
                        <Text label="Subtitle / Description" value={val ?? ""} onChange={onChange} />
                    ),
                },
                {
                    name: "eventId",
                    render: (val: any, onChange: any) => (
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-700 block">Select Target Event</label>
                            <EventPostSelector value={val ?? ""} onChange={onChange} />
                        </div>
                    ),
                },
            ],
        },
        {
            tab: "Style",
            section: "Heading & Tag Colors",
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
                    name: "timelineColor",
                    render: (val: any, onChange: any) => (
                        <ColorPickerPopup label="Timeline Accent & Node Color" value={val ?? "#f59e0b"} onChange={onChange} />
                    ),
                },
            ],
        },
        {
            tab: "Style",
            section: "Tabs & Session Card Colors",
            controls: [
                {
                    name: "activeTabBg",
                    render: (val: any, onChange: any) => (
                        <ColorPickerPopup label="Active Tab Background" value={val ?? ""} onChange={onChange} />
                    ),
                },
                {
                    name: "activeTabTextColor",
                    render: (val: any, onChange: any) => (
                        <ColorPickerPopup label="Active Tab Text Color" value={val ?? ""} onChange={onChange} />
                    ),
                },
                {
                    name: "sessionCardBg",
                    render: (val: any, onChange: any) => (
                        <ColorPickerPopup label="Session Card Background" value={val ?? ""} onChange={onChange} />
                    ),
                },
                {
                    name: "sessionCardBorder",
                    render: (val: any, onChange: any) => (
                        <ColorPickerPopup label="Session Card Border Color" value={val ?? ""} onChange={onChange} />
                    ),
                },
                {
                    name: "timeBadgeBg",
                    render: (val: any, onChange: any) => (
                        <ColorPickerPopup label="Time Badge Background" value={val ?? ""} onChange={onChange} />
                    ),
                },
                {
                    name: "timeBadgeColor",
                    render: (val: any, onChange: any) => (
                        <ColorPickerPopup label="Time Badge Text Color" value={val ?? ""} onChange={onChange} />
                    ),
                },
            ],
        },
    ],

    render: (element: any) => {
        const schema = element?.schema || element || {};
        const c = schema?.content || {};
        const s = schema?.style || {};

        return (
            <EventScheduleTimelineUI
                title={c.title}
                subtitle={c.subtitle}
                schedule={element?.data?.schedule || []}
                style={s}
            />
        );
    },
};

export default eventScheduleTimelineElement;
