# FullscreenX

> **Fullscreen made simple.** Zero-dependency, promise-based fullscreen library for modern browsers.

[![npm version](https://img.shields.io/npm/v/fullscreenx.svg)](https://www.npmjs.com/package/fullscreenx)
[![npm downloads](https://img.shields.io/npm/dm/fullscreenx.svg)](https://www.npmjs.com/package/fullscreenx)
[![bundle size](https://img.shields.io/bundlephobia/minzip/fullscreenx)](https://bundlephobia.com/package/fullscreenx)
[![license](https://img.shields.io/npm/l/fullscreenx.svg)](https://github.com/mahyarsbt/FullscreenX/blob/main/LICENSE)
[![jsdelivr](https://data.jsdelivr.com/v1/package/npm/fullscreenx/badge?style=rounded)](https://www.jsdelivr.com/package/npm/fullscreenx)

## Features

- 🚀 **Zero dependencies** - Pure JavaScript, no external libraries
- 📦 **Tiny footprint** - Only 2.2KB minified
- 🎯 **Promise-based API** - Modern async/await support
- 🔧 **UMD/IIFE format** - Works with AMD, CommonJS, or as global
- 🎨 **Selector support** - Pass elements or CSS selectors
- 📡 **Event system** - Listen to `change`, `enter`, `exit`, `error` events
- 🛡️ **TypeScript support** - Full type definitions included
- ⚡ **Smart detection** - Automatic vendor prefix resolution

## Installation

### NPM
```bash
npm install fullscreenx
```

### Yarn
```bash
yarn add fullscreenx
```

### CDN
```html
<!-- jsDelivr (Recommended) -->
<script src="https://cdn.jsdelivr.net/npm/fullscreenx@latest/dist/fullscreenx.min.js"></script>

<!-- UNPKG -->
<script src="https://unpkg.com/fullscreenx@latest/dist/fullscreenx.min.js"></script>

<!-- Specific version -->
<script src="https://cdn.jsdelivr.net/npm/fullscreenx@1.0.0/dist/fullscreenx.min.js"></script>
```

## Quick Start

### Browser (Script Tag)

```html
<script src="https://cdn.jsdelivr.net/npm/fullscreenx@latest/dist/fullscreenx.min.js"></script>
<script>
  // Enter fullscreen
  FullscreenX.request('#my-element').then(() => {
    console.log('Entered fullscreen!');
  });

  // Exit fullscreen
  FullscreenX.exit();

  // Toggle fullscreen
  FullscreenX.toggle('#video');
</script>
```

### ES Module

```javascript
// From NPM
import FullscreenX from 'fullscreenx';

// From CDN
import FullscreenX from 'https://cdn.skypack.dev/fullscreenx';

await FullscreenX.request('#app');
```

### CommonJS

```javascript
const FullscreenX = require('fullscreenx');

FullscreenX.toggle('#video');
```

## API Reference

| Method | Description | Returns |
|--------|-------------|---------|
| `request(el?, options?)` | Enter fullscreen mode | `Promise<void>` |
| `exit()` | Exit fullscreen mode | `Promise<void>` |
| `toggle(el?, options?)` | Toggle fullscreen state | `Promise<void>` |
| `isEnabled()` | Check if API is supported | `boolean` |
| `isFullscreen()` | Check if in fullscreen | `boolean` |
| `element()` | Get current fullscreen element | `Element \| null` |
| `on(event, callback)` | Add event listener | `void` |
| `off(event, callback)` | Remove event listener | `void` |
| `onchange(callback)` | Listen to state changes | `void` |
| `onerror(callback)` | Listen to errors | `void` |

### Parameters

- **`el`** - Target element (Element or CSS selector string). Defaults to `document.documentElement`
- **`options`** - FullscreenOptions object (e.g., `{navigationUI: 'hide'}` for Safari)
- **`event`** - Event type: `'change'`, `'enter'`, `'exit'`, or `'error'`
- **`callback`** - Event handler function

### Examples

```javascript
// Basic usage
await FullscreenX.request();  // Fullscreen the whole page

// With element selector
await FullscreenX.request('#video-player');

// With options (Safari)
await FullscreenX.request('#video', { navigationUI: 'hide' });

// Event handling
FullscreenX.on('enter', () => console.log('Entered fullscreen'));
FullscreenX.on('exit', () => console.log('Exited fullscreen'));

// Check support
if (FullscreenX.isEnabled()) {
  // Fullscreen is supported
}

// Get current element
const elem = FullscreenX.element();  // null if not in fullscreen

// Access raw API names (debugging)
console.log(FullscreenX.raw);
// { request: "webkitRequestFullscreen", exit: "webkitExitFullscreen", ... }
```

## Browser Support

| Browser | Version | Notes |
|---------|---------|-------|
| Chrome | 71+ | Full support |
| Firefox | 64+ | Full support |
| Safari | 12.1+ | Limited options support |
| Edge | 79+ | Full support |
| Opera | 58+ | Full support |

### iOS Safari Limitations

- Requires user gesture (tap/click)
- Limited to video elements in iPhone
- `navigationUI` option supported

### Known Quirks

1. **User Gesture Required**: Most browsers require fullscreen to be triggered by user interaction
2. **iOS Restrictions**: iPhone only allows video elements to go fullscreen
3. **Keyboard Input**: Some browsers restrict keyboard input in fullscreen (use `Element.ALLOW_KEYBOARD_INPUT` flag where supported)

## Error Handling

```javascript
try {
  await FullscreenX.request('#app');
} catch (error) {
  console.error('Fullscreen failed:', error.message);
  // Possible errors:
  // - "FullscreenX: Fullscreen API not supported"
  // - "FullscreenX: Element not found for selector"
  // - "FullscreenX: Request already pending"
  // - "FullscreenX: Request timeout"
  // - "FullscreenX: Request failed"
}
```

## Advanced Usage

### Custom Event System

```javascript
// Multiple handlers
const handler1 = (e) => console.log('Handler 1');
const handler2 = (e) => console.log('Handler 2');

FullscreenX.on('change', handler1);
FullscreenX.on('change', handler2);

// Remove specific handler
FullscreenX.off('change', handler1);
```

### Race Condition Prevention

FullscreenX prevents concurrent requests automatically:

```javascript
// Second request will be rejected
FullscreenX.request('#elem1');
FullscreenX.request('#elem2')  // Rejected: "Request already pending"
```

### Timeout Configuration

Default timeout is 3 seconds. For custom timeout, modify the source:

```javascript
const TIMEOUT_MS = 5000;  // 5 seconds
```

## Links

- **NPM Package**: [https://www.npmjs.com/package/fullscreenx](https://www.npmjs.com/package/fullscreenx)
- **GitHub Repository**: [https://github.com/mahyarsbt/FullscreenX](https://github.com/mahyarsbt/FullscreenX)
- **Live Demo**: [https://mahyarsbt.github.io/FullscreenX/demo/](https://mahyarsbt.github.io/FullscreenX/demo/)
- **CDN (jsDelivr)**: [https://www.jsdelivr.com/package/npm/fullscreenx](https://www.jsdelivr.com/package/npm/fullscreenx)
- **CDN (UNPKG)**: [https://unpkg.com/browse/fullscreenx/](https://unpkg.com/browse/fullscreenx/)
- **Bundle Size**: [https://bundlephobia.com/package/fullscreenx](https://bundlephobia.com/package/fullscreenx)

## License

MIT License - Copyright (c) 2025 Mahyar SBT

## Contributing

Contributions welcome! Please ensure:
- Zero dependencies maintained
- Size stays under 2.5KB minified
- All vendor prefixes supported
- Tests pass in demo.html

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## Author

**Mahyar SBT**
- GitHub: [@mahyarsbt](https://github.com/mahyarsbt)
- NPM: [@mahyarsbt](https://www.npmjs.com/~mahyarsbt)

---

<div align="center">
Made with ❤️ by <a href="https://github.com/mahyarsbt">Mahyar SBT</a>
</div>
