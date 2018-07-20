# Titlebar-less VSCode for macOS

<p align="center">
  <img src="https://raw.githubusercontent.com/lehni/vscode-titlebar-less-macos/master/resources/logo.png" alt="Logo">
</p>

An extension to hide the titlebar on VSCode for macOS, and inline the traffic
lights (= window controls).

## Install

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

## Required User Settings

This extension only works with the following User Settings. In order to change
them, choose `Code` > `Preferences` > `Settings` in the menu, and add / change
these lines:

```json
  "window.titleBarStyle": "custom",
  "window.nativeTabs": false,
 ```

## Befor / After

![Before/After](https://raw.githubusercontent.com/lehni/vscode-titlebar-less-macos/master/resources/before-after.png)

## Inspiration

https://github.com/Microsoft/vscode/issues/12377

In particular, [@orta](https://github.com/orta)'s work on a similar fork.

## License

MIT © Jürg Lehni, 2018
