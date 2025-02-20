const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const books_routes = require('./routes/books');
const roles_routes = require('./routes/roles')

const PORT = 3000;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/books", books_routes);
app.use("/api/roles", roles_routes)

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
