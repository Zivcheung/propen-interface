let webpack = require("webpack")

module.exports=new webpack.ProvidePlugin({
    "_": "lodash"
})