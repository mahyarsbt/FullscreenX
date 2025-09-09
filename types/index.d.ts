/**
 * FullscreenX - Fullscreen made simple.
 * TypeScript definitions for FullscreenX
 *
 * @version      1.0.0
 * @author       Mahyar SBT
 * @license      MIT
 * @copyright    2025 Mahyar SBT
 * @see          {@link https://github.com/mahyarsbt/fullscreenx}
 */

export = FullscreenX;
export as namespace FullscreenX;

declare namespace FullscreenX {
  /**
   * Event types supported by FullscreenX
   */
  type EventType = 'change' | 'enter' | 'exit' | 'error';

  /**
   * Event handler callback
   */
  type EventHandler = (event?: Event) => void;

  /**
   * Fullscreen options (for browsers that support them)
   */
  interface FullscreenOptions {
    navigationUI?: 'auto' | 'show' | 'hide';
  }

  /**
   * Raw API names resolved for the current browser
   */
  interface RawAPI {
    request: string | null;
    exit: string | null;
    element: string | null;
    enabled: string | null;
    change: string | null;
    error: string | null;
  }

  /**
   * Request fullscreen for an element
   * @param el - Target element, selector string, or defaults to document.documentElement
   * @param options - Fullscreen options (browser-dependent support)
   * @returns Promise that resolves when entering fullscreen
   */
  function request(el?: Element | string, options?: FullscreenOptions): Promise<void>;

  /**
   * Exit fullscreen mode
   * @returns Promise that resolves when exiting fullscreen
   */
  function exit(): Promise<void>;

  /**
   * Toggle fullscreen mode
   * @param el - Target element, selector string, or defaults to document.documentElement
   * @param options - Fullscreen options (browser-dependent support)
   * @returns Promise that resolves when state changes
   */
  function toggle(el?: Element | string, options?: FullscreenOptions): Promise<void>;

  /**
   * Check if fullscreen API is enabled/supported
   * @returns true if fullscreen is available
   */
  function isEnabled(): boolean;

  /**
   * Check if currently in fullscreen mode
   * @returns true if an element is in fullscreen
   */
  function isFullscreen(): boolean;

  /**
   * Get the current fullscreen element
   * @returns The element in fullscreen or null
   */
  function element(): Element | null;

  /**
   * Add an event listener
   * @param event - Event type
   * @param callback - Event handler
   */
  function on(event: EventType, callback: EventHandler): void;

  /**
   * Remove an event listener
   * @param event - Event type
   * @param callback - Event handler to remove
   */
  function off(event: EventType, callback: EventHandler): void;

  /**
   * Convenience method to listen for change events
   * @param callback - Event handler
   */
  function onchange(callback: EventHandler): void;

  /**
   * Convenience method to listen for error events
   * @param callback - Event handler
   */
  function onerror(callback: EventHandler): void;

  /**
   * Raw vendor-prefixed API names resolved for current browser
   * Useful for debugging and advanced use cases
   */
  const raw: RawAPI;
}
