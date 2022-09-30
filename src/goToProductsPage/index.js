const { WebDriver, By, until } = require("selenium-webdriver")
const { BLING_PRODUCTS_URL, BLING_MODAL_WAIT_ID } = require("../../constants")

/**
 * 
 * @param {WebDriver} driver 
 */
const goToProductsPage = async (driver) => {
  await driver.get("https://www.bling.com.br/dashboard")
  await driver.getCurrentUrl() !== BLING_PRODUCTS_URL
  ? await driver.get(BLING_PRODUCTS_URL)
  : await driver.navigate().refresh()
  await driver.sleep(5000)

  try {
    await driver.wait(until.elementIsNotVisible(
      driver.findElement(By.id(BLING_MODAL_WAIT_ID))
    ))
  }
  catch(err) {
    if(err.name !== "StaleElementReferenceError") {
      console.log(err)
      throw new Error("Problema ao carregar a tela de produtos")
    }
  }
}

exports.goToProductsPage = goToProductsPage
