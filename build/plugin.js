let webpack = require("webpack")

export default new webpack.ProvidePlugin({
    "_": "lodash"
})