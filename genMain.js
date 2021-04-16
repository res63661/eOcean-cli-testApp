const prompt = require('node-ask').prompt
const confirm = require('node-ask').confirm
const multiline = require('node-ask').multiline

const asks = {
  name: '',
  description: '',
}

var readline = require('readline')

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

rl.question('What do you think of node.js? ', function (answer) {
  console.log('Thank you for your valuable feedback:', answer)

  rl.close()
})

prompt('What is your name? ')
  .then(function (answer) {
    console.log('Your name is', answer)
    asks.name = answer
    return confirm('Are you living? ')
  })
  .then(function (answer) {
    console.log('You ' + (answer ? 'are' : 'are not') + ' living')

    return multiline('Describe yourself:')
  })
  .then(function (answer) {
    asks.description = answer
    console.log('You described yourself as:', answer)
  })
