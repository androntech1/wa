const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 5000;
var QRCode = require("qrcode");
express()
  .use(express.static(path.join(__dirname, "public")))
  .set("views", path.join(__dirname, "views"))
  .set("view engine", "ejs")
  .get("/", (req, res) => {
    QRCode.toDataURL("I am a pony!", function (err, url) {
      res.render("index", { qrCode: url });
    });
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
