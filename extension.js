const vscode = require('vscode')
const fs = require('fs')
const path = require('path')

const appDir = path.dirname(require.main.filename)
const fsOptions = { encoding: 'utf8' }

const version = parseFloat(vscode.version)

const { showTrafficLights } = vscode.workspace.getConfiguration('titlebarLess')

const patches = {
  'vs/code/electron-main/main.js': [
    // Override the Electron BrowserWindow options:
    // https://electronjs.org/docs/api/frameless-window
    [
      '.titleBarStyle="hidden",',
      showTrafficLights
        ? `.titleBarStyle="${version < 1.26 ? 'hidden-inset' : 'hiddenInset'}",`
        : '.frame=false,'
    ]
  ],
  'vs/workbench/workbench.desktop.main.js': [
    // Never show the TITLEBAR_PART when "window.titleBarStyle" is "custom" 
    [
      new RegExp([
        // TODO: Remove support for older versions once they are in a distant past
        // 1.33.0 <= v
        'return"native"!==\\w\\.getTitleBarStyle\\(this\\.configurationService,this\\.environmentService\\)(&&\\(!this\\.state\\.fullscreen)',
        // 1.30.0 <= v < 1.33.0 
        'return!!this\\.useCustomTitleBarStyle\\(\\)(&&\\(!\\w\\.isFullscreen\\(\\))',
        //           v < 1.30.0
        'return"custom"===this\\.getCustomTitleBarStyle\\(\\)(&&\\(!\\w\\.isFullscreen\\(\\))'
       ].join('|')),
      'return false$1$2$3'
    ],
    // Handle setting of traffic-lights size and .titlebar-less class on .monaco-workbench
    [
      // Patch the full layout function in layout.ts, and parse it to retrieve
      // its parameter and the object on which to call `getZoomFactor()`:
      // Use `[^}]*` at the beginning and end of the body, to match any code
      // that doesn't involve any changing nesting. This is required to loosely
      // match smaller changes in different version of VSCode, as well as random
      // line-breaks inserted by the minifier.
      // Also, `this\.contextViewService\.layout\(\))` can't be matched anymore,
      // since that's now called further down in workbench.desktop.main.js too.
      // TODO: Replace `(\.layout=function\(\w+\)\{|layout\(\w+\)\{)` with `(layout\(\w+\)\{)` once VSCode v1.31.0 is in a distant past
      /(\.layout=function\(\w+\)\{|layout\(\w+\)\{)([^}]*this\.workbenchSize=[\s\S]*(\w+)\.getZoomFactor\(\)[\s\S]*this\.parts\.activitybar\.layout\([^)]*\)[^}]*)}/m,
      (all, func, body, browser) => {
        return `${func}
          var layoutService = (
            // TODO: Remove support for older versions once they are in a distant past
            // 1.33.0 <= v
            this.layoutService ||
            //           v < 1.33.0
            this.partService
          )
          var editorGroupService = layoutService && (
            // TODO: Remove support for older versions once they are in a distant past
            // 1.33.0 <= v
            this.editorGroupService ||
            // 1.31.0 <= v < 1.33.0 
            layoutService.editorGroupService ||
            //           v < 1.31.0
            layoutService.workbenchLayout && layoutService.workbenchLayout.editorGroupService
          );
          var configurationService = layoutService && layoutService.configurationService;
          var environmentService = layoutService && layoutService.environmentService;
          if (!layoutService) {
            console.error('Unable to retrieve layoutService');
          } else if (!editorGroupService) {
            console.error('Unable to retrieve editorGroupService');
          } else if (!configurationService) {
            console.error('Unable to retrieve configurationService');
          } else if (!environmentService) {
            console.error('Unable to retrieve environmentService');
          } else if (
            // Only activate titlebar-less mode if "window.titleBarStyle" is set to "custom",
            // and VSCode isn't running as an Extension Development Host:
            !environmentService.isExtensionDevelopment &&
            "custom" === configurationService.getValue().window.titleBarStyle
          ) {
            // Add .titlebar-less to .monaco-workbench, see workbench.desktop.main.css
            this.workbenchContainer.classList.add("titlebar-less");
            ${showTrafficLights
              ? `// Set traffic-lights size, taking zoom-factor into account:
                 var factor = ${browser}.getZoomFactor();
                 var width = 78 / factor;
                 var height = 35 / factor;
                 this.partLayoutInfo.activitybar.width = width;`
          
              : `var width = 0;
                 var height = 0;`
            }
            var style = document.documentElement.style;
            style.setProperty("--traffic-lights-width", width + "px");
            style.setProperty("--traffic-lights-height", height + "px");
            // Install handlers on editorGroupService to determine the draggable titles with tabs,
            // by adding the .titlebar-less-draggable CSS class only to the titles at the top of the window:
            if (!this.titlebarLessHandlers) {
              var handleDraggableTitles = () => process.nextTick(() => {
                for (const title of Array.from(global.document.querySelectorAll('.editor .title'))) {
                  title.classList.toggle('titlebar-less-draggable', !title.getBoundingClientRect().top);
                }
              });
              var handlers = this.titlebarLessHandlers = [];
              editorGroupService.onDidLayout(handleDraggableTitles ,null, handlers);
              editorGroupService.onDidAddGroup(handleDraggableTitles ,null, handlers);
              editorGroupService.onDidMoveGroup(handleDraggableTitles ,null, handlers);
              editorGroupService.onDidRemoveGroup(handleDraggableTitles ,null, handlers);
            }
          }
          ${body}
        }`
      }
    ]
  ],
  'vs/workbench/workbench.desktop.main.css': [
    // Add our CSS modifications to the end of the main file
    [
      /$/g, // Append to the end of the file
      readFile('workbench.desktop.main.css')
    ]
  ]
}

const messages = {
  success: verb => `Titlebar-less mode ${verb}. Please restart VSCode to see effect.`,
  fail: (verb, result) => `Unable to ${verb} all patches (${result.applied}/${result.total})`
}

exports.activate = function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand('titlebarLess.enable', enable),
    vscode.commands.registerCommand('titlebarLess.disable', disable)
  )
  cleanupOrigFiles()
}

function enable() {
  // Always try to disable before enabling, but ignore if nothing was there to
  // disable (= it was already disabled before).
  let result = applyPatches(false)
  if (result.success || result.applied === 0) {
    result = applyPatches(true)
    vscode.window.showInformationMessage(result.success
      ? messages.success('enabled')
      : messages.fail('apply', result)
    )
  } else {
    vscode.window.showInformationMessage(messages.fail('remove', result))
  }
}

function disable() {
  const result = applyPatches(false)
  // Ignore if nothing was there to disable (= it was already disabled before).
  vscode.window.showInformationMessage(result.success || result.applied === 0
    ? messages.success('disabled')
    : messages.fail('remove', result)
  )
}

function applyPatches(enable) {
  let applied = 0
  let total = 0
  for (const [filePath, filePatches] of Object.entries(patches)) {
    const file = getFilePath(filePath)
    const orig = `${file}.orig.${vscode.version}`
    try {
      const amount = filePatches.length
      total += amount
      if (enable) {
        let content = fs.readFileSync(file, fsOptions)
        let found = 0
        for (const [find, replace] of filePatches) {
          const patched = content.replace(find, replace)
          if (patched !== content) {
            content = patched
            found++
          } else {
            console.error(`Unable to apply patch: ${find}`)
          }
        }
        if (found === amount) {
          fs.renameSync(file, orig)
          fs.writeFileSync(file, content, fsOptions)
          applied += amount
        }
      } else {
        if (fs.existsSync(orig)) {
          fs.unlinkSync(file)
          fs.renameSync(orig, file)
          applied += amount
        }
      }
    } catch (err) {
      console.error(err)
    }
  }
  return {
    success: applied === total,
    applied,
    total
  }
}

function cleanupOrigFiles() {
  // Remove all old backup files that aren't related to the current version
  // of VSCode anymore.
  for (const filePath of Object.keys(patches)) {
    const dir = path.dirname(getFilePath(filePath))
    const oldOrigFiles = fs.readdirSync(dir)
      .filter(file => /\.orig\./.test(file))
      .filter(file => !file.endsWith(vscode.version))
    for (const file of oldOrigFiles) {
      fs.unlinkSync(path.join(dir, file))
    }
  }
}

function getFilePath(filePath) {
  return path.join(appDir, ...filePath.split('/'))
}

function readFile(filename) {
  return fs.readFileSync(path.join(__dirname, filename), fsOptions)
}
