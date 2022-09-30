const { WebDriver, By, until } = require("selenium-webdriver")
const { BLING_FILTER_OPEN_ID, BLING_OPEN_CATEGORIES_ID, BLING_FILTER_BUTTON_CSS, BLING_CHECK_ALL_ON_PAGE_CSS, BLING_VINCULATE_PAGE_ID, BLING_MODAL_WAIT_ID, BLING_SHOP_LIST_ID, BLING_INCLUDE_CATEGORY_BTN_CSS, BLING_NEXT_PAGE_CSS, BLING_REMOVE_ALL_SELECTED_CSS, BLING_CONTENT_FILTER_ID } = require("../../constants")

/**
 * 
 * @param {WebDriver} driver 
 * @param {string[]} idBlingCategories
 */
const filterByCategory = async (driver, idBlingCategories) => {
  const openFilterBtn = await driver.findElement(By.id(BLING_FILTER_OPEN_ID))
  
  if(await openFilterBtn.isDisplayed()) {
    await openFilterBtn.click()
  }

  console.log("Abrindo lista de categorias")
  await driver.findElement(By.id(BLING_OPEN_CATEGORIES_ID)).click()

  await findCategoryOnTree(driver, idBlingCategories)
  await driver.findElement(By.css(BLING_FILTER_BUTTON_CSS)).click()
}

/**
 * 
 * @param {WebDriver} driver 
 * @param {string[]} idBlingCategories 
 */
const findCategoryOnTree = async (driver, idBlingCategories) => {
  const lim = idBlingCategories.length
  let tries = 0
  for(let i = 0; i < lim; i++) {
    console.log(`Procurando a categoria: ${idBlingCategories[i]}`)
    try {
      const option = await driver
        .findElement(
          By.css(`li[data-id='${idBlingCategories[i]}']${i !== lim - 1 ? " > span" : ""}`)
        )
      await option.click()
      if(!(await (await option.getAttribute("class")).includes("selected"))) 
        throw Error("ClickFailedError")
    }
    catch(err) {
      if(err.name === "NoSuchElementError" || err.name === "ClickFailedError") {
        console.log(err)
        if(tries === 10) throw Error(`Categoria ${idBlingCategories[i]} não encontrada na lista`)
        await driver.findElement(By.id(BLING_CONTENT_FILTER_ID)).click()
        await driver.findElement(By.id(BLING_OPEN_CATEGORIES_ID)).click()
        i = -1
        tries++
      }
    }
  }
}

/**
 * 
 * @param {WebDriver} driver 
 * @param {string} shopId
 * @param {string} categoryId 
 */
const iterateOverPage = async (driver, shopId, categoryId) => {
  await waitForWaitingModal(driver)
  await driver.findElement(By.css(BLING_CHECK_ALL_ON_PAGE_CSS)).click()
  await driver.findElement(By.id(BLING_VINCULATE_PAGE_ID)).click()
  await driver.sleep(1000)
  await driver.findElement(By.id(BLING_SHOP_LIST_ID)).click()
  await driver.findElement(By.css(`option[idloja='${shopId}']`)).click()
  await waitForWaitingModal(driver)
  await driver
    .findElement(By.css(`tr[idcategoriaproduto='${categoryId}'] > td > div > div > label`))
    .click()
  await driver.findElement(By.css(BLING_INCLUDE_CATEGORY_BTN_CSS)).click()
  await waitForSuccess(driver)
}

/**
 * 
 * @param {WebDriver} driver 
 */
const waitForWaitingModal = async (driver) => {
  await driver.sleep(2000)
  try {
    await driver.wait(until.elementIsNotVisible(
      driver.findElement(By.id(BLING_MODAL_WAIT_ID))
    ))
  }
  catch(err) {}
}

/**
 * 
 * @param {WebDriver} driver 
 */
const waitForSuccess = async (driver) => {
  await driver.sleep(2000)
  await driver
    .wait(until.elementLocated(By.css(BLING_INCLUDE_CATEGORY_BTN_CSS)))
    .click()
}

/**
 * 
 * @param {WebDriver} driver 
 */
const goToNextPage = async (driver) => {
  try {
    const nextPageBtn = await driver.findElement(By.css(BLING_NEXT_PAGE_CSS))
    await driver.findElement(By.css(BLING_REMOVE_ALL_SELECTED_CSS)).click()
    if(await (await nextPageBtn.getAttribute("class")).includes("disabled")) return false

    await driver.executeScript(
      "arguments[0].click()",
      nextPageBtn
    )
    return true
  } catch (err) {
    return false
  }
}

exports.filterByCategory = filterByCategory
exports.iterateOverPage = iterateOverPage
exports.goToNextPage = goToNextPage
