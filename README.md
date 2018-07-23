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

If VSCode complains about it being corrupted after the restart, choose `Don't
Show Again`:

<p align="center">
  <img src="https://raw.githubusercontent.com/lehni/vscode-titlebar-less-macos/master/resources/dont-show-again.png" alt="Don't Show Again" width="460">
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

![Before/After](https://raw.githubusercontent.com/lehni/vscode-titlebar-less-macos/master/resources/before-after.png)

## Inspiration

https://github.com/Microsoft/vscode/issues/12377

In particular, [@orta](https://github.com/orta)'s work on a similar fork.

## License

MIT © Jürg Lehni, 2018
