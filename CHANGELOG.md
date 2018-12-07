# Change Log

## Version 1.7.1

- Adjust patch for latest VSCode Insiders v1.30.0

## Version 1.7.0

- Fix random drag failures on tabs
- Adjust patch for latest VSCode Insiders v1.30.0

## Version 1.6.4

- Adjust patch for latest VSCode Insiders v1.29.0

## Version 1.6.3

- Improve breadcrumb styling to not affect tabs scrolling

## Version 1.6.2

- Adjust patch for latest VSCode Insiders v1.29.0

## Version 1.6.1

- Improve positioning of breadcrumbs under tabs (#18)

## Version 1.6.0

- Adjust patch for latest VSCode Insiders v1.28.0

## Version 1.5.2

- Disable file dragging on draggable tabs containers

## Version 1.5.1

- Don't activate extension when VSCode is running as an Extension Development
  Host

## Version 1.5.0

- Improve handling of draggable tab bars

## Version 1.4.1

- Fix fullscreen view when side-bar is displayed right

## Version 1.4.0

- Correctly handle layout when no side-bar, activity-bar, or tab-bar is
  displayed

## Version 1.3.3

- Improve README
- Add recommendations

## Version 1.3.2

- Include link to lehni.vscode-fix-checksums extension

## Version 1.3.1

- Do not move first tab in additional split views

## Version 1.3.0

- Add support for side-bar on the right

## Version 1.2.0

- Support Electron 2.0 in VSCode 1.26.0-insider and newer

## Version 1.1.0

- Add proper support for zoom levels

## Version 1.0.11

- Add support for latest VSCode Insiders version by removing reliance on
  `.titlebar-style-custom` CSS class.

## Version 1.0.10

- Avoid invalid restores over newer versions of VSCode by using VSCode version
  for versioned backups.

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
