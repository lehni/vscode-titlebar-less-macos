# Change Log

## Version 1.0.9

- Improve robustness of enable / disable commands.

## Version 1.0.8

- Add support for fullscreen mode.
- Only apply styling overrides if `"window.titleBarStyle"` setting is set to
  `"custom"`.
- Read activity-bar width from CSS variable, so it can optionally be changed / overridden
  with the [Custom CSS and JS Loader](https://marketplace.visualstudio.com/items?itemName=be5invis.vscode-custom-css)
  extension (e.g. when using the `"window.zoomLevel"` setting).

## Version 1.0.7

- Move badges in activity-bar close to original location in relation to icon.
- Fix dragging on area around traffic lights on activity-bar.

## Version 1.0.6

- Fix dragging on area around traffic lights when activity-bar is hidden.

## Version 1.0.5

- Support dragging tab-bar in recent versions of VSCode.

## Version 1.0.4

- Add disclaimer and notes about updating extension and VSCode to README.

## Version 1.0.3

- Improve restoration of patched files when disabling titlebar-less mode.
- Correct title-bar styling for any combination of invisible activity-bar /
  side-bar (#1).
- Add paragraph about required user settings to README (#2).

## Version 1.0.2

- Fix display name.

## Version 1.0.1

- Documentation tweaks.

## Version 1.0.0

- Initial release.
