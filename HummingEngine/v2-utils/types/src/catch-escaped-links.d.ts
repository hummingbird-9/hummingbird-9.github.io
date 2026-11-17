import { ManagedPlugin } from "@mercuryworkshop/scramjet-controller";
import type { Frame } from "@mercuryworkshop/scramjet-controller";
/**
 * Intercepts top-level navigation requests (triggered by clicking "open in new tab" on a link, or window.open)
 * Without this plugin, they would open without the proxy shell, which is usually undesired.
 * give a callback telling it how to redirect back to the proxy shell.
 */
export declare class CatchEscapedLinksPlugin extends ManagedPlugin {
    private toLocation;
    constructor(toLocation: (url: URL) => string | URL);
    install(frame: Frame): void;
}
