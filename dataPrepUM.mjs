
import { promises as fs } from 'fs';
import { csvParse } from 'd3-dsv';

Promise.all([
  fs.readFile('./data/UM_chessboard_data.csv', 'utf8'),
])
  .then((data) => data.map((d) => csvParse(d, formatData)))
  .then((data) => fs.writeFile('./data/formattedData.json', JSON.stringify(...data)))
  .then(() => console.log('success'));

function formatData({ name, x_vals, y_vals, Year }) {
  return [
    { name, x_vals: +x_vals, y_vals, year: Year.split(" ")[0] }
  ]
}
