const Product = require('../../models/product.model.js')
const Category = require('../../models/category.model.js')
const searchHelper = require('../../helpers/search');
const sortHelper = require('../../helpers/sort');
const paginationHelper = require('../../helpers/pagination');

// [GET]   /product
module.exports.index = async (req, res) => {

    const category_filter = {
        deleted: false,
    }
    const product_filter = {
        deleted: false,
        isBestSeller: true
    }

    let maxPriceProduct = await Product.findOne(product_filter).sort({ price: -1 }).select('price');
    let maxPrice = maxPriceProduct ? Math.ceil(maxPriceProduct.price) : 0;

    // Xử lý tìm kiếm
    const objectSearch = searchHelper(req.query);
    if (objectSearch.regex) {
        product_filter.title = objectSearch.regex;
    }
    if (objectSearch.category) {
        delete product_filter.isBestSeller;
        if (objectSearch.category === "best-sellers") {
            product_filter.isBestSeller = true;
        }
        else {
            const category = await Category.findOne({
                slug: objectSearch.category,
                deleted: false
            });
            product_filter.category_id = category._id;
            maxPriceProduct = await Product.findOne(product_filter).sort({ price: -1 }).select('price');
            maxPrice = maxPriceProduct ? Math.ceil(maxPriceProduct.price) : 0;
        }
    }
    if (objectSearch.stars) {
        product_filter.stars = { $gte: parseFloat(objectSearch.stars) };
    }
    if (objectSearch.priceMin) {
        product_filter.price = { ...product_filter.price, $gte: parseFloat(objectSearch.priceMin) };
    }
    if (objectSearch.priceMax) {
        product_filter.price = { ...product_filter.price, $lte: parseFloat(objectSearch.priceMax) };
    }
    if (objectSearch.discountPercentage) {
        const discountRange = objectSearch.discountPercentage.split('-');
        if (discountRange.length === 2) {
            const minDiscount = parseFloat(discountRange[0]) / 100;
            const maxDiscount = parseFloat(discountRange[1].replace('%', '')) / 100;
            product_filter.discountPercentage = { $gte: minDiscount, $lte: maxDiscount };
        } else if (objectSearch.discountPercentage === "More than 40%") {
            product_filter.discountPercentage = { $gt: 0.4 };
        }
    }

    // Số lượng best seller
    let isBestSellerCount = 0;
    const AllProducts = await Product.find({ deleted: false });
    const bestSellers = AllProducts.filter(product => product.isBestSeller);
    isBestSellerCount = bestSellers.length;

    // Xử lý sắp xếp
    const sortOption = sortHelper.sort(req, res);

    // Pagination
    const totalProducts = await Product.find(product_filter).countDocuments();
    const objectPagination = paginationHelper(req.query, totalProducts, "CLIENT");

    const products = await Product.find(product_filter)
        .sort(sortOption)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);

    // Lấy danh mục và đếm số lượng sản phẩm trong mỗi danh mục
    const categories = await Category.find(category_filter);
    categories.forEach(category => {
        category.productCount = AllProducts.filter(product => product.category_id.toString() === category._id.toString()).length;
        category.maxPrice = Math.ceil(Math.max(...AllProducts.filter(product => product.category_id.toString() === category._id.toString()).map(p => p.price), 0));
    });
   
    res.render("client/pages/product/index", {
        pageTitle: "List of Products",
        products: products,
        categories: categories,
        sortOption: req.query.sort || "",
        objectSearch: objectSearch,
        maxPrice: maxPrice,
        isBestSellerCount: isBestSellerCount,
        objectPagination: objectPagination
    })
}

// [GET]   /products/detail/:slug
module.exports.detail = async (req, res) => {
    const slug = req.params.slug;
    const product = await Product.findOne({
        slug: slug,
        deleted: false
    });
    // console.log(product);
    const category = await Category.findOne({
        _id: product.category_id,
        deleted: false
    })
    // console.log(category);
    res.render(`client/pages/product/viewDetail`, {
        pageTitle: "Product Detail",
        product: product,
        category: category
    })
}