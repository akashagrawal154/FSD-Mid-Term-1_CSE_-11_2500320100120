const express = require("express");
const app = express();
const PORT = 3000;
app.use(express.json());
let books = [];
app.post("/books", (req, res) => {
    const newBook = {
        id: books.length,
        title: req.body.title,
        author: req.body.author,
        category: req.body.category,
        quantity: req.body.quantity,
        available: req.body.quantity
    };
    books.push(newBook);
    res.status(201).json(newBook);
});
app.get("/api/books", (req, res) => {
    res.json(books);
});
app.get("/api/books/:id", (req, res) => {
    const id = Number(req.params.id);
    const book = books.find(b => b.id === id);
    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }
    res.json(book);
});
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
