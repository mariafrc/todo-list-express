const session = require("express-session");
const FileStore = require("session-file-store")(session);
const uuid = require("uuid");

module.exports = session({
  genid: () => uuid.v4(),
  store: new FileStore(),
  secret: "keyboard cat",
  resave: false,
  saveUninitialized: false
})