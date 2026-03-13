// migrations/add-status.js
const mongoose = require("mongoose");
const Product = require("../models/product.model");

async function migrate() {
  await mongoose.connect("mongodb://localhost:27017/VeMart");

  await Product.updateMany(
    {
      description: { $exists: false }
    },
    {
      $set: {
        description:"",
      }
    }
  )

  console.log("Migration done");
  process.exit();
}

migrate();