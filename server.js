import app from "./app.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();
mongoose.connect(process.env.DATA_BASE).then(()=>{
  console.log('DataBase Is Connected ')
})
const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Server Is Running Port ${port}`);
});
