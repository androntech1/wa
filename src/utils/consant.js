module.exports.hasNumber = function (myString) {
  return /\d/.test(myString);
};

const getCategoryNumber = function (str) {
  let numb = str.match(/\d/g);
  return numb.join("");
};

module.exports.getCategoryName = function (str) {
  let num = Number(getCategoryNumber(str));
  console.log("getCategoryNumber(str)==", num);
  switch (num) {
    case 1:
      return "national ";
    case 2:
      return "business";
    case 3:
      return "sports";
    case 4:
      return "world";
    case 5:
      return "politics";
    case 6:
      return "technology";
    case 7:
      return "startup";
    case 8:
      return "entertainment";
    case 9:
      return "miscellaneous";
    case 10:
      return "hatke";
    case 11:
      return "science";
    case 12:
      return "automobile";
    default:
      return "";
  }
};

let title;
let content;
let singleNews;

module.exports.getFinalNews = function (newsResponse) {
  let news = "";
  newsResponse.forEach(function (element) {
    title = element.title;
    content = element.content;
    singleNews = `${title} \n\n${content}`;
    news = `${news} \n\n${singleNews}\n\n-----------`;
  });
  return news;
};

module.exports.getDateTime = function () {
  let date = new Date().toLocaleString("en-US", { timeZone: "Asia/kolkata" });
  let dateStr =
    ("00" + (date.getMonth() + 1)).slice(-2) +
    "/" +
    ("00" + date.getDate()).slice(-2) +
    "/" +
    date.getFullYear() +
    " " +
    ("00" + date.getHours()).slice(-2) +
    ":" +
    ("00" + date.getMinutes()).slice(-2) +
    ":" +
    ("00" + date.getSeconds()).slice(-2);
  return dateStr;
};
