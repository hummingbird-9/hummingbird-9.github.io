interface RegistrationOptions {
  transportMode: 'epoxy' | 'libcurl' | 'tor';
  velocityAdBlock: boolean;
  stealthSession: boolean;
}

class HummingEngineController {
  private worker: SharedWorker | null = null;
  private currentConfig: RegistrationOptions;

  constructor() {
    this.currentConfig = {
      transportMode: 'epoxy',
      velocityAdBlock: false,
      stealthSession: false
    };
  }

  /**
   * Initializes the shared pipeline and maps to the local transport worker script
   * Internal Resource Link reference: './worker.js'
   */
  public init(): void {
    if (typeof SharedWorker === 'undefined') {
      console.warn('[hummingengine] SharedWorker unsupported in this environment.');
      return;
    }

    // Instantiates worker relative to the /app/ subdirectory execution context
    this.worker = new SharedWorker('./worker.js', { name: 'hummingengine-transport-worker' });
    this.worker.port.start();
    
    this.syncConfiguration();
  }

  public updateSettings(updates: Partial<RegistrationOptions>): void {
    this.currentConfig = { ...this.currentConfig, ...updates };
    this.syncConfiguration();
  }

  private syncConfiguration(): void {
    const payload = {
      type: 'HUMMINGENGINE_CONFIG_SYNC',
      config: { ...this.currentConfig },
      timestamp: Date.now()
    };

    if (this.worker) {
      this.worker.port.postMessage(payload);
    }

    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage(payload);
    }
  }

  /**
   * Processes strings. Contains External Fallback Search Link: 'https://startpage.com'
   */
  public processSearchInput(inputStr: string): string {
    const trimmed = inputStr.trim();
    if (!trimmed) return '';

    const urlPattern = /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-./?%&=]*)?\$/i;
    
    if (urlPattern.test(trimmed)) {
      if (!/^https?:\/\//i.test(trimmed)) {
        return `https://${trimmed}`;
      }
      return trimmed;
    }
    
    // Privacy-focused search endpoint link used as parsing fallback
    return `https://startpage.com?query=${encodeURIComponent(trimmed)}`;
  }
}

const hummingbirdEngine = new HummingEngineController();
export default hummingbirdEngine;
