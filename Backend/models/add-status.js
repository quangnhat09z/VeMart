// migrations/add-status.js
const mongoose = require("mongoose");
const Product = require("../models/product.model");

async function migrate() {
  await mongoose.connect("mongodb://localhost:27017/VeMart");

  await Product.updateMany(
    { status: { $exists: false } },
    { status: "active" }
  );

  console.log("Migration done");
  process.exit();
}

migrate();