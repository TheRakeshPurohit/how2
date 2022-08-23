const os = require('os')
const path = require('path')
const colors = require('colors')
const fs = require('fs')
const { argv } = require('yargs')
  .boolean('i')
  .boolean('a')
  .boolean('h')
  .alias('h', 'help')

const how2 = require('./how2')
const codex = require('./codex')

const LANGS = ['python', 'javascript', 'ruby', 'perl', 'php', 'c++', 'zsh']
const how2Version = require('../package.json').version

const HELP = `how2 version ${how2Version}
usage: how2 [-l python/ruby/etc.] "search string"\n
$ how2 ${colors.yellow('read file while is changing\n')}
$ how2 ${colors.blue('-l python ')} ${colors.yellow('permutations of a list')}\n
$ how2 ${colors.blue('-a')} ${colors.yellow('unzip file.tar.bz2')} ${colors.red('# uses OpenAI to complete text')}\n
$ how2 ${colors.blue('--set-default openai')} ${colors.red('# set default method to OpenAI')}\n
`

function help () {
  console.log(HELP)
  process.exit(0)
}

function checkTextContainsLang (text) {
  const lower = text.toLowerCase()
  const detectedLang = LANGS.find((lang) => lower.indexOf(lang) !== -1)

  if (detectedLang) {
    console.log(colors.red(`You should use the option ${colors.blue('-l')} to specify the language.`))
    console.log(`example: $ how2 ${colors.blue(`-l ${detectedLang}`)} search text\n`)
  }

  return detectedLang
}

function readConf (confPath) {
  try {
    const conf = fs.readFileSync(confPath, { encoding: 'utf8', flag: 'r' })
    console.log('conf:', conf)
    return JSON.parse(conf)
  } catch (exc) {
    if (exc.code !== 'ENOENT') console.error(exc)
    return null
  }
}

function main () {
  // Read conf file
  const confPath = path.join(os.homedir(), '.how2.json')
  const conf = readConf(confPath)

  // Print help
  if (argv._.length === 0 || argv.h) {
    help()
  }
  const text = argv._.join(' ')
  let lang = argv.l

  // Check -l is used properly
  if (!lang) {
    lang = checkTextContainsLang(text)
  }

  if (argv.i) {
    // interactive mode
    how2.interactiveMain(text, lang)
  } else if (argv.a) { // OpenAI
    if (!conf) {
      console.error(`Must set OpenAI apiKey in ${confPath}`)
      process.exit(1)
    }
    if (!conf.codex || !conf.codex.apiKey) {
      console.error(`Cannot find codex.apiKey in ${confPath}`)
      process.exit(1)
    }
    codex.main(conf.codex.apiKey, text)
  } else {
    // normal mode
    how2.main(text, lang)
  }
}

main()
