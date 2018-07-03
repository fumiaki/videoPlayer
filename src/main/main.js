const {app, BrowserWindow} = require("electron")
const path = require("path")
const url = require("url")

const port = 8081

function createWindow() {
  const win = new BrowserWindow({width:800, height:640})

  win.loadURL(url.format({
    pathname: path.join(__dirname, "../renderer/index.html"),
    protocol: "file:",
    slashes: true
  }))

  //win.loadURL(`http://localhost:${port}`)
}

function listen(port) {
  const nodeStatic = require('node-static');
  const file = new nodeStatic.Server(__dirname);

  require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        file.serve(request, response);
    }).resume();
  }).listen(port);

}

function init() {
  //listen(port)
  createWindow()
}

app.on("ready", init)
