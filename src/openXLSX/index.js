const ExcelJS = require("exceljs")

const openXLSX = async (xlsxFilename) => {
  const xlsxData = []
  const wb = new ExcelJS.Workbook()
  await wb.xlsx.readFile(xlsxFilename)

  const sheet = wb.getWorksheet(1)

  sheet.eachRow((row, idx) => {
    if(idx === 1) return
    xlsxData.push({
      id_shop: String(row.getCell(3).value),
      bling_category: String(row.getCell(1).value),
      id_bling_category: String(row.getCell(2).value),
      new_category: String(row.getCell(5).value),
      id_new_category: String(row.getCell(4).value)
    })
  })

  xlsxData.forEach(row => {
    const categories = row.bling_category.split(">>")
    row.bling_previous_category = categories.length === 3 ? categories[1] : null
    row.bling_category = categories.pop()
  })

  return xlsxData
}

exports.openXLSX = openXLSX
