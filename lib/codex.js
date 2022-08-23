const { Configuration, OpenAIApi } = require('openai')
const colors = require('colors')

async function main (apiKey, text) {
  const conf = new Configuration({ apiKey })
  const openai = new OpenAIApi(conf)

  const shellPrompt =
    '#!/bin/sh\n' +
    `${text} :\n` +
    '$ '

  const resp = await openai.createCompletion({
    model: 'code-davinci-002',
    prompt: shellPrompt,
    temperature: 0,
    max_tokens: 64,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
    stop: ['\n']
  })

  resp.data.choices.forEach(choice => {
    console.log(colors.yellow(choice.text))
  })
}

// function showList (choices) {
//   const titles = choices.map((el) => el.text)
//   const options = {
//     parent: screen,
//     width: '100%',
//     height: '100%-1',
//     top: 'center',
//     left: 'center',
//     padding: 1,
//     title: 'Select Answer:'
//     // mouse: true
//   }
//   l = blessed.list(options)
//   l.setItems(titles)
// }

module.exports = { main }
