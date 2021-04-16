import arg from 'arg'
//import { create } from 'core-js/core/object'
import inquirer from 'inquirer'
import { createProjectII } from './main'

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      '--git': Boolean,
      '--yes': Boolean,
      '--install': Boolean,
      '-g': '--git',
      '-y': '--yes',
      '-i': '--install',
      '--add:store': Boolean,
      '--name': String,
      '--debug': Boolean,
    },
    {
      argv: rawArgs.slice(2),
    }
  )
  return {
    skipPrompts: args['--yes'] || false,
    git: args['--git'] || false,
    //template: args._[0],
    //runInstall: args['--install'] || false,
    command: args['--add:store'] ? 'add:store' : '',
    storeName: args['--name'] || '',
    debug: args['--debug'] || false,
  }
}

async function promptForMissingOptions(options) {
  const defaultTemplate = 'JavaScript'
  if (options.skipPrompts) {
    return {
      ...options,
      template: options.template || defaultTemplate,
    }
  }

  const questions = []
  if (!options.template) {
    questions.push({
      type: 'list',
      name: 'template',
      message: 'Please choose which project template to use',
      choices: ['JavaScript', 'TypeScript'],
      default: defaultTemplate,
    })
  }

  if (!options.git) {
    questions.push({
      type: 'confirm',
      name: 'git',
      message: 'Initialize a git repository?',
      default: false,
    })
  }

  const answers = await inquirer.prompt(questions)
  return {
    ...options,
    template: options.template || answers.template,
    git: options.git || answers.git,
  }
}

async function promptForEOXOptions(options) {
  const questions = []
  questions.push({
    type: 'input',
    name: 'storeName',
    message: 'Enter a name for your store',
    default: 'generated-store',
  })

  const answers = await inquirer.prompt(questions)
  return {
    ...options,
  }
}

export async function cli(args) {
  let options = parseArgumentsIntoOptions(args)

  //Prompt for options.
  //options = await promptForMissingOptions(options)
  options = await promptForEOXOptions(options)

  if (options.debug) console.log(options)

  //Execute the steps
  //await createProject(options)
  await createProjectII(options)
}
