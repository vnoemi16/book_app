const express = require('express');
const mongoose = require('mongoose');

const books_router = express.Router();

const Book = mongoose.model("books", mongoose.Schema(
    {
        title: { type: String, required: true },
        authors: { type: [String], required: true },
        published: { type: Date, required: true },
        description: { type: String, required: true },
        genres: { type: [String], required: true }
    }
)
);

books_router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const book = await Book.findById(id);
        res.status(200).json(book);
    }
    catch (e) {
        res.status(500).json({ message: "An error has occured", error: e });
    }
});


books_router.get("/", async (req, res) => {
    try {
        const { title, author, dateOrder, titleOrder, o, genres } = req.query;

        const filter = {};
        if (title) {
            filter.title = { $regex: title, $options: "i" };
        }
        if (author) {
            filter.authors = { $regex: author, $options: "i" };
        }
        if (genres) {
            filter.genres = { $in: genres.split(",") };
        }
        if (dateOrder && o) {
            const books = await Book.find(filter).sort({ published: Number(o) });
            res.status(200).json(books);
        }
        if (titleOrder && o) {
            const books = await Book.find(filter).sort({ title: Number(o) });
            res.status(200).json(books);
        }
        const books = await Book.find(filter);
        res.status(200).json(books)
    }
    catch (e) {
        res.status(500).json({ message: "An error has occured", error: e });
    }
});


books_router.post("/", async (req, res) => {
    try {
        const book = new Book(req.body);
        const saved = await book.save();
        res.status(200).json(saved);
    }
    catch (e) {
        res.status(500).json({ message: "An error has occured", error: e });
    }
});


books_router.put("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const book = new req.body;
        const updated = await Book.findOneAndUpdate({ _id: id }, { $set: book }, { new: true })
        res.status(200).json(updated);
    }
    catch (e) {
        res.status(500).json({ message: "An error has occured", error: e });
    }
});


books_router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const deleted = await Book.deleteOne({ _id: id });
        res.status(200).json(deleted);
    }
    catch (e) {
        res.status(500).json({ message: "An error has occured", error: e });
    }
})


module.exports = books_router;