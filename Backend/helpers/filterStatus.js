module.exports = () => {
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
    return filterButton;
}

