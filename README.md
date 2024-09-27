# Deprecation Notice

This extension does not work on VSCode 1.40 or newer, and has therefore been
deprecated.

You may use [Apc Customize
UI++](https://marketplace.visualstudio.com/items?itemName=drcika.apc-extension)
instead, which you can configure to achieve the same UI style by adding these
settings in your `settings.json` file, see [#52](https://github.com/drcika/apc-extension/issues/52):

```jsonc
{
  "window.titleBarStyle": "native",
  "window.customTitleBarVisibility": "never",
  "window.density.editorTabHeight": "compact",
  "apc.electron": {
    "titleBarStyle": "hiddenInset",
  },
  "apc.header": {
    "height": 37
  },
  "apc.sidebar.titlebar": {
    "height": 37
  },
  "apc.activityBar": {
    "size": 77,
    "itemSize": 48,
    "itemMargin": 0
  },
  "apc.stylesheet": {
    // Don't indent the sidebar title.
    ".custom-sidebar-titlebar .sidebar .composite.title": "padding-left: 0;",
    // Don't indent the statusbar items.
    ".monaco-workbench .part.statusbar>.items-container>.statusbar-item.left.first-visible-item": "padding-left: 0;",
    // Show the host button, and make it as wide as the .activitybar.
    ".statusbar #status\\.host": "display: block !important; width: calc(var(--activity-bar-action-size) - 1px); background: #555 !important;",
    ".statusbar #status\\.host .codicon": "margin: 0 auto;",
  }
}
```

Before `Apc Customize UI++`, [Customize
UI](https://marketplace.visualstudio.com/items?itemName=iocave.customize-ui) was
recommended as a replacement, which you could configure to achieve the same UI
style by adding these settings in your `settings.json` file:

```jsonc
{
  "window.titleBarStyle": "native",
  "customizeUI.titleBar": "inline",
  "customizeUI.activityBar": "wide",
  "customizeUI.stylesheet": {
    // Center action items in .activitybar.
    ".monaco-workbench .activitybar > .content :not(.monaco-menu) > .monaco-action-bar .action-item .action-label": "margin: 0 auto;",
    // Show the host button, and make it as wide as the .activitybar.
    ".statusbar #status\\.host": "width: 76px; background: #555 !important;",
    ".statusbar #status\\.host .codicon": "margin: 0 auto;"
  }
}
```

# Titlebar-less VSCode for macOS

<p align="center">
  <img src="https://raw.githubusercontent.com/lehni/vscode-titlebar-less-macos/master/resources/preview.png" alt="Preview">
</p>

An extension to hide the titlebar on VSCode for macOS, and inline the traffic
lights (= window controls).

## Installation

Follow the instructions in the
[Marketplace](https://marketplace.visualstudio.com/items?itemName=lehni.vscode-titlebar-less-macos),
or run the following in the command palette:

```shell
ext install lehni.vscode-titlebar-less-macos
```

Alternatively, you can run this command in the command line:

```sh
code --install-extension lehni.vscode-titlebar-less-macos
```

## Usage

The extension adds 2 new commands to the command palette:

```js
Titlebar-Less: Enable // Enable titlebar-less mode on macOS (patches core files)
Titlebar-Less: Disable // Disable titlebar-less mode on macOS (restores core files)
```

After executing either of these commands, you need to fully restart VSCode in
order to see the extension's effect. Simply reloading the window is not enough.

If VSCode complains about it being corrupted after the restart, you have two
options:

1. Install the
   [vscode-fix-checksums](https://marketplace.visualstudio.com/items?itemName=lehni.vscode-fix-checksums)
   extension and adjust the internal checksums to prevent this error from being
   displayed. This will also solve the display of `[Unsupported]` in titles and
   menus.

2. Choose `Don't Show Again`:
    <p align="center">
      <img src="https://raw.githubusercontent.com/lehni/vscode-titlebar-less-macos/master/resources/dont-show-again.png" alt="Don't Show Again">
    </p>

See [Disclaimer / A Word of Caution](#disclaimer--a-word-of-caution) for
details.

See [Required User Settings](#required-user-settings), if the title bar doesn't look right after the restart.

## Required User Settings

This extension only works with the following User Settings. In order to change
them, choose `Code` > `Preferences` > `Settings` in the menu, and add / change
these lines:

```json
"window.titleBarStyle": "custom",
"window.nativeTabs": false,
 ```

## Applying the Patches as Root

Due to security restrictions on some systems, VSCode may need to run as root
in order to be able to apply the patches. To do so, open the `Terminal.app` and
run:

```sh
sudo "/Applications/Visual Studio Code.app/Contents/MacOS/Electron"
```

Or this if you're using VSCode Insiders:

```sh
sudo "/Applications/Visual Studio Code - Insiders.app/Contents/MacOS/Electron"
```

Once you ave applied the patches by executing `Titlebar-Less: Enable` as root,
quit VSCode and start it normally without root privileges again.

## Disclaimer / A Word of Caution

This extension modifies files that are part of the core of VSCode, so use it at
your own risk.

This extension creates backup files before modifying the core files, and these
can be restored at any time using the `Titlebar-Less: Disable` command.

If anything goes wrong, you can always reinstall VSCode from
[code.visualstudio.com](https://code.visualstudio.com/download) without loosing
any settings or installed extensions.

## Updating VSCode / Titlebar-Less

When either VSCode or this extension is updated to a newer version, you can
reapply the extension's modifications of the core files simply by running this
command again, followed by a restart of the full application:

```js
Titlebar-Less: Enable
```

## Before / After

<p align="center">
  <img src="https://raw.githubusercontent.com/lehni/vscode-titlebar-less-macos/master/resources/before-after.png" alt="Before/After">
</p>

## Inspiration

https://github.com/Microsoft/vscode/issues/12377

In particular, [@orta](https://github.com/orta)'s work on a similar fork.

## License

MIT © Jürg Lehni, 2018
