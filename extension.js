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
      '.isFullscreen=function(){return true'
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

const messages = {
  enabled: 'Titlebar-less mode enabled. Please restart VSCode to see effect.',
  disabled: 'Titlebar-less mode disabled. Please restart VSCode to see effect.',
  failedToEnable: details => `Unable to apply all patches (${details})`,
  failedToDisable: details => `Unable to remove all patches (${details})`
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
    ? messages.enabled
    : messages.failedToEnable(details)
  )
}

function disable() {
  const { success, details } = applyPatches(false)
  vscode.window.showInformationMessage(success
    ? messages.disabled
    : messages.failedToDisable(details)
  )
}

function applyPatches(enable) {
  let success = 0
  let total = 0
  for (const [filePath, filePatches] of Object.entries(patches)) {
    const file = path.join(appDir, ...filePath.split('/'))
    const orig = `${file}.orig`
    if (enable) {
      let backup = true
      for (const [find, replace] of filePatches) {
        if (patch(file, backup && orig, find, replace)) {
          backup = false
          success++
        }
        total++
      }
    } else {
      if (restore(file, orig)) {
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

function patch(file, orig, find, replace) {
  try {
    const content = fs.readFileSync(file, fsOptions)
    const patched = content.replace(find, replace)
    if (patched !== content) {
      if (orig) {
        fs.renameSync(file, orig)
      }
      fs.writeFileSync(file, patched, fsOptions)
      return true
    }
  } catch (err) {
    console.error(err)
  }
  return false
}

function restore(file, orig) {
  try {
    if (fs.existsSync(orig)) {
      fs.unlinkSync(file)
      fs.renameSync(orig, file)
      return true
    }
  } catch (err) {
    console.error(err)
  }
  return false
}

function readFile(filename) {
  return fs.readFileSync(path.join(__dirname, filename), fsOptions)
}
