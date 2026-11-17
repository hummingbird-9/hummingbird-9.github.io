import type { ScramjetClient } from "@mercuryworkshop/scramjet";
export declare function setupAlwaysLastBubble(client: ScramjetClient, whatToCapture: string[]): <T extends Event>(target: EventTarget, eventName: string, listener: (e: T) => void) => void;
export type AddAlwaysLastEventListener = ReturnType<typeof setupAlwaysLastBubble>;
