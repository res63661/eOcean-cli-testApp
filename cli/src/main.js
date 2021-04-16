import chalk from 'chalk'
import fs from 'fs'
import ncp from 'ncp'
import path from 'path'
import { promisify } from 'util'
import execa from 'execa'
import Listr from 'listr'
import { projectInstall } from 'pkg-install'
const access = promisify(fs.access)
const copy = promisify(ncp)

async function copyTemplateFiles(options) {
  //console.log('\nOptions: ', options)
  return copy(options.templateDirectory, options.targetDirectory, {
    clobber: false,
  })
}

async function initGit(options) {
  const result = await execa('git', ['init'], {
    cwd: options.targetDirectory,
  })
  if (result.failed) {
    return Promise.reject(new Error('Failed to initialize git'))
  }
  return
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
    await access(templateDir, fs.constants.R_OK)
  } catch (err) {
    console.error('%s Invalid template name', chalk.red.bold('ERROR'))
    console.log(err)
    process.exit(1)
  }

  // //   //Copy the templates here.
  // //   console.log('Copy project files')
  // //   await copyTemplateFiles(options).catch((err) => console.log(err))

  // //   //Update templates with tokens

  const tasks = new Listr([
    {
      title: 'Copy project files',
      task: () => copyTemplateFiles(options),
    },
    {
      title: 'Update stuff',
      task: () =>
        setTimeout(() => {
          console.log('%s Doing stuff...', chalk.blue.bold('DONE'))
        }, 3000),
      enabled: () => options.git,
    },
    // // {
    // //   title: 'Initialize git',
    // //   task: () => initGit(options),
    // //   enabled: () => options.git,
    // // },
    // // {
    // //   title: 'Install dependencies',
    // //   task: () =>
    // //     projectInstall({
    // //       cwd: options.targetDirectory,
    // //     }),
    // //   skip: () =>
    // //     !options.runInstall
    // //       ? 'Pass --install to automatically install dependencies'
    // //       : undefined,
    // // },
  ])

  await tasks.run()

  console.log('%s Project ready', chalk.green.bold('DONE'))
  return true
}
