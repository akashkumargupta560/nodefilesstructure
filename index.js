const express = require("express");
const dbConnect = require("./config/dbConnect");
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 4000;
const userRouter = require("./routes/userinfo");
const productRouter = require("./routes/product");
const bodyParser = require("body-parser");
const { notFound, errorHandler } = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const morgon = require("morgan");
const cors = require("cors");
app.use(cors({ origin: 'http://localhost:3000' }));
dbConnect();

app.use(morgon("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

//declear api here
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);

// Middleware setup Error Handling declear here
app.use(notFound);
app.use(errorHandler);

//port declear here 
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});







// const userRouter = require('./routes/userinfo');
// const dbConnect = require("./config");
// const bodyParser = require("body-parser");
// const cors = require('cors');
// const morgan = require("morgan");

// // Initialize express app


// // Middleware setup
// app.use(cors());
// app.use(morgan("dev"));
// app.use(bodyParser.json());

// // Connect to database
// dbConnect();

// // Define routes
// app.use('/api/user', userRouter);

// // Define port
// const port = process.env.PORT || 3000;

// // Start the server
// app.listen(port, () => {
//   console.log(`Server is listening on port ${port}`);
// });
