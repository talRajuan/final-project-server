require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path")
const usersRouter = require("./routes/usersR");
const connect = require("./utils/connect-db");
const authRouter = require("./routes/auth");
const cardsRouter = require("./routes/card");
const allCardsRouter = require("./routes/allCards");

const app = express();
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true })); //parse body that contain form data
app.use(express.json()); //parse body that contain json
app.use(cors());

/* app.get("/", (req, res) => {
  res.end("its work");
}); */

connect()
  .then(() => {
    console.log("connected work");
  })
  .catch((err) => {
    console.log(`ERROR: ${err}`);
  });

app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);
app.use("/api/allcards", allCardsRouter);
app.use("/api/cards", cardsRouter);

app.get("/myapi", (req, res) => {
  res.json({ msg: "ok" });
});

/* react */
/* app.use(express.static(path.join(__dirname,"build")))
app.get("*",(req, res)=>{
  res.sendFile(path.join(__dirname, "build", "index.html"));
}); */


console.log(process.env.EXPRESS_PORT);
const PORT = process.env.EXPRESS_PORT || 3000;
console.log("PORT", PORT);
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
