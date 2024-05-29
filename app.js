const express = require('express');
const app = express();
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { xss } = require("express-xss-sanitizer");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const mongoSanitize = require("express-mongo-sanitize");

//Load environment files
dotenv.config({ path: "./config/config.env" });

app.use(express.json());

connectDB();

//Dev logging middleware
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// Trust the X-Forwarded-* headers
app.set("trust proxy", 2);

//Rate limit
const IP_WHITELIST = (process.env.IP_WHITELIST || "").split(",");

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 500, // Limit each IP to 500 requests per 10 mins
  standardHeaders: true, //Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the 'X-RateLimit-*' headers
  skip: (request, response) => IP_WHITELIST.includes(request.ip),
});

app.use(limiter);

//Sanitize data
app.use(mongoSanitize());

//Set security headers
app.use(helmet());

//Prevent XSS attacks
app.use(xss());

//Prevent http param pollution
app.use(hpp());

//CORS

const whitelist = ['http://localhost:4000']; 

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(cors(corsOptions));

// app.use(cors());

//Routes
const todoRoutes = require('./routes/todo.routes');

//Mount Routes
app.use("/todos", todoRoutes);

//Health
app.get("/health", (req, res) => {
    res.status(200).json({
      status: "ok",
    });
  });
  

app.use((error, req, res, next) => {
    console.log(error);
    res.status(500).json({message: error.message});
});

app.get("/", (req, res) => {
    res.json("Hello World!");
});

module.exports = app;
