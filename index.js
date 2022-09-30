const { Builder, Browser } = require('selenium-webdriver')
const { argv } = require('process')
const { runRobot } = require('./src')

if(argv.length !== 5) throw Error("Total de parâmetros incorretos")

const [_0, _1, username, password, xlsxFilename] = argv

console.log("Inicializando o navegador")
const driver = new Builder()
  .forBrowser(Browser.FIREFOX)
  .build()

try{
  runRobot(driver, username, password, xlsxFilename)
}
catch(e) {
  console.log(e)
}
