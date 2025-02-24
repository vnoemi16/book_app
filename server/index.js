const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const routes = require('./routes');

require('dotenv').config();

const PORT = 3000;
const app = express();

app.use(cors(
    {
        origin: "http://localhost:4200",
        methods: "GET,POST,PUT,DELETE",
        allowedHeaders: "Content-Type,Authorization"
      }
));
app.use(express.json());

app.use("/api", routes);

app.get("/", (req, res) => {
    res.send("Hello");
})

app.listen(PORT, (error) => {
    if (!error){
        console.log("Server is listening at port", PORT);
    }
    else{
        console.log("An error has occured:", error);
    }
});

main().catch((error) => console.log(error));

async function main(){
    const connection = process.env.MONGODB_CONNECTION;
    await mongoose.connect(connection);
    mongoose.set("strictQuery", true);
    console.log("Connected to databse.")
}
