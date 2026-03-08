// migrations/add-status.js
const mongoose = require("mongoose");
const Product = require("../models/product.model");

async function migrate() {
  await mongoose.connect("mongodb://localhost:27017/VeMart");

  await Product.updateMany(

    {

      $set: {
        createdAt: new Date("2026-03-06T00:00:00Z")
      }

    }
  )

  console.log("Migration done");
  process.exit();
}

migrate();