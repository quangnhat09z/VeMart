"use strict";

// migrations/add-status.js
var mongoose = require("mongoose");

var Product = require("../models/product.model");

function migrate() {
  return regeneratorRuntime.async(function migrate$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(mongoose.connect("mongodb://localhost:27017/VeMart"));

        case 2:
          _context.next = 4;
          return regeneratorRuntime.awrap(Product.updateMany({
            status: {
              $exists: false
            }
          }, {
            $set: {
              status: "active"
            }
          }));

        case 4:
          console.log("Migration done");
          process.exit();

        case 6:
        case "end":
          return _context.stop();
      }
    }
  });
}

migrate();