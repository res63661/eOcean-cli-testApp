/**Adapted from
 * https://www.twilio.com/blog/how-to-build-a-cli-with-node-js
 */
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
  // //   return copy(options.templateDirectory, options.targetDirectory, {
  // //     clobber: false,
  // //   })
  const templatePath = path.join(options.templateDirectory, 'Schema1.js')
  const targetPath = path.join(
    options.targetDirectory,
    options.storeName + '.js'
  )

  console.log('\nPathing: ', templatePath, targetPath)

  return copy(templatePath, targetPath, {
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

async function createTargetDir(targetDir) {
  fs.mkdir(targetDir, (err) => {
    if (err) {
      return console.error(err)
    }
    console.log('Directory created successfully!')
  })
}

export async function createProjectII(options) {
  options = {
    ...options,
    targetDirectory: options.targetDirectory || process.cwd(),
    template: 'store',
  }

  const currentFileUrl = import.meta.url

  //Calc actual template directory
  let templateDir = path.resolve(
    new URL(currentFileUrl).pathname,
    '..\\..\\templates',
    options.template.toLowerCase()
  )

  //Calculate target dir.
  let targetDir = path.resolve(
    new URL(options.targetDirectory).pathname,
    'store'
  )

  //Lop off erroneous duplication of drive on windows from path.resolve()
  templateDir = fixBadWindowsPathResolveDoubleDir(templateDir)
  options.templateDirectory = templateDir

  targetDir = fixBadWindowsPathResolveDoubleDir(targetDir)
  options.targetDirectory = targetDir

  //Create target dir.
  await createTargetDir(targetDir)

  //Check access on template file
  try {
    await access(templateDir, fs.constants.R_OK)
  } catch (err) {
    console.error('%s Invalid template name', chalk.red.bold('ERROR'))
    console.log(err)
    process.exit(1)
  }

  //Enact listr workflows
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

    /**Use the below as ref code to run processes */
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
