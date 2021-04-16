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
import Mustache from 'mustache'

const access = promisify(fs.access)
const copy = promisify(ncp)

const BASE_STORE_TEMPLATE_FILE_NAME = 'Schema1.js'
const BASE_SCHEMA_TEMPLATE_FILE_NAME = 'schema1.json'

function echo(title, body) {
  console.log(`\n${title}: `, body)
}

async function templateReplace(options) {
  /**Use template engine to replace keys with relevant data from
   * user selections
   */
  echo('Options', options)
  let template = fs.readFileSync(options.targetStoreFilePath, 'utf-8')
  var rendered = Mustache.render(template, { storeName: options.storeName })
  //echo('template', template)
  //echo('rendered', rendered)

  fs.writeFileSync(options.targetStoreFilePath, rendered)

  //Token replace in crud control template.
  let targetControlsDirResolved = path.join(
    options.templateControlFilePath,
    'Schema1_CRUD.vue'
  )
  targetControlsDirResolved = fixBadWindowsPathResolveDoubleDir(
    targetControlsDirResolved
  )

  //Read the file
  let crudControlTemplate = fs.readFileSync(targetControlsDirResolved, 'utf-8')
  //Token replace
  var crudControlRendered = Mustache.render(crudControlTemplate, {
    storeName: options.storeName,
  })

  fs.writeFileSync(
    path.join(options.targetControlFilePath, options.storeName + '_CRUD.vue'),
    crudControlRendered
  )
}

async function copyTemplateFiles(options) {
  //echo('Options', options)

  //Copy store to target folder.
  const templatePath = path.join(
    options.templateDirectory,
    BASE_STORE_TEMPLATE_FILE_NAME
  )

  const targetPath = path.join(
    options.targetDirectory,
    options.storeSubDirectory,
    options.storeName + '.js'
  )

  options.targetStoreFilePath = targetPath

  //console.log('\nPathing: ', templatePath, targetPath)

  copy(templatePath, targetPath, {
    clobber: false,
  })

  //Copy form layout schema json to target folder
  const templatePathSchema = path.join(
    options.schemaTemplateDir,
    BASE_SCHEMA_TEMPLATE_FILE_NAME
  )
  const targetPathSchema = path.join(
    options.targetDirectory,
    options.schemasSubDirectory,
    options.storeName + '.json'
  )

  console.log('\nPathing: ', templatePathSchema, targetPathSchema)

  return copy(templatePathSchema, targetPathSchema, {
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

async function createTargetDir(rootDir, targetDir) {
  //Calculate target dir.
  let targetDirResolved
  if (targetDir) {
    targetDirResolved = path.resolve(new URL(rootDir).pathname, targetDir)
  } else {
    targetDirResolved = path.resolve(new URL(rootDir).pathname)
  }

  //Cleanup windows err from path lib
  targetDirResolved = fixBadWindowsPathResolveDoubleDir(targetDirResolved)

  if (fs.existsSync(targetDirResolved)) return
  fs.mkdir(targetDirResolved, { recursive: true }, (err) => {
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
    storeSubDirectory: 'store',
    schemasSubDirectory: 'store/schemas',
    storeTemplateDir: '',
    schemaTemplateDir: '',
  }

  const currentFileUrl = import.meta.url

  //Calc actual template directory
  let templateDir = path.resolve(
    new URL(currentFileUrl).pathname,
    '..\\..\\templates',
    options.template.toLowerCase()
  )

  //Calc template source path for CONTROLS
  options.templateControlFilePath = path.resolve(
    new URL(currentFileUrl).pathname,
    '..\\..\\templates',
    'controls'
  )

  //Calc target file path for CONTROLS
  options.targetControlFilePath = path.resolve(
    new URL(options.targetDirectory).pathname,
    'components\\EOGenerated'
  )

  //Create target path for controls
  await createTargetDir(options.targetControlFilePath)

  //Lop off erroneous duplication of drive on windows from path.resolve()
  templateDir = fixBadWindowsPathResolveDoubleDir(templateDir)
  options.templateDirectory = templateDir //TODO factor this out
  options.storeTemplateDir = templateDir

  //Build
  options.schemaTemplateDir =
    //Calc actual template directory
    path.resolve(
      new URL(currentFileUrl).pathname,
      '..\\..\\templates',
      'schema'
    )

  //Lop off erroneous duplication of drive on windows from path.resolve()
  options.schemaTemplateDir = fixBadWindowsPathResolveDoubleDir(
    options.schemaTemplateDir
  )

  //Create target dir for store.
  await createTargetDir(options.targetDirectory, 'store')

  //Create target dir for form schemas.
  await createTargetDir(options.targetDirectory, options.schemasSubDirectory)

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
      task: () => copyTemplateFiles(options).catch((err) => console.log(err)),
    },
    {
      title: 'Apply template replacement',
      task: () => templateReplace(options).catch((err) => console.log(err)),
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
