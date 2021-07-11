const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 5000;
const QRCode = require("qrcode");
const fs = require("fs");

const { Client } = require("whatsapp-web.js");
const inshorts = require("inshorts-api");

// Path where the session data will be stored
const SESSION_FILE_PATH = "./session.json";

// Load the session data if it has been previously saved
let sessionData;
if (fs.existsSync(SESSION_FILE_PATH)) {
  sessionData = require(SESSION_FILE_PATH);
}

// Use the saved values
const client = new Client({
  session: sessionData,
});

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

// Save session values to the file upon successful auth
client.on("authenticated", (session) => {
  sessionData = session;
  fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
    if (err) {
      console.error(err);
    }
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
