const express = require("express");
const app = express();
require("colors");

// setup body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// setup cors
const cors = require("cors");
app.use(cors());

// create pg client
const { Pool } = require("pg");

const {
  PG_USER,
  PG_PASSWORD,
  PG_HOST,
  PG_PORT,
  PG_DATABASE,
  REDIS_HOST,
  REDIS_PORT,
} = require("./keys");

console.log(
  {
    PG_USER,
    PG_PASSWORD,
    PG_HOST,
    PG_PORT,
    PG_DATABASE,
    REDIS_HOST,
    REDIS_PORT,
  }
);

const pgClient = new Pool({
  host: PG_HOST,
  port: PG_PORT,
  database: PG_DATABASE,
  user: PG_USER,
  password: PG_PASSWORD,
});

pgClient.on("error", () => {
  console.log(`log pg connection`.bgRed);
});

pgClient.query("CREATE TABLE IF NOT EXISTS values(number INT)").catch((err) => {
  console.log(`error:${err.message}`.bgRed);
});

// redis client setup
const redis = require("redis");
const errorHandler = require("./middleware/error_handler");
const asyncHandler = require("./middleware/async_handler");

const redisClient = redis.createClient({
  socket: {
    host: REDIS_HOST,
    port: REDIS_PORT,
  },
});

const redisPublisher = redisClient.duplicate();

(async () => {
  try {
    await pgClient.connect();
    await redisClient.connect();
    await redisPublisher.connect();
    console.log("connected to databases")
  } catch (error) {
    console.log(`connection error:${error.message}`)
    console.log(error);
  }
})();

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    data: null,
    message: "server is running...",
  });
});

app.get("/values/all",asyncHandler(async (req, res) => {
  try {
    const values = await pgClient.query("SELECT * from values");

    res.status(200).json({
      success: true,
      data: values.rows,
      message: "values are fetched successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      message: error.message || "server error",
    });
  }
}));

app.get("/values/current",asyncHandler(async (req, res) => {
  try {
    const values = await redisClient.hGetAll("values");
    res.status(200).json({
      success: true,
      data: values,
      message: "current values are fetched successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      message: error.message || "server error",
    });
  }
}));

app.post("/values",asyncHandler(async (req, res) => {
  try {
    const { index } = req.body;

    if (parseInt(index) > 40) {
      return res.status(422).json({
        success: false,
        data: null,
        message: "index is too large to process.",
      });
    }

    redisClient.hSet("values", index, "nothing yet");
    redisPublisher.publish("insert", index);
    pgClient.query("INSERT INTO values(number) VALUES($1)", [index]);

    res.status(201).json({
      success: true,
      data: null,
      message: "new value is updated successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      message: error.message || "server error",
    });
  }
}));


app.use(errorHandler)

const PORT = 5000;
const server = app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`.bgGreen);
});

process.on("unhandledRejection", (err) => {
  console.error(`server error:${err.message}`.bgRed);
  server.close();
  process.exit(1);
});
