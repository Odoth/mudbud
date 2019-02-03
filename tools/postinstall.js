let fs = require("fs-extra");

let flnameConfigClient = "configClient.js"
let flnameConfigClientDefault = "configClient.default.js"

let flnameConfigServer = "configServer.js"
let flnameConfigServerDefault = "configServer.default.js"

// To be run from package root, paths accordingly
fs.createReadStream("node_modules/socket.io-client/dist/socket.io.slim.js").pipe(fs.createWriteStream('static/public/socket.io.slim.js'));
fs.createReadStream("node_modules/jquery/dist/jquery.min.js").pipe(fs.createWriteStream('static/public/jquery.min.js'));

fs.createReadStream("node_modules/jquery-ui-dist/jquery-ui.min.js").pipe(fs.createWriteStream('static/public/jquery-ui.min.js'));
fs.createReadStream("node_modules/jquery-ui-dist/jquery-ui.min.css").pipe(fs.createWriteStream('static/public/jquery-ui.min.css'));
fs.copySync("node_modules/jquery-ui-dist/images", "static/public/images");

fs.createReadStream("node_modules/bootstrap/dist/js/bootstrap.min.js").pipe(fs.createWriteStream('static/public/bootstrap.min.js'));
fs.createReadStream("node_modules/bootstrap/dist/css/bootstrap.min.css").pipe(fs.createWriteStream('static/public/bootstrap.min.css'));

fs.createReadStream("node_modules/xterm/dist/xterm.js").pipe(fs.createWriteStream('static/public/xterm.js'));
fs.createReadStream("node_modules/xterm/dist/xterm.css").pipe(fs.createWriteStream('static/public/xterm.css'));

// Don't want to overwrite existing config file if any
if (!fs.existsSync(flnameConfigClient)) {
    fs.createReadStream(flnameConfigClientDefault).pipe(fs.createWriteStream(flnameConfigClient));
    console.log("Copying " + flnameConfigClientDefault + " to " + flnameConfigClient);
}

if (!fs.existsSync(flnameConfigServer)) {
    fs.createReadStream(flnameConfigServerDefault).pipe(fs.createWriteStream(flnameConfigServer));
    console.log("Copying " + flnameConfigServerDefault + " to " + flnameConfigServer);
}
