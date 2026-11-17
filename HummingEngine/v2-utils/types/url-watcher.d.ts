import { ManagedPlugin } from "@mercuryworkshop/scramjet-controller";
import type { Frame } from "@mercuryworkshop/scramjet-controller";
export type UrlWatcherOptions = {};
/**
 * Runs a callback whenever the URL of a Frame changes.
 * Includes hash changes and history.pushState/replaceState.
 * For only true navigation events, use the Frame.hooks.init.post hook.
 */
export declare class UrlWatcherPlugin extends ManagedPlugin {
    private onUrlChange;
    private options;
    constructor(onUrlChange: (url: string) => void, options?: UrlWatcherOptions);
    install(frame: Frame): void;
}
