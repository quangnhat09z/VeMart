// [GET]   /admin/products

const Product = require('../../models/product.model.js')

module.exports.index = async (req, res) => {
    console.log(req.query);
    let filterButton = [
        {
            name: "All",
            status: "",
            class:"active"
        },
        {
            name: "Active",
            status: "active",
            class:""
        },
        {
            name: "Inactive",
            status: "inactive",
            class:""
        }
    ]

    // Lọc cơ bản
    let filter = {
        deleted: false,
    }
    // Thêm trường hợp
    if (req.query.status) {
        filter.status = req.query.status;
    }
    let search = "";
    if (req.query.search) {
        search = req.query.search.trim(); // Xóa space đầu và cuối
        const regex = new RegExp(search, 'i'); // 'i' ko phân biệt chữ hoa chữ thường
        filter.title = regex; 
    }
    
    

    const products = await Product.find(filter);
    // console.log(products);
    res.render("admin/pages/product/index", {
        pageTitle: "Quản lý sản phẩm",
        products: products,
        filterStatus: filterButton,
        searchValue: search
    })
}