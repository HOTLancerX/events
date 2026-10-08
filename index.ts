import { addHook, addPostType, addCatType, addBuilderElement, type PluginMeta } from "@/hook";
import { 
    Text, 
    Textarea, 
    Select, 
    CategoryHierarchicalSelect 
} from "@/components/ui";

// UI Form Components
import EventDateTimeFields from "./ui/EventDateTimeFields";
import EventVenueFields from "./ui/EventVenueFields";
import EventTicketingFields from "./ui/EventTicketingFields";
import EventSpeakersFields from "./ui/EventSpeakersFields";
import EventScheduleAgenda from "./ui/EventScheduleAgenda";
import EventSocialFields from "./ui/EventSocialFields";

// Account / Frontend Submission Pages
import UserEventPostList from "./pages/UserEventPostList";
import UserEventPostForm from "./pages/UserEventPostForm";
import UserEventBookingList from "./pages/UserEventBookingList";

// Presentation Layouts & Box Components
import EventLayout1 from "./details/EventLayout1";
import EventLayout2 from "./details/EventLayout2";
import EventCategoryLayout1 from "./category/EventCategoryLayout1";
import EventCategoryLayout2 from "./category/EventCategoryLayout2";
import EventBox1 from "./box/Box-1";
import EventBox2 from "./box/Box-2";
import EventHeader from "./header/Header1";
import EventFooter from "./footer/Footer1";

// Builder Elements
import eventGridElement from "./elements/EventGrid";
import eventCarouselElement from "./elements/EventCarousel";
import eventHeroCountdownElement from "./elements/EventHeroCountdown";
import eventScheduleTimelineElement from "./elements/EventScheduleTimeline";
import eventTicketCardElement from "./elements/EventTicketCard";

// ─── 1. Plugin Metadata ───────────────────────────────────────────────────────
export const PLUGINS: PluginMeta = {
    nx: "events",
    name: "Events & Ticketing",
    version: "1.0.0",
    description: "Complete event management plugin with multi-date schedules, virtual/in-person venues, speaker lineups, ticket booking, and agenda timelines.",
    author: "System",
    path: "https://github.com/HOTLancerX/events.git",
    icon: "solar:calendar-date-bold",
    color: "from-amber-500 to-orange-600",
};

/**
 * Register all hooks for the Events plugin.
 */
export function register(): void {
    // ─── 2. Post & Category Types ─────────────────────────────────────────────
    addPostType(
        [
            {
                key: "event",
                label: "Events",
                icon: "solar:calendar-date-bold",
                color: "from-amber-500 to-orange-600",
                position: 25,
                hasCategory: true,
            },
        ],
        PLUGINS.nx
    );

    addCatType(
        [
            {
                key: "event-category",
                label: "Event Categories",
                postType: "event",
                icon: "solar:folder-with-files-bold",
                color: "from-amber-500 to-orange-600",
                position: 25,
            },
            {
                key: "event-location",
                label: "Event Cities & Venues",
                postType: "event",
                icon: "solar:map-point-bold",
                color: "from-rose-500 to-red-600",
                position: 26,
            },
            {
                key: "event-organizer",
                label: "Event Organizers",
                postType: "event",
                icon: "solar:users-group-rounded-bold",
                color: "from-emerald-500 to-teal-600",
                position: 27,
            },
        ],
        PLUGINS.nx
    );

    // ─── 3. Admin Navigation ─────────────────────────────────────────────────
    addHook(
        "admin.nav",
        [
            {
                key: "events",
                label: "Events",
                icon: "solar:calendar-date-bold",
                slug: "posts/event",
                parent: "",
                position: 18,
            },
            {
                key: "event-add",
                label: "Add New Event",
                icon: "solar:add-circle-bold",
                slug: "posts/event/new",
                parent: "events",
                position: 2,
            },
            {
                key: "event-category",
                label: "Event Categories",
                icon: "solar:folder-with-files-bold",
                slug: "category/event-category",
                parent: "events",
                position: 3,
            },
            {
                key: "event-location",
                label: "Venues & Locations",
                icon: "solar:map-point-bold",
                slug: "category/event-location",
                parent: "events",
                position: 4,
            },
            {
                key: "event-organizer",
                label: "Organizers",
                icon: "solar:users-group-rounded-bold",
                slug: "category/event-organizer",
                parent: "events",
                position: 5,
            },
            {
                key: "event-bookings",
                label: "Ticket Bookings",
                icon: "solar:ticket-bold",
                slug: "events/bookings",
                parent: "events",
                position: 6,
            },
        ],
        PLUGINS.nx
    );

    // ─── 4. User Account Pages ───────────────────────────────────────────────
    addHook(
        "user.page",
        [
            {
                key: "events/my-events",
                label: "My Submitted Events",
                type: "user-events",
                style: "left",
                position: 20,
                path: UserEventPostList,
            },
            {
                key: "events/submit",
                label: "Submit / Edit Event",
                type: "user-events",
                style: "left",
                position: 21,
                path: UserEventPostForm,
            },
            {
                key: "events/my-tickets",
                label: "My Bookings & Tickets",
                type: "user-event-tickets",
                style: "left",
                position: 22,
                path: UserEventBookingList,
            },
        ],
        PLUGINS.nx
    );

    addHook(
        "user.nav",
        [
            {
                key: "user-events-list",
                label: "My Events",
                icon: "solar:calendar-date-bold",
                slug: "events/my-events",
                parent: "",
                position: 20,
            },
            {
                key: "user-event-tickets",
                label: "My Tickets",
                icon: "solar:ticket-bold",
                slug: "events/my-tickets",
                parent: "",
                position: 21,
            },
        ],
        PLUGINS.nx
    );

    // ─── 5. Post Form Fields (type="event") ───────────────────────────────────
    addHook(
        "post.form",
        [
            // Left Column
            {
                key: "description",
                label: "Event Overview & Description",
                type: "event",
                style: "left",
                position: 10,
                fieldType: "content",
            },
            {
                key: "event_dates",
                label: "Date, Time & Countdown",
                type: "event",
                style: "left",
                position: 20,
                component: EventDateTimeFields,
            },
            {
                key: "event_venue",
                label: "Venue & Online Meeting Details",
                type: "event",
                style: "left",
                position: 30,
                component: EventVenueFields,
            },
            {
                key: "event_tickets",
                label: "Tickets, Pricing & Registration",
                type: "event",
                style: "left",
                position: 40,
                component: EventTicketingFields,
            },
            {
                key: "event_speakers",
                label: "Guest Speakers & Performers",
                type: "event",
                style: "left",
                position: 50,
                component: EventSpeakersFields,
            },
            {
                key: "event_schedule",
                label: "Agenda & Schedule Timeline",
                type: "event",
                style: "left",
                position: 60,
                component: EventScheduleAgenda,
            },
            // Right Column
            {
                key: "category",
                label: "Event Category",
                type: "event",
                style: "right",
                position: 5,
                component: CategoryHierarchicalSelect,
                hierarchicalCatType: "event-category",
            },
            {
                key: "location",
                label: "City / Venue Location",
                type: "event",
                style: "right",
                position: 10,
                component: CategoryHierarchicalSelect,
                hierarchicalCatType: "event-location",
            },
            {
                key: "organizer",
                label: "Organizer",
                type: "event",
                style: "right",
                position: 15,
                component: CategoryHierarchicalSelect,
                hierarchicalCatType: "event-organizer",
            },
            {
                key: "event_status",
                label: "Event Status",
                type: "event",
                style: "right",
                position: 20,
                component: Select,
                options: [
                    { label: "Scheduled / Upcoming", value: "scheduled" },
                    { label: "Ongoing", value: "ongoing" },
                    { label: "Sold Out", value: "sold_out" },
                    { label: "Postponed", value: "postponed" },
                    { label: "Cancelled", value: "cancelled" },
                ],
            },
            {
                key: "event_social",
                label: "Event Social Links",
                type: "event",
                style: "right",
                position: 30,
                component: EventSocialFields,
            },
        ],
        PLUGINS.nx
    );

    // ─── 6. Category Form Fields (cat.form) ───────────────────────────────────
    addHook(
        "cat.form",
        [
            {
                key: "category_banner",
                label: "Category Banner Image",
                type: "event-category",
                style: "right",
                position: 5,
                fieldType: "gallery",
            },
            {
                key: "badge_color",
                label: "Category Badge Color",
                type: "event-category",
                style: "right",
                position: 10,
                component: Text,
            },
        ],
        PLUGINS.nx
    );

    // ─── 7. Root Page Templates & Card Boxes ─────────────────────────────────
    addHook(
        "root.pages",
        [
            // Single Event Layouts
            {
                key: "event-layout-1",
                label: "Event Detail Layout 1 (Modern Hero & Agenda)",
                type: "event",
                slug: "dynamic",
                style: "left",
                position: 1,
                active: true,
                component: EventLayout1,
            },
            {
                key: "event-layout-2",
                label: "Event Detail Layout 2 (Conference & Speakers)",
                type: "event",
                slug: "dynamic",
                style: "left",
                position: 2,
                component: EventLayout2,
            },
            // Event Category Archive Layouts
            {
                key: "event-category-layout-1",
                label: "Event Category Grid",
                type: "event-category",
                slug: "dynamic",
                style: "left",
                position: 1,
                active: true,
                component: EventCategoryLayout1,
            },
            {
                key: "event-category-layout-2",
                label: "Event Category Calendar View",
                type: "event-category",
                slug: "dynamic",
                style: "left",
                position: 2,
                component: EventCategoryLayout2,
            },
            // Card Box Templates
            {
                key: "event-box-1",
                label: "Event Box 1 (Standard Card with Date Badge)",
                type: "event-box",
                slug: "dynamic",
                style: "left",
                position: 1,
                active: true,
                component: EventBox1,
            },
            {
                key: "event-box-2",
                label: "Event Box 2 (Horizontal Schedule Row)",
                type: "event-box",
                slug: "dynamic",
                style: "left",
                position: 2,
                component: EventBox2,
            },
            // Header & Footer
            {
                key: "event-header-1",
                label: "Event Header (with Ticket CTA)",
                type: "header",
                slug: "layout",
                style: "left",
                position: 25,
                component: EventHeader,
            },
            {
                key: "event-footer-1",
                label: "Event Footer",
                type: "footer",
                slug: "layout",
                style: "left",
                position: 25,
                component: EventFooter,
            },
        ],
        PLUGINS.nx
    );

    // ─── 8. Builder Elements ─────────────────────────────────────────────────
    addBuilderElement(eventGridElement as any, PLUGINS.nx);
    addBuilderElement(eventCarouselElement as any, PLUGINS.nx);
    addBuilderElement(eventHeroCountdownElement as any, PLUGINS.nx);
    addBuilderElement(eventScheduleTimelineElement as any, PLUGINS.nx);
    addBuilderElement(eventTicketCardElement as any, PLUGINS.nx);
}

export default register;
