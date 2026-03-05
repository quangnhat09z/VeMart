"use strict";

var Product = require('../../models/product.model.js');

var filterStatusHelper = require('../../helpers/filterStatus')();

var searchHelper = require('../../helpers/search');

var paginationHelper = require('../../helpers/pagination');

module.exports.index = function _callee(req, res) {
  var filter, objectSearch, totalProducts, objectPagination, products;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          filter = {
            deleted: false
          };

          if (req.query.status) {
            filter.status = req.query.status;
          }

          objectSearch = searchHelper(req.query);

          if (objectSearch.regex) {
            filter.title = objectSearch.regex;
          } // pagination


          _context.next = 6;
          return regeneratorRuntime.awrap(Product.countDocuments(filter));

        case 6:
          totalProducts = _context.sent;
          objectPagination = paginationHelper(req.query, totalProducts); // console.log(objectPagination);
          // lọc sản phẩm + phân trang 

          _context.next = 10;
          return regeneratorRuntime.awrap(Product.find(filter).limit(objectPagination.limitItems).skip(objectPagination.skip));

        case 10:
          products = _context.sent;
          res.render("admin/pages/product/index", {
            pageTitle: "Quản lý sản phẩm",
            products: products,
            filterStatus: filterStatusHelper,
            searchValue: objectSearch.keyword,
            pagination: objectPagination
          });

        case 12:
        case "end":
          return _context.stop();
      }
    }
  });
};