const inquirer = require('inquirer')
const colors = require('colors')

async function question (msg) {
  const { q } = await inquirer.prompt([{
    name: 'q',
    message: msg,
    type: 'list',
    choices: ['Yes', 'No']
  }])
  return q === 'Yes'
}

async function ask () {
  if (await question('Do you have an OpenAI API Key and access to the OpenAI Codex beta ?')) {
    const { apiKey } = await inquirer.prompt([{ name: 'apiKey', message: 'Paste your OpenAI API Key (find it here https://beta.openai.com/account/api-keys):' }])
    console.log('apiKey:', apiKey)
    if (await question('Would you like to always use OpenAI Codex instead of StackOverflow?')) {
      console.log(`OpenAI Codex set as default. You can revert it with ${colors.yellow('how2 --set-default stackoverflow')}`)
    }
  } else {
    // TODO
  }
}

ask()
