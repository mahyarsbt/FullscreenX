/*!
 * FullscreenX v1.0.0 - Fullscreen made simple.
 * (c) 2025 Mahyar SBT
 * MIT License
 * https://github.com/mahyarsbt/fullscreenx
 */
(function (root, factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    // AMD
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS
    module.exports = factory();
  } else {
    // Browser global
    root.FullscreenX = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // Method map for vendor prefix detection
  const methodMap = [
    // Standard
    [
      'requestFullscreen',
      'exitFullscreen',
      'fullscreenElement',
      'fullscreenEnabled',
      'fullscreenchange',
      'fullscreenerror'
    ],
    // New WebKit
    [
      'webkitRequestFullscreen',
      'webkitExitFullscreen',
      'webkitFullscreenElement',
      'webkitFullscreenEnabled',
      'webkitfullscreenchange',
      'webkitfullscreenerror'
    ],
    // Legacy WebKit
    [
      'webkitRequestFullScreen',
      'webkitCancelFullScreen',
      'webkitCurrentFullScreenElement',
      'webkitCancelFullScreen',
      'webkitfullscreenchange',
      'webkitfullscreenerror'
    ],
    // Mozilla
    [
      'mozRequestFullScreen',
      'mozCancelFullScreen',
      'mozFullScreenElement',
      'mozFullScreenEnabled',
      'mozfullscreenchange',
      'mozfullscreenerror'
    ],
    // Microsoft
    [
      'msRequestFullscreen',
      'msExitFullscreen',
      'msFullscreenElement',
      'msFullscreenEnabled',
      'MSFullscreenChange',
      'MSFullscreenError'
    ]
  ];

  // Detect and resolve vendor prefixes once
  const api = (() => {
    if (typeof document === 'undefined') {
      return null;
    }

    for (const methods of methodMap) {
      const exitMethod = methods[1];
      if (exitMethod in document) {
        return {
          request: methods[0],
          exit: methods[1],
          element: methods[2],
          enabled: methods[3],
          change: methods[4],
          error: methods[5]
        };
      }
    }

    return null;
  })();

  // Event management
  const eventHandlers = {
    change: [],
    enter: [],
    exit: [],
    error: []
  };

  let previousElement = null;
  let pendingPromise = null;
  const TIMEOUT_MS = 3000;

  /**
   * Helper to add event listener once
   * @private
   */
  const once = (element, event, handler) => {
    const wrapper = (e) => {
      element.removeEventListener(event, wrapper);
      handler(e);
    };
    element.addEventListener(event, wrapper);
  };

  /**
   * Helper to resolve selector or element
   * @private
   */
  const resolveElement = (selector) => {
    if (!selector) {
      return document.documentElement;
    }

    if (typeof selector === 'string') {
      const el = document.querySelector(selector);
      if (!el) {
        throw new Error(`FullscreenX: Element not found for selector "${selector}"`);
      }
      return el;
    }

    if (selector instanceof Element) {
      return selector;
    }

    throw new Error('FullscreenX: Invalid element or selector');
  };

  /**
   * Emit normalized events
   * @private
   */
  const emit = (eventType, originalEvent) => {
    const handlers = eventHandlers[eventType];
    for (let i = 0; i < handlers.length; i++) {
      handlers[i](originalEvent);
    }
  };

  /**
   * Global change handler
   * @private
   */
  const handleChange = (e) => {
    const currentElement = document[api.element];

    emit('change', e);

    if (!previousElement && currentElement) {
      emit('enter', e);
    } else if (previousElement && !currentElement) {
      emit('exit', e);
    }

    previousElement = currentElement;
  };

  /**
   * Global error handler
   * @private
   */
  const handleError = (e) => {
    emit('error', e);
  };

  // Setup global listeners if supported
  if (api) {
    document.addEventListener(api.change, handleChange, false);
    document.addEventListener(api.error, handleError, false);
  }

  /**
   * FullscreenX API
   */
  const FullscreenX = {
    /**
     * Request fullscreen for element
     * @param {Element|string} [el] - Target element or selector
     * @param {FullscreenOptions} [options] - Fullscreen options
     * @returns {Promise<void>}
     */
    request(el, options) {
      if (!api) {
        return Promise.reject(new Error('FullscreenX: Fullscreen API not supported'));
      }

      // Prevent concurrent requests
      if (pendingPromise) {
        return Promise.reject(new Error('FullscreenX: Request already pending'));
      }

      const element = resolveElement(el);

      return pendingPromise = new Promise((resolve, reject) => {
        let timeoutId;
        let isResolved = false;

        const cleanup = () => {
          if (timeoutId) clearTimeout(timeoutId);
          isResolved = true;
          pendingPromise = null;
        };

        const onSuccess = () => {
          if (!isResolved && document[api.element] === element) {
            cleanup();
            resolve();
          }
        };

        const onError = (e) => {
          if (!isResolved) {
            cleanup();
            reject(new Error('FullscreenX: Request failed'));
          }
        };

        // Setup listeners
        once(document, api.change, onSuccess);
        once(document, api.error, onError);

        // Timeout guard
        timeoutId = setTimeout(() => {
          if (!isResolved) {
            document.removeEventListener(api.change, onSuccess);
            document.removeEventListener(api.error, onError);
            cleanup();
            reject(new Error('FullscreenX: Request timeout'));
          }
        }, TIMEOUT_MS);

        // Make request
        const promise = element[api.request](options);

        // Handle native promise if available
        if (promise && typeof promise.then === 'function') {
          promise.catch(error => {
            if (!isResolved) {
              cleanup();
              reject(error);
            }
          });
        }
      });
    },

    /**
     * Exit fullscreen
     * @returns {Promise<void>}
     */
    exit() {
      if (!api) {
        return Promise.reject(new Error('FullscreenX: Fullscreen API not supported'));
      }

      if (!document[api.element]) {
        return Promise.resolve();
      }

      // Prevent concurrent requests
      if (pendingPromise) {
        return Promise.reject(new Error('FullscreenX: Request already pending'));
      }

      return pendingPromise = new Promise((resolve, reject) => {
        let timeoutId;
        let isResolved = false;

        const cleanup = () => {
          if (timeoutId) clearTimeout(timeoutId);
          isResolved = true;
          pendingPromise = null;
        };

        const onSuccess = () => {
          if (!isResolved && !document[api.element]) {
            cleanup();
            resolve();
          }
        };

        const onError = () => {
          if (!isResolved) {
            cleanup();
            reject(new Error('FullscreenX: Exit failed'));
          }
        };

        // Setup listeners
        once(document, api.change, onSuccess);
        once(document, api.error, onError);

        // Timeout guard
        timeoutId = setTimeout(() => {
          if (!isResolved) {
            document.removeEventListener(api.change, onSuccess);
            document.removeEventListener(api.error, onError);
            cleanup();
            reject(new Error('FullscreenX: Exit timeout'));
          }
        }, TIMEOUT_MS);

        // Make exit request
        const promise = document[api.exit]();

        // Handle native promise if available
        if (promise && typeof promise.then === 'function') {
          promise.catch(error => {
            if (!isResolved) {
              cleanup();
              reject(error);
            }
          });
        }
      });
    },

    /**
     * Toggle fullscreen
     * @param {Element|string} [el] - Target element or selector
     * @param {FullscreenOptions} [options] - Fullscreen options
     * @returns {Promise<void>}
     */
    toggle(el, options) {
      return this.isFullscreen() ? this.exit() : this.request(el, options);
    },

    /**
     * Check if fullscreen is enabled
     * @returns {boolean}
     */
    isEnabled() {
      return !!(api && document[api.enabled]);
    },

    /**
     * Check if currently in fullscreen
     * @returns {boolean}
     */
    isFullscreen() {
      return !!(api && document[api.element]);
    },

    /**
     * Get current fullscreen element
     * @returns {Element|null}
     */
    element() {
      return api ? document[api.element] || null : null;
    },

    /**
     * Add event listener
     * @param {'change'|'enter'|'exit'|'error'} event - Event name
     * @param {Function} callback - Event handler
     */
    on(event, callback) {
      if (eventHandlers[event] && typeof callback === 'function') {
        if (eventHandlers[event].indexOf(callback) === -1) {
          eventHandlers[event].push(callback);
        }
      }
    },

    /**
     * Remove event listener
     * @param {'change'|'enter'|'exit'|'error'} event - Event name
     * @param {Function} callback - Event handler
     */
    off(event, callback) {
      if (eventHandlers[event]) {
        const index = eventHandlers[event].indexOf(callback);
        if (index > -1) {
          eventHandlers[event].splice(index, 1);
        }
      }
    },

    /**
     * Convenience method for change event
     * @param {Function} callback - Event handler
     */
    onchange(callback) {
      this.on('change', callback);
    },

    /**
     * Convenience method for error event
     * @param {Function} callback - Event handler
     */
    onerror(callback) {
      this.on('error', callback);
    },

    /**
     * Exposed resolved method names for debugging
     */
    raw: api || {
      request: null,
      exit: null,
      element: null,
      enabled: null,
      change: null,
      error: null
    }
  };

  return FullscreenX;
}));
