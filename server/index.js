const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const routes = require('./routes');

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
    const connection = "mongodb+srv://vnoemi595:s1p5IrQdv5reRqIA@cluster0.wsl89.mongodb.net/book_app?retryWrites=true&w=majority&appName=Cluster0"
    await mongoose.connect(connection);
    mongoose.set("strictQuery", true);
    console.log("Connected to databse.")
}
