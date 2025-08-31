import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();
const PORT = 3000;

app.use(cors()); // allow requests from Svelte frontend
app.use(express.json());

// GET all apartments
app.get("/api/listings", (req, res) => {
  const data = JSON.parse(fs.readFileSync("./backend/data.json", "utf-8"));
  res.json(data);
});

// GET one apartment by objektnummer
app.get("/api/listings/:id", (req, res) => {
  const data = JSON.parse(fs.readFileSync("./backend/data.json", "utf-8"));
  const listing = data.find((item) => item.objektnummer === req.params.id);
  if (listing) {
    res.json(listing);
  } else {
    res.status(404).json({ error: "Listing not found" });
  }
});

// GET one apartment by published and objectId
app.get("/api/listings/:published/:objectId", (req, res) => {
  const data = JSON.parse(fs.readFileSync("./backend/data.json", "utf-8"));
  console.log(`Searching for listing with published: ${req.params.published} and objectId: ${req.params.objectId}`);
  const listing = data.find(
    (item) =>
      item.published === req.params.published &&
      item.objectId === req.params.objectId
  );
  if (listing) {
    res.json(listing);
  } else {
    res.status(404).json({ error: "Listing not found" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
