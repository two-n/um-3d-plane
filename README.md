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

### node ./dataPrep.mjs
parses csv file and creates data object that is read into /.src/globals/data
csv must have the following format: name,x_values,y_values,z_values,year

*notes on columns*
`name` data must be capitalized to match in-app dictionaries for color and images (e.g. "Accenture")
`z_values` and `y_values` must be swapped in the csv after receiving them from the client due to the way three.js draws on the canvas
