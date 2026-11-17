import { ManagedPlugin } from "@mercuryworkshop/scramjet-controller";
import type { Frame } from "@mercuryworkshop/scramjet-controller";
export declare const CACHE_NAME = "scramjet-http-cache-v2";
export interface HttpCachePluginOptions {
    /** Name of the underlying Cache API entry. Defaults to CACHE_NAME. */
    cacheName?: string;
}
/**
 * RFC-9111-ish HTTP cache for ScramjetFetchHandler.
 *
 * One instance can be installed onto multiple Frames -- the WeakMap of
 * "did this request come from cache?" book-keeping is per-instance, not
 * per-Frame, so nothing leaks across installs.
 */
export declare class HttpCachePlugin extends ManagedPlugin {
    readonly cacheName: string;
    private cachePromise;
    private cameFromCache;
    constructor(options?: HttpCachePluginOptions);
    /** Lazy-open the underlying Cache. Memoized for the plugin's lifetime. */
    private openCache;
    install(frame: Frame): void;
    /**
     * Drop every entry in the HTTP cache. Returns whether the underlying
     * Cache existed and was deleted.
     */
    bust(): Promise<boolean>;
}
