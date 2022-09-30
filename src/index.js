const { WebDriver } = require("selenium-webdriver")
const { iterateOverXLSX } = require("./iterateOverXLSX")
const { makeLogin } = require("./makeLogin")
const { openXLSX } = require("./openXLSX")

/**
 * 
 * @param {WebDriver} driver 
 * @param {string} username 
 * @param {string} password 
 * @param {string} xlsxFilename 
 */
const runRobot = async (driver, username, password, xlsxFilename) => {
  console.log("Lendo o arquivo Excel...")
  let xlsxData = null
  openXLSX(xlsxFilename)
    .then(response => xlsxData = response)

  console.log("Realizando o login")
  try {
    await makeLogin(driver, username, password)
  
    while(true) if(xlsxData !== null) break
  
    await iterateOverXLSX(driver, xlsxData)
  }
  catch (err) {
    if(
      err.name === "NoSuchSessionError" ||
      err.name === "NoSuchWindowError"  ||
      err.name === "WebDriverError"
    ) console.log("Navegador foi fechado")
    else console.log(err)
  }

  console.log("Encerrando o bot...")
  await driver.close()
}

exports.runRobot = runRobot
