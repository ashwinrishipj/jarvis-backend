const fetch = require("node-fetch");

const firstdigit = (number) => {
  while (number >= 10) number /= 10;
  return number;
};

const Pixabay = (keyword) => {
  var API_KEY = "15071280-4e3db6fe3ff8390e13b2cdfe5";
  var URL =
    "https://pixabay.com/api/?key=" +
    API_KEY +
    "&q=" +
    encodeURIComponent(keyword);

  return fetch(URL)
    .then((response) => {
      return response.json();
    })
    .then((res) => {
      if (res.total !== (0 || null)) {
        var imageUrls = [];
        var data = {};
        for (var i = 0; i < 5; i++) {
          var widthNumber = res.hits[i].imageWidth;
          var heightNumber = res.hits[i].imageHeight;
          data = {
            src: res.hits[i].imageURL,
            width: firstdigit(widthNumber) / 2,
            height: firstdigit(heightNumber) / 2,
          };
          imageUrls.push(data);
          console.log("imageurls", imageUrls);
        }
        return imageUrls;
      } else {
        throw error(res);
      }
    })
    .catch((err) => {
      console.log("pixabay error", err);
      return 0;
    });
};

const Unsplash = (Keyword) => {
  const client_id =
    "04ef34af0d8524c97d17ff1bfe9e132596c0a4439229e6da1c3b8e0b31e9eb31";
  var query = Keyword;

  return fetch(
    `https://api.unsplash.com/search/photos?client_id=${client_id}&query=${query}`
  )
    .then((response) => {
      return response.json();
    })
    .then((res) => {
      if (res.results[0].urls.thumb !== (null || "")) {
        var imageUrls = [];
        var data = {};
        for (var i = 0; i < 10; i++) {
          var widthNumber = res.results[i].width;
          var heightNumber = res.results[i].height;
          data = {
            src: res.results[i].urls.regular,
            width: firstdigit(widthNumber),
            height: firstdigit(heightNumber),
          };
          imageUrls.push(data);
        }
        return imageUrls;
      } else {
        throw error(res);
      }
    })
    .catch((err) => {
      console.log("unsplash error", err);
      return 0;
    });
};

module.exports = { Pixabay, Unsplash };
