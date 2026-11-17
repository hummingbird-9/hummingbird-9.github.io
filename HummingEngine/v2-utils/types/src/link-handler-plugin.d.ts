import { ManagedPlugin } from "@mercuryworkshop/scramjet-controller";
import type { Frame } from "@mercuryworkshop/scramjet-controller";
export type LinkHandlerPluginOptions = {};
/**
 * Intercepts anchor clicks and middle-clicks so they open in a new tab via a
 * callback instead of the browser default. Requires {@link EventHandlerPlugin}
 * on the same frame.
 */
export declare class LinkHandlerPlugin extends ManagedPlugin {
    private onNewTab;
    private options;
    constructor(onNewTab: (url: string) => void, options?: LinkHandlerPluginOptions);
    install(frame: Frame): void;
}
