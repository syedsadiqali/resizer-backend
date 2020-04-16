const express = require("express");
const bodyParser = require("body-parser");

const sharp = require("sharp");
const multer = require("multer");

const app = express();

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.use(express.static("uploads/resized"));

var upload = multer({ dest: "uploads/" });

// Add headers
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.post("/resize", upload.single("image"), function (req, res) {
  const width = parseInt(req.query.width);
  const height = parseInt(req.query.height);

  const fileName = `${req.file.originalname}-resized-${width}x${height}`;
  
  const path = `uploads/resized/${fileName}`;

  sharp(req.file.path)
    .resize({ width, height })
    .toFile(path, (err, sharp) => {
      if (err) {
        console.error(err);
      } else {
        res.status(200).json({fileName});
      }
    });
});

app.listen("8000", () => console.log(" running local server on 8000"));
