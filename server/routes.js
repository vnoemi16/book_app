const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

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

const Role = mongoose.model("roles", mongoose.Schema(
    {
        user_id: { type: String, required: true },
        role: { type: String, required: true }
    }
)
);

const Review = mongoose.model("reviews", mongoose.Schema(
    {
        user_id: { type: String, required: true },
        username: { type: String, required: true },
        book_id: { type: String, required: true },
        stars: { type: Number, required: true, min: 1, max: 5 },
        review: { type: String, required: false },
        date: { type: Date, required: true }
    }
)
);

const Genre = mongoose.model("genres", mongoose.Schema(
    {
        genre: { type: String, required: true },
        color: { type: String, required: true },
    }
)
);

const Favorite = mongoose.model("favorites", mongoose.Schema(
    {
        user_id: { type: String, required: true },
        book_id: { type: String, required: true }
    }
));


// könyv lekérdezése id alapján
router.get("/books/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const book = await Book.findById(id);
        res.status(200).json(book);
    }
    catch (e) {
        res.status(500).json({ message: "An error has occured", error: e });
    }
});

// könyv átlagos értékelése
router.get("/books/:id/average", async (req, res) => {
    try {
        const { id } = req.params;
        const ratings = await Review.find({ book_id: id });
        if (ratings.length === 0) {
            return res.status(200).json({ averageRating: 0 });
        }
        const average = ratings.reduce((acc, rating) => acc + rating.stars, 0) / ratings.length;
        res.status(200).json({ averageRating: average.toFixed(2) });
    } catch (e) {
        res.status(500).json({ message: "An error has occured", error: e });
    }
});

// könyv legfrissebb értékelései
router.get("/books/:id/reviews", async (req, res) => {
    try {
        const { id } = req.params;
        const reviews = await Review.find({ book_id: id }).sort({ published: -1 }).limit(10);
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: "Error occurred while fetching ratings", error });
    }
});

// könyvek lekérdezése keresési feltételek alapján
router.get("/books", async (req, res) => {
    try {
        const { title, author, order, o, genres, page = 1, limit = 20 } = req.query;

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
        if (order === "date" && o) {
            const books = await Book.find(filter).sort({ published: Number(o) }).skip((parseInt(page) - 1) * parseInt(limit));;
            const allBooksCount = await Book.countDocuments(filter);
            const pages = Math.ceil(allBooksCount / parseInt(limit));
            return res.status(200).json({ books: books, pages: pages });
        }
        if (order === "title" && o) {
            const books = await Book.find(filter).sort({ title: Number(o) }).skip((parseInt(page) - 1) * parseInt(limit));
            const allBooksCount = await Book.countDocuments(filter);
            const pages = Math.ceil(allBooksCount / parseInt(limit));
            return res.status(200).json({ books: books, pages: pages });
        }
        const books = await Book.find(filter).skip((parseInt(page) - 1) * parseInt(limit));
        const allBooksCount = await Book.countDocuments(filter);
        const pages = Math.ceil(allBooksCount / parseInt(limit));
        res.status(200).json({ books: books, pages: pages });

    }
    catch (e) {
        res.status(500).json({ message: "An error has occured", error: e });
    }
});

// könyv hozzáadása
router.post("/books", async (req, res) => {
    try {
        const book = new Book({ ...req.body, authors: req.body.authors.split(", ") });
        const saved = await book.save();
        res.status(200).json(saved);
    }
    catch (e) {
        res.status(500).json({ message: "An error has occured", error: e });
    }
});

// könyv módosítása
router.put("/books/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const book = { ...req.body, authors: req.body.authors.split(",") };
        const updated = await Book.findOneAndUpdate({ _id: id }, { $set: book }, { new: true })
        res.status(200).json(updated);
    }
    catch (e) {
        res.status(500).json({ message: "An error has occured", error: e });
    }
});

// könyv törlése
router.delete("/books/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const deleted = await Book.findByIdAndDelete(id);
        res.status(200).json(deleted);
    }
    catch (e) {
        res.status(500).json({ message: "An error has occured", error: e });
    }
});


// jogosultság lekérdezése
router.get("/roles/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const role = await Role.findOne({ user_id: id });
        res.status(200).json(role);
    }
    catch (e) {
        res.status(500).json({ message: "An error has occured", error: e });
    }
});

// jogosultság hozzáadása
router.post("/roles", async (req, res) => {
    try {
        const role = new Role(req.body);
        const saved = await role.save();
        res.status(200).json(saved);
    }
    catch (e) {
        res.status(500).json({ message: "An error has occured", error: e });
    }
});


// értékelés hozzáadása
router.post("/reviews", async (req, res) => {
    try {
        const review = new Review({ ...req.body, date: new Date() });
        const saved = await review.save();
        res.status(200).json(saved);
    }
    catch (e) {
        res.status(500).json({ message: "An error has occured", error: e });
    }
});


// műfajok lekérdezése
router.get("/genres", async (req, res) => {
    try {
        const genres = await Genre.find();
        res.status(200).json(genres);
    }
    catch (e) {
        res.status(500).json({ message: "An error has occured", error: e });
    }
});

// műfaj hozzáadása
router.post("/genres", async (req, res) => {
    try {
        const genre = new Genre(req.body);
        const saved = await genre.save();
        res.status(200).json(saved);
    }
    catch (e) {
        res.status(500).json({ message: "An error has occured", error: e });
    }
});

// felhasználó listájának lekérdezése
router.get("/favorites/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const favorites = await Favorite.find({ user_id: id });
        res.status(200).json(favorites);
    }
    catch (e) {
        res.status(500).json({ message: "An error has occured", error: e });
    }
});

// listához adás
router.post("/favorites", async (req, res) => {
    try {
        const favorite = new Favorite(req.body);
        const saved = await favorite.save();
        res.status(200).json(saved);
    }
    catch (e) {
        res.status(500).json({ message: "An error has occured", error: e });
    }
});

// listából törlés
router.delete("/favorites/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const deleted = await Favorite.findByIdAndDelete(id);
        res.status(200).json(deleted);
    }
    catch (e) {
        res.status(500).json({ message: "An error has occured", error: e });
    }
});


module.exports = router;