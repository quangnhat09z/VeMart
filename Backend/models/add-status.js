// migrations/add-status.js
const mongoose = require("mongoose");
const Product = require("../models/product.model");

async function migrate() {
  await mongoose.connect("mongodb://localhost:27017/VeMart");

  await Product.updateMany(
    { listPrice: { $exists: false } },
  {
    $set: { listPrice: 0 }
  }
  );

  console.log("Migration done");
  process.exit();
}

migrate();