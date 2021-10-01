# um-3d-plane
data visualizations for UM 3d plane

### `yarn install`
goes through and installs all dependencies

### `yarn dev`
compiles code and starts a developement server at `http://localhost:1234`.

### `yarn build` or `yarn prototypes-build`
builds static, compiled filed in `dist` folder. Use `prototypes-build` when building for two-n prototype deployment because it sets the correct base URL to be able to load in the assets.

### `yarn deploy`
to deploy to [two-n prototypes site](http://prototypes.two-n.com/UM-3d-plane/).

### `node ./dataPrep.mjs`
parses csv file named `UM_Chessboard_Data.csv` in `./data` folder and creates a json file called `formattedData.json` that is read into `./src/globals/data`

*requirements for generating data*
* csv must be named `UM_Chessboard_Data.csv`
* csv must have the following column format: name,x_values,z_values,y_values,year
* `name` data must be capitalized to match in-app dictionaries for color and images (e.g. "Accenture")
* `z_values` and `y_values` must be swapped in the csv after receiving them from the client due to the way three.js draws on the canvas
