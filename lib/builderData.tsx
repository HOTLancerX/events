/**
 * plugin/events/lib/builderData.tsx
 *
 * SERVER-ONLY. Registers server-side renderers for Event builder elements.
 * Auto-discovered by hook/builderDataHooks.ts via require.context.
 */

import React from "react";
import { registerBuilderElement } from "@/hook/builderDataHooks";
import connectDB from "@/lib/mongodb";
import Post from "@/models/post";
import PostInfo from "@/models/post_info";
import { Types } from "mongoose";
import EventGridUI from "../ui/EventGridUI";
import EventScheduleTimelineUI, { DayTrack } from "../ui/EventScheduleTimelineUI";
import EventCarouselUI from "../ui/EventCarouselUI";

/**
 * Server-side helper: load events from DB with attached post_info
 */
async function loadEvents(limit: number = 6, categoryIds?: string[]) {
    try {
        await connectDB();
        const baseFilter: any = {
            type: "event",
            status: { $ne: "trash" },
        };

        let query: any = { ...baseFilter };

        if (categoryIds && categoryIds.length > 0) {
            const validObjectIds = categoryIds
                .filter((id) => id && Types.ObjectId.isValid(id))
                .map((id) => new Types.ObjectId(id));

            query.category = { $in: [...validObjectIds, ...categoryIds] };
        }

        let posts = (await Post.find(query)
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean()) as any[];

        // If category filter returned empty, fall back to all events
        if ((!posts || posts.length === 0) && categoryIds && categoryIds.length > 0) {
            posts = (await Post.find(baseFilter)
                .sort({ createdAt: -1 })
                .limit(limit)
                .lean()) as any[];
        }

        if (!posts || posts.length === 0) return [];

        const postIds = posts.map((p) => p._id);
        const infoDocs = (await PostInfo.find({
            postId: { $in: postIds },
        }).lean()) as any[];

        const infoMap: Record<string, Record<string, string>> = {};
        infoDocs.forEach((d) => {
            const pid = String(d.postId);
            if (!infoMap[pid]) infoMap[pid] = {};
            infoMap[pid][d.name] = String(d.value ?? "");
        });

        return posts.map((p) => ({
            _id: String(p._id),
            title: String(p.title ?? ""),
            slug: String(p.slug ?? ""),
            type: String(p.type ?? "event"),
            status: String(p.status ?? "published"),
            category: p.category
                ? typeof p.category === "object" && p.category
                    ? String(p.category._id || p.category)
                    : String(p.category)
                : null,
            info: infoMap[String(p._id)] || {},
        }));
    } catch {
        return [];
    }
}

/**
 * Server-side helper: load specific or latest event schedule
 */
async function loadEventSchedule(eventId?: string): Promise<{ eventTitle: string; schedule: DayTrack[] }> {
    try {
        await connectDB();

        let targetPost: any = null;

        if (eventId && Types.ObjectId.isValid(eventId)) {
            targetPost = await Post.findById(eventId).lean();
        }

        // If no specific post or invalid ID, find the latest event that has schedule info
        if (!targetPost) {
            const posts = (await Post.find({
                type: "event",
                status: { $ne: "trash" },
            } as any)
                .sort({ createdAt: -1 })
                .limit(20)
                .lean()) as any[];

            if (!posts || posts.length === 0) return { eventTitle: "", schedule: [] };

            const postIds = posts.map((p) => p._id);
            const infoDocs = (await PostInfo.find({
                postId: { $in: postIds },
                name: "event_schedule",
            }).lean()) as any[];

            const validDoc = infoDocs.find((d) => {
                try {
                    const parsed = JSON.parse(d.value);
                    return Array.isArray(parsed) && parsed.some((day: any) => day.sessions?.length > 0);
                } catch {
                    return false;
                }
            });

            if (validDoc) {
                targetPost = posts.find((p) => String(p._id) === String(validDoc.postId));
            } else {
                targetPost = posts[0];
            }
        }

        if (!targetPost) return { eventTitle: "", schedule: [] };

        const scheduleDoc = (await PostInfo.findOne({
            postId: targetPost._id,
            name: "event_schedule",
        }).lean()) as any;

        let parsedSchedule: DayTrack[] = [];
        if (scheduleDoc?.value) {
            try {
                parsedSchedule = JSON.parse(scheduleDoc.value);
            } catch {
                parsedSchedule = [];
            }
        }

        return {
            eventTitle: targetPost.title || "",
            schedule: parsedSchedule,
        };
    } catch {
        return { eventTitle: "", schedule: [] };
    }
}

// ── 1. Events Grid Server Renderer ──
registerBuilderElement("events-grid", async (schema, data) => {
    const c = schema?.content || {};
    const g = schema?.grid || {};

    const limit = c.limit ? parseInt(String(c.limit), 10) : 6;
    const categoryIds = Array.isArray(c.categoryIds) ? c.categoryIds : [];

    const dbEvents = await loadEvents(limit, categoryIds);

    const s = schema?.style || {};

    return (
        <EventGridUI
            title={c.title}
            description={c.description}
            events={dbEvents}
            columnsDesktop={g.columnsDesktop ?? 3}
            columnsTablet={g.columnsTablet ?? 2}
            columnsMobile={g.columnsMobile ?? 1}
            gapDesktop={g.gapDesktop ?? 6}
            boxStyle={c.boxStyle ?? "box-1"}
            permalinkMap={data?.permalinkMap}
            style={s}
        />
    );
});

// ── 2. Events Schedule Timeline Server Renderer ──
registerBuilderElement("events-schedule-timeline", async (schema) => {
    const c = schema?.content || {};

    const { eventTitle, schedule } = await loadEventSchedule(c.eventId);

    const s = schema?.style || {};

    return (
        <EventScheduleTimelineUI
            title={c.title}
            subtitle={c.subtitle}
            eventTitle={eventTitle}
            schedule={schedule}
            style={s}
        />
    );
});

// ── 3. Events Carousel Slider Server Renderer ──
registerBuilderElement("events-carousel", async (schema, data) => {
    const c = schema?.content || {};
    const sl = schema?.slider || {};

    const limit = c.limit ? parseInt(String(c.limit), 10) : 8;
    const categoryIds = Array.isArray(c.categoryIds) ? c.categoryIds : [];

    const dbEvents = await loadEvents(limit, categoryIds);

    const s = schema?.style || {};

    return (
        <EventCarouselUI
            title={c.title}
            subtitle={c.subtitle}
            events={dbEvents}
            slidesDesktop={sl.slidesDesktop ?? 3}
            slidesTablet={sl.slidesTablet ?? 2}
            slidesMobile={sl.slidesMobile ?? 1}
            loop={sl.loop ?? true}
            showArrows={sl.showArrows ?? true}
            showDots={sl.showDots ?? true}
            boxStyle={c.boxStyle ?? "box-1"}
            permalinkMap={data?.permalinkMap}
            style={s}
        />
    );
});
