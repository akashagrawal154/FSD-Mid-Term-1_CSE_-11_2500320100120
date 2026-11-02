
const express = require("express");
const app = express();
const PORT = 3000;
app.use(express.json());

let books = [];
let issueId = 1;

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

app.put("/api/books/:id", (req, res) => {
    const id = Number(req.params.id);
    const book = books.find(b => b.id === id);
    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }
    book.title = req.body.title || book.title;
    book.author = req.body.author || book.author;
    book.category = req.body.category || book.category;
    book.quantity = req.body.quantity ?? book.quantity;
    book.available = req.body.available ?? book.available;
    res.json({ message: "Book updated successfully", book });
});

app.delete("/api/books/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = books.findIndex(b => b.id === id);
    if (index === -1) {
        return res.status(404).json({ message: "Book not found" });
    }
    if (books[index].available < books[index].quantity) {
        return res.status(400).json({
            message: "Cannot delete book. Some copies are issued."
        });
    }
    books.splice(index, 1);
    res.json({ message: "Book deleted successfully" });
});

app.get("/api/search/:id", (req, res) => {
    const id = Number(req.params.id);
    const book = books.find(b => b.id === id);
    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }
    res.json(book);
});

app.post("/api/books/:id/issue", (req, res) => {
    const id = Number(req.params.id);
    const book = books.find(b => b.id === id);
    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }
    if (book.available <= 0) {
        return res.status(400).json({ message: "Book not available" });
    }
    book.available--;
    res.json({
        message: "Book issued successfully",
        issueId: issueId++,
        book: book
    });
});

app.post("/api/books/:id/return", (req, res) => {
    const id = Number(req.params.id);
    const book = books.find(b => b.id === id);
    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }
    if (book.available >= book.quantity) {
        return res.status(400).json({ message: "All copies are already returned" });
    }
    book.available++;
    res.json({
        message: "Book returned successfully",
        book: book
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
