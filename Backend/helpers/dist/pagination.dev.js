"use strict";

module.exports = function (query, totalItems) {
  var limitItems = process.env.LIMIT_ITEMS_PAGINATION || 10;
  var totalPages = Math.ceil(totalItems / limitItems);
  var currentPage = parseInt(query.page);

  if (isNaN(currentPage) || currentPage < 1) {
    currentPage = 1;
  } else if (currentPage > totalPages) {
    currentPage = totalPages;
  }

  var objectPagination = {
    limitItems: limitItems,
    currentPage: currentPage,
    totalPages: totalPages,
    skip: (currentPage - 1) * limitItems
  };
  return objectPagination;
};