const mongoose = require('mongoose');
// const { default:mongoose } = require('mongoose');
const dbConnect = () =>{
    // const mongoURI =mongoose.connect(process.env.MONGODB_URL);
    mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Database Connected Successfully!');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
}
module.exports = dbConnect;
