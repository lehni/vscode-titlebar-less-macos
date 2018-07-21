# Titlebar-less VSCode for macOS

<p align="center">
  <img src="https://raw.githubusercontent.com/lehni/vscode-titlebar-less-macos/master/resources/logo.png" alt="Logo" width="80" height="80">
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

If VSCode complains about it being corrupted after the restart, choose `don't
show again`.

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

## Disclaimer / A Word of Caution

This extension modifies files that are part of the core of VSCode, so use it at
your own risk. If anything goes wrong, you can always reinstall VSCode from
[code.visualstudio.com](https://code.visualstudio.com/download) without loosing
any settings or installed extensions.

## Updating Titlebar-Less

Up to version 1.0.2, this extension was using a fragile approach to restore
previously applied modifications that would only work correctly within the same
version of the extension. In order to update to newer versions from these early
versions, you need to first run `Titlebar-Less: Disable` before updating, and
then run `Titlebar-Less: Enable` after the update.

Newer versions create backup files before modifying the core files, and they can
be restored at any time. So with these, you can first update the extension, then
run the commands in this sequence to get to the newer version of the
modifications:

```
Titlebar-Less: Disable
Titlebar-Less: Enable
```

## Updating VSCode

Note that after any updates to VSCode, this extension needs to be enabled again
by running: `Titlebar-Less: Enable`, followed by a restart of the full
application.

NOTE: Do not run `Titlebar-Less: Disable` after such an update, because that may
actually wrongly restore backups from a previous version of VSCode.

## Before / After

![Before/After](https://raw.githubusercontent.com/lehni/vscode-titlebar-less-macos/master/resources/before-after.png)

## Inspiration

https://github.com/Microsoft/vscode/issues/12377

In particular, [@orta](https://github.com/orta)'s work on a similar fork.

## License

MIT © Jürg Lehni, 2018
