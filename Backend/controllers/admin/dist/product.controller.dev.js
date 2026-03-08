"use strict";

var Product = require('../../models/product.model.js');

var filterStatusHelperFn = require('../../helpers/filterStatus');

var searchHelper = require('../../helpers/search');

var paginationHelper = require('../../helpers/pagination');

var systemConfig = require('../../config/system.js');

var fs = require('fs').promises; // Thêm dòng này ở đầu file


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
          return regeneratorRuntime.awrap(Product.find(filter) // .sort({ price: "asc" })
          .limit(objectPagination.limitItems).skip(objectPagination.skip));

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
            _context3.next = 9;
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
          req.flash('success', 'Status updated successfully.');
          _context3.next = 12;
          break;

        case 9:
          _context3.next = 11;
          return regeneratorRuntime.awrap(Product.updateMany({
            _id: {
              $in: idsArray
            }
          }, {
            deleted: true,
            deletedAt: new Date()
          }));

        case 11:
          req.flash('success', 'Items deleted successfully.');

        case 12:
          res.redirect(req.get('Referrer') || '/');

        case 13:
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
          id = req.params.id;
          _context4.next = 3;
          return regeneratorRuntime.awrap(Product.updateOne({
            _id: id
          }, {
            deleted: true,
            deletedAt: new Date()
          }, {
            timestamps: false
          } // Ngăn cập nhật updatedAt
          ));

        case 3:
          req.flash('success', 'Item deleted successfully.');
          res.redirect(req.get('Referrer') || '/');

        case 5:
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
// [GET] /admin/products/create


module.exports.create = function _callee5(req, res) {
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          res.render("admin/pages/product/create", {
            pageTitle: "Create Product"
          });

        case 1:
        case "end":
          return _context5.stop();
      }
    }
  });
}; // [POST] /admin/products/store


module.exports.store = function _callee6(req, res) {
  var uploadedFilename, productData, numericDefaults, product, filePath;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          uploadedFilename = null;
          _context6.prev = 1;
          // console.log('Received file data:', req.file);
          productData = req.body;
          numericDefaults = ['listPrice', 'boughtInLastMonth', 'reviews', 'discountPercentage'];
          numericDefaults.forEach(function (field) {
            if (!productData[field] || productData[field] === '') {
              productData[field] = 0;
            } else {
              productData[field] = Number(productData[field]);

              if (isNaN(productData[field])) {
                productData[field] = 0;
              }
            }
          });
          productData.isBestSeller = productData.isBestSeller === 'true' || productData.isBestSeller === true; //  Xử lý file ảnh với validation

          if (req.file) {
            uploadedFilename = req.file.filename;
            productData.imgUrl = "/uploads/".concat(req.file.filename);
          } else {
            productData.imgUrl = '';
          }

          if (!(!productData.title || !productData.title.trim())) {
            _context6.next = 9;
            break;
          }

          throw new Error('Tên sản phẩm là bắt buộc');

        case 9:
          product = new Product(productData);
          _context6.next = 12;
          return regeneratorRuntime.awrap(product.save());

        case 12:
          req.flash('success', 'Tạo sản phẩm thành công');
          res.redirect("".concat(systemConfig.prefixAdmin, "/products"));
          _context6.next = 32;
          break;

        case 16:
          _context6.prev = 16;
          _context6.t0 = _context6["catch"](1);

          if (!uploadedFilename) {
            _context6.next = 29;
            break;
          }

          _context6.prev = 19;
          filePath = "./public/uploads/".concat(uploadedFilename);
          _context6.next = 23;
          return regeneratorRuntime.awrap(fs.unlink(filePath));

        case 23:
          console.log("Deleted orphaned file: ".concat(uploadedFilename));
          _context6.next = 29;
          break;

        case 26:
          _context6.prev = 26;
          _context6.t1 = _context6["catch"](19);
          console.error("Failed to delete file ".concat(uploadedFilename, ":"), _context6.t1);

        case 29:
          console.error('Store error:', _context6.t0);
          req.flash('error', 'Lỗi tạo sản phẩm: ' + _context6.t0.message);
          res.redirect(req.get('Referrer') || "".concat(systemConfig.prefixAdmin, "/products/create"));

        case 32:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[1, 16], [19, 26]]);
};