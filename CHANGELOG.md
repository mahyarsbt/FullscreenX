# Changelog

All notable changes to FullscreenX will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-09-09

### 🎉 Initial Release

### Added
- Core fullscreen API with Promise support
- Smart vendor prefix detection (Standard, WebKit, Mozilla, MS)
- Event system with normalized events (`change`, `enter`, `exit`, `error`)
- CSS selector support for element targeting
- TypeScript definitions
- UMD/IIFE bundle format
- Timeout protection (3s default)
- Race condition prevention
- Complete documentation and demo

### Features
- `request(el?, options?)` - Enter fullscreen mode
- `exit()` - Exit fullscreen mode
- `toggle(el?, options?)` - Toggle fullscreen state
- `isEnabled()` - Check API support
- `isFullscreen()` - Check current state
- `element()` - Get current fullscreen element
- `on(event, callback)` - Add event listener
- `off(event, callback)` - Remove event listener
- `onchange(callback)` - Convenience method for change event
- `onerror(callback)` - Convenience method for error event
- `raw` - Exposed vendor-specific API names for debugging

### Browser Support
- Chrome 71+
- Firefox 64+
- Safari 12.1+
- Edge 79+
- Opera 58+

### Technical Details
- Zero dependencies
- 2.2KB minified
- ~1KB gzipped
- ES6 syntax (let/const, arrow functions)
- Single-file distribution
