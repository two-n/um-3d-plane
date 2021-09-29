
const fs = require('fs').promises;
const d3 = require('d3')

Promise.all([
  fs.readFile('./data/UM_chessboard_data.csv', 'utf8'),
])
  .then((data) => data.map((d) => d3.csvParse(d, formatData)))
  .then((data) => fs.writeFile('./data/formattedData.json', JSON.stringify(...data)))
  .then(() => console.log('success'));

function formatData({ name, x_vals, y_vals, year }) {
  return [
    { name, x_vals, y_vals, year }
  ]
}
