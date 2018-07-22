const vscode = require('vscode')
const fs = require('fs')
const path = require('path')

const appDir = path.dirname(require.main.filename)
const fsOptions = { encoding: 'utf8' }

const patches = {
  'vs/code/electron-main/main.js': [
    // Change the Electron titleBarStyle to "hidden-inset"
    [
      '.titleBarStyle="hidden",',
      '.titleBarStyle="hidden-inset",'
    ]
  ],
  'vs/workbench/workbench.main.js': [
    // Never show the TITLEBAR_PART when "window.titleBarStyle" === "custom" 
    [
      'TITLEBAR_PART:return"custom"===this.getCustomTitleBarStyle()&&!h.isFullscreen()',
      'TITLEBAR_PART:return false'
    ],
    // Read and set the activitybar width from the CSS variable
    [
      '"activitybarWidth",{get:function(){return',
      `"activitybarWidth",{get:function(){if("custom"===this.themeService.configurationService.getValue().window.titleBarStyle)this.partLayoutInfo.activitybar.width=parseInt(window.getComputedStyle(document.documentElement).getPropertyValue("--traffic-light-width"), 10);return`
    ]
  ],
  'vs/workbench/workbench.main.css': [
    // Add our CSS modifications to the end of the main file
    [
      /$/g, // Append to the end of the file
      readFile('workbench.main.css')
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
    const file = path.join(appDir, ...filePath.split('/'))
    const orig = `${file}.orig`
    if (enable) {
      let backup = true
      for (const [find, replace] of filePatches) {
        if (patch(file, backup && orig, find, replace)) {
          backup = false
          applied++
        }
        total++
      }
    } else {
      const amount = filePatches.length
      // See if the file has been patched with all the patches.
      let found = 0
      for (const [find, replace] of filePatches) {
        if (contains(file, replace)) {
          found++
        }
      }
      // Only restore if all the patches were found. If not, then VSCode must
      // have been updated in the meantime, in which case the orig file needs
      // to be removed.
      if (found === amount && restore(file, orig)) {
        applied += amount
      } else {
        remove(orig)
      }
      total += amount
    }
  }
  return {
    success: applied === total,
    applied,
    total
  }
}

function patch(file, orig, find, replace) {
  try {
    const content = fs.readFileSync(file, fsOptions)
    if (content.indexOf(replace) === -1) {
      const patched = content.replace(find, replace)
      if (patched !== content) {
        if (orig) {
          fs.renameSync(file, orig)
        }
        fs.writeFileSync(file, patched, fsOptions)
        return true
      }
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

function remove(file) {
  try {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file)
      return true
    }
  } catch (err) {
    console.error(err)
  }
  return false
}

function contains(file, str) {
  try {
    const content = fs.readFileSync(file, fsOptions)
    if (content.indexOf(str) !== -1) {
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
