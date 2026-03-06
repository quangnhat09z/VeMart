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
}; // [PATCH] /admin/products/change-status/:status/:id


module.exports.changeStatus = function _callee2(req, res) {
  var status, id;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          console.log(req.params);
          status = req.params.status;
          id = req.params.id;
          _context2.next = 5;
          return regeneratorRuntime.awrap(Product.updateOne({
            _id: id
          }, {
            status: status
          }));

        case 5:
          res.redirect(req.get('Referrer') || '/');

        case 6:
        case "end":
          return _context2.stop();
      }
    }
  });
}; // [PATCH] /admin/products/change-multiple-status


module.exports.changeMultipleStatus = function _callee3(req, res) {
  var type, ids;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          type = req.body.type;
          ids = req.body.ids;
          idsArray = ids.split(',').map(function (id) {
            return id.trim();
          });
          _context3.next = 5;
          return regeneratorRuntime.awrap(Product.updateMany({
            _id: {
              $in: idsArray
            }
          }, {
            status: type
          }));

        case 5:
          res.redirect(req.get('Referrer') || '/');

        case 6:
        case "end":
          return _context3.stop();
      }
    }
  });
};