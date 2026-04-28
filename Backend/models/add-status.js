// migrations/add-status.js
const mongoose = require("mongoose");
const Product = require("../models/product.model");

async function migrate() {
  await mongoose.connect("mongodb://localhost:27017/VeMart");

  await Product.updateMany(
    {
      $or: [
        { category_id: "5" },
        { category_id: null }
      ]
    },
    {
      $set: {
        category_id: "69f0da13055fa58042a3bf2c"
      }
    }
  );

  console.log("Migration done");
  process.exit();
}

migrate();