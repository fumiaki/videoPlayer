// export
module.exports = Object.assign(
  {},
  require("./base"),
  require("./cvt"),
  require("./filter2D"),
  require("./blur"),
  require("./edge"),
  require("./morph"),
  require("./pyramid"),
  require("./hough"),
  require("./track"),
  require("./etc"),

  require("./mymodules"),
)
