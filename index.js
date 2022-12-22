console.clear();
const express = require("express");
const { default: mongoose } = require("mongoose");
const multer = require("multer");
const colour = require("colour");
require("dotenv").config();

const app = express();
// body te data asle parse korar jonno
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());

const port = 5000;

// connecting to DB
const MongoDBURL = process.env.DBURL;

const connectDB = async () =>{
  try {
    await mongoose.connect
    (MongoDBURL);
    console.log("DB is connected".blue);
  } catch (error) {
    console.log("DB is not connected".red);
    console.log(error);
    process.exit(1);
  }
};

app.get("/", (req, res) => {
    res.status(200).send('Home Route')
});
app.get("/register", (req, res) => {
    res.status(200).sendFile(__dirname + "/index.html")
});

// creating schema and model
const userSchema = new mongoose.Schema({
  name : {
    type: String,
    require: [true, "user name is required"]
  },
  image : {
    type: String,
    require: [true, "user image is required"]
  }
});

const User = mongoose.model("files", userSchema);

//  file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/")
    },
    filename: function (req, file, cb) {
      const name = Date.now() + "-" + file.originalname;
      cb(null, name);
    },
  });
  
  const upload = multer({ storage: storage })

  app.post("/register", upload.single("image"), async (req, res) => {
    try {
      const newUser = new User({
        name: req.body.name,
        image: req.file.filename,
      })
      await newUser.save();
      res.status(201).send(newUser);
    } catch (error) {
      res.status(500).send(error.message);
    }
});
// get route
// it's in testing purpose
app.get("/getdata", async (req, res) =>{
  try {
    const data = await User.find();
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
// 👆 for just testing. Maybe i will remove it later
app.listen(port, async () =>{
    console.log(`Server is running at http://localhost:${port}`.green);
    await connectDB();
});