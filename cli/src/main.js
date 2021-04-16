import chalk from 'chalk'
import fs from 'fs'
import ncp from 'ncp'
import path from 'path'
import { promisify } from 'util'

const access = promisify(fs.access)
const copy = promisify(ncp)

async function copyTemplateFiles(options) {
  console.log('\nOptions: ', options)
  return copy(options.templateDirectory, options.targetDirectory, {
    clobber: false,
  })
}

function fixBadWindowsPathResolveDoubleDir(path) {
  if (path.substr(0, 3) === path.substr(3, 3)) {
    return path.substr(3, path.length - 3)
  }
  return path
}

export async function createProject(options) {
  options = {
    ...options,
    targetDirectory: options.targetDirectory || process.cwd(),
  }

  const currentFileUrl = import.meta.url
  const urlPath = new URL(currentFileUrl).pathname

  let templateDir = path.resolve(
    new URL(currentFileUrl).pathname,
    '..\\..\\templates',
    options.template.toLowerCase()
  )

  //Lop off erroneous duplication of drive on windows
  templateDir = fixBadWindowsPathResolveDoubleDir(templateDir)
  options.templateDirectory = templateDir

  try {
    console.log('Template dir:', templateDir)
    console.log('Current file url:', currentFileUrl)
    console.log(' url:', urlPath)
    console.log(
      'Resolve Current file url:',
      path.resolve(
        currentFileUrl,
        '..\\..\\templates',
        options.template.toLowerCase()
      )
    )
    console.log('__dirname', __dirname)

    const url = require('url')
    console.log('\nurl.fileURLToPath: ', url.pathToFileURL(urlPath))
    //url.pathToFileURL(path)

    console.log('\nSubstr: ', templateDir.substr(0, 3))
    console.log('\nSubstr: ', templateDir.substr(3, 3))
    if (templateDir.substr(0, 3) === templateDir.substr(3, 3)) {
      templateDir = templateDir.substr(3, templateDir.length - 3)
    }
    console.log('\nNew TemplateDir: ', templateDir)

    await access(templateDir, fs.constants.R_OK)
  } catch (err) {
    console.error('%s Invalid template name', chalk.red.bold('ERROR'))
    console.log(err)
    process.exit(1)
  }

  console.log('Copy project files')
  await copyTemplateFiles(options).catch((err) => console.log(err))

  console.log('%s Project ready', chalk.green.bold('DONE'))
  return true
}
