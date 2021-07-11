const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 5000;
var QRCode = require("qrcode");

const { Client } = require("whatsapp-web.js");
const client = new Client();
const inshorts = require("inshorts-api");

const {
  hasNumber,
  getCategoryName,
  formatNews,
  getFinalNews,
  getDateTime,
} = require("./utils/consant");
const { defaultMessage } = require("./utils/default");

let languageCode = "en";
let isHindi = false;

let newsOptions = {
  lang: "en",
  category: "national",
  numOfResults: 10,
};

app
  .use(express.static(path.join(__dirname, "public")))
  .set("views", path.join(__dirname, "views"))
  .set("view engine", "ejs")
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/qr", (req, res) => {
  client.on("qr", (qr) => {
    // Generate and scan this code with your phone
    console.log("QR RECEIVED", qr);
    QRCode.toDataURL(qr, function (err, url) {
      res.render("index", { qrCode: url, now: getDateTime() });
    });
  });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("message", (msg) => {
  let message = msg.body.toLocaleLowerCase();
  console.log(message);

  languageCode = message.indexOf("hindi") !== -1 ? "hi" : "en";

  if (message.includes("morning")) {
    msg.reply("Good Morning 😊");
  }

  if (message === "news") {
    //Show intro msg
    msg.reply(defaultMessage);
  }
  //check if news has category
  if (message.includes("news") && hasNumber(message)) {
    try {
      console.log("languageCode=>", languageCode);
      newsOptions.category = getCategoryName(message);
      newsOptions.lang = languageCode;
      console.log(JSON.stringify(newsOptions));
      //call inshorts api
      inshorts.get(newsOptions, function (result) {
        msg.reply(getFinalNews(result));
      });
    } catch (error) {
      console.log(error);
    }
  }
});

client.initialize();
