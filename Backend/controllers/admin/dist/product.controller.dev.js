"use strict";

var Product = require('../../models/product.model.js');

var filterStatusHelperFn = require('../../helpers/filterStatus');

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
          return regeneratorRuntime.awrap(Product.find(filter).sort({
            price: "asc"
          }).limit(objectPagination.limitItems).skip(objectPagination.skip));

        case 10:
          products = _context.sent;
          res.render("admin/pages/product/index", {
            pageTitle: "Quản lý sản phẩm",
            products: products,
            filterStatus: filterStatusHelperFn(),
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
          req.flash('success', 'Status updated successfully.');
          res.redirect(req.get('Referrer') || '/');

        case 7:
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

          if (!(type !== "delete-all")) {
            _context3.next = 8;
            break;
          }

          _context3.next = 6;
          return regeneratorRuntime.awrap(Product.updateMany({
            _id: {
              $in: idsArray
            }
          }, {
            status: type
          }));

        case 6:
          _context3.next = 10;
          break;

        case 8:
          _context3.next = 10;
          return regeneratorRuntime.awrap(Product.updateMany({
            _id: {
              $in: idsArray
            }
          }, {
            deleted: true,
            deletedAt: new Date()
          }));

        case 10:
          res.redirect(req.get('Referrer') || '/');

        case 11:
        case "end":
          return _context3.stop();
      }
    }
  });
}; // [DELETE] /admin/products/delete/:id


module.exports.deleteItem = function _callee4(req, res) {
  var id;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          id = req.params.id; // await Product.deleteOne({ _id: id });        

          _context4.next = 3;
          return regeneratorRuntime.awrap(Product.updateOne({
            _id: id
          }, {
            deleted: true,
            deletedAt: new Date()
          }));

        case 3:
          res.redirect(req.get('Referrer') || '/');

        case 4:
        case "end":
          return _context4.stop();
      }
    }
  });
}; // [PATCH] /admin/products/soft-delete/:id
// module.exports.softDeleteItem = async (req, res) => {
//     const id = req.params.id;
//     await Product.updateOne({ _id: id }, { deleted: true });
//     res.redirect(req.get('Referrer') || '/');
// }