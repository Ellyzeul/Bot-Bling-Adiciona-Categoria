const { BLING_PASSWORD_ID, BLING_URL, BLING_USERNAME_ID, BLING_ACCOUNT_MENU_ID } = require("../../constants")
const { WebDriver, By, until } = require("selenium-webdriver")

/**
 * 
 * @param {WebDriver} driver 
 * @param {string} username 
 * @param {string} password 
 */
const makeLogin = async (driver, username, password) => {
  await driver.get(BLING_URL)

  const userField = await driver.findElement(By.id(BLING_USERNAME_ID))
  userField.sendKeys(username)

  const passField = await driver.findElement(By.id(BLING_PASSWORD_ID))
  passField.sendKeys(password)

  await driver.findElement(By.css("#login-buttons-site > button")).click()

  await driver.sleep(5000)
}

exports.makeLogin = makeLogin
