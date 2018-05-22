const {app, BrowserWindow} = require("electron")
const path = require("path")
const url = require("url")

function createWindow() {
  win = new BrowserWindow({width:800, height:640})

  win.loadURL(url.format({
    pathname: path.join(__dirname, "index.html"),
    protpcol: "file:",
    slashes: true
  }))
}

app.on("ready", createWindow)
