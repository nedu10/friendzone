const mongoose = require("mongoose");

const connectDb = () => {
  try {
    console.log("process.env.MONGO_URL >> ", process.env.MONGO_URL);
    mongoose
      .connect(process.env.MONGO_URL, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(
        () => {
          console.log("Database Successfully Connected");
        },
        (error) => {
          console.log(error);
        }
      );

    //     mongoose.connect("mongodb://127.0.0.1:27017/SUCCESS",{
    //         useCreateIndex:true,
    //         useNewUrlParser: true,
    //         useUnifiedTopology: true}).then(()=> {
    // console.log('Database Successfully Connected')},error =>{
    // console.log(error)})

    mongoose.Promise = global.Promise;
    console.info("Connected the the database 🙂");
  } catch (error) {
    // res.json({
    //   status: 400,
    //   message: "Unable to connect ❌ to the database 😞",
    // });
    console.log({
      message: "Unable to connect ❌ to the database 😞",
      error,
    });
  }
};

module.exports = connectDb;
