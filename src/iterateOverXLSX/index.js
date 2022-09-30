const { WebDriver } = require("selenium-webdriver")
const { BLING_BOOKS_CATEGORY_ID } = require("../../constants")
const { goToProductsPage } = require("../goToProductsPage")
const { filterByCategory, iterateOverPage, goToNextPage } = require("./functions")

/**
 * 
 * @param {WebDriver} driver 
 * @param {{
 *  id_shop: string,
 *  bling_category: string,
 *  bling_previous_category: string,
 *  id_bling_category: string,
 *  new_category: string
 *  id_new_category: string
 * }[]} xslxData 
 */
const iterateOverXLSX = async (driver, xslxData) => {
  for(let i = 0; i < xslxData.length; i++) {
    const row = xslxData[i]
    let categoryList = [BLING_BOOKS_CATEGORY_ID]
    if(row.bling_previous_category !== null) categoryList.push(
      xslxData
        .filter(xlsxRow => xlsxRow.bling_category === row.bling_previous_category)[0]
        .id_bling_category
    )
    categoryList.push(row.id_bling_category)
    if(categoryList.length != 3) {
      categoryList = categoryList.filter((id, idx, self) => self.indexOf(id) === idx)
    }
    console.log(`Buscando a categoria: ${row.bling_category}`)
    await goToProductsPage(driver)
    await filterByCategory(driver, categoryList)

    let paginate = true
    while(paginate) {
      await iterateOverPage(driver, row.id_shop, row.id_new_category)
      paginate = await goToNextPage(driver)
    }
  }
}

exports.iterateOverXLSX = iterateOverXLSX
