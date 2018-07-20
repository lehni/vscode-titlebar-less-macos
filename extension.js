const vscode = require('vscode')
const fs = require('fs')
const path = require('path')

const appDir = path.dirname(require.main.filename)
const fsOptions = { encoding: 'utf8' }

const patches = {
  'vs/code/electron-main/main.js': [
    [
      '.titleBarStyle="hidden",',
      '.titleBarStyle="hidden-inset",'
    ]
  ],
  'vs/workbench/workbench.main.js': [
    [
      '.isFullscreen=function(){return this._fullscreen',
      '.isFullscreen=function(){return true; this._fullscreen'
    ],
    [
      '"activitybarWidth",{get:function(){return',
      '"activitybarWidth",{get:function(){this.partLayoutInfo.activitybar.width=78;return'        
    ]
  ],
  'vs/workbench/workbench.main.css': [
    [
      /$/g, // Append to the end of the file
      readFile('workbench.main.css')
    ]
  ]
}

exports.activate = function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand('titlebarLess.enable', enable),
    vscode.commands.registerCommand('titlebarLess.disable', disable)
  )
}

function enable() {
  const { success, details } = applyPatches(true)
  vscode.window.showInformationMessage(success
    ? 'Titlebar-Less enabled'
    : `Unable to apply all patches (${details})`
  )
}

function disable() {
  const { success, details } = applyPatches(false)
  vscode.window.showInformationMessage(success
    ? 'Titlebar-Less disabled'
    : `Unable to remove all patches (${details})`
  )
}

function applyPatches(enable) {
  let success = 0
  let total = 0
  for (const [file, filePatches] of Object.entries(patches)) {
    for (const [find, replace] of filePatches) {
      if (patch(
        file,
        enable ? find : replace,
        enable ? replace : find
      )) {
        success++
      }
      total++
    }
  }
  return {
    success: success === total,
    details: `${success}/${total}`
  }
}

function patch(file, find, replace) {
  try {
    const filePath = path.join(appDir, ...file.split('/'))
    const content = fs.readFileSync(filePath, fsOptions)
    const replaceStr = replace instanceof RegExp ? '' : replace
    // Only apply patch if content doesn't already contain the replace str.
    if (!replaceStr || content.indexOf(replaceStr) === -1) {
      const patched = content.replace(find, replaceStr)
      if (patched !== content) {
        fs.writeFileSync(filePath, patched, fsOptions)
        return true
      }
    }
  } catch (err) {
    console.error(err)
  }
  return false
}

function readFile(filename) {
  return fs.readFileSync(path.join(__dirname, filename), fsOptions)
}
