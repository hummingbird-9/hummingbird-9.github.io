import { ManagedPlugin } from "@mercuryworkshop/scramjet-controller";
import type { Frame } from "@mercuryworkshop/scramjet-controller";
export type { AddAlwaysLastEventListener } from "./alwaysLastBubble";
export { setupAlwaysLastBubble } from "./alwaysLastBubble";
export type EventHandlerPluginOptions = {
    /** Bubble-phase event types to track. Defaults to click, auxclick, and contextmenu. */
    events?: string[];
};
/**
 * Allows you to register an event listener on an element, such that it will only run after the page's own listeners (including after stopPropagation).
 * This allows you to fake "native" browser behavior with ease
 */
export declare class EventHandlerPlugin extends ManagedPlugin {
    private options;
    private addAlwaysLastEventListeners;
    private eventsToCapture;
    constructor(options?: EventHandlerPluginOptions);
    install(frame: Frame): void;
    addEventToCapture(eventName: string): void;
    private getWindow;
    addEventListener<T extends Event>(target: EventTarget, eventName: string, listener: (e: T) => void): void;
}
