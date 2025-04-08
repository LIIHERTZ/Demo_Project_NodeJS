module.exports.priceNewProduct = (products) => {
    products.forEach(item =>{
        item.priceNew = Math.ceil(item.price * (100 - item.discountPercentage)/100).toFixed(0);
    });
    return products;
};

module.exports.priceProduct = (item) => {
    const priceNew = item.priceNew = Math.ceil(item.price * (100 - item.discountPercentage)/100).toFixed(0);
    return parseInt(priceNew);
};

