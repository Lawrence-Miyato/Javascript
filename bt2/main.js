// Huỳnh Ngọc Bảo - 2180606923
let Product = function (id, name, cost, price, tax, quantity) {
    this.id = this.id
    this.name = name;
    this.cost = cost;
    this.price = price;
    this.tax = tax;
    this.quantity = quantity;
};
let product1 = new Product("NB01", "chuột", 100, 120, 0.5, 10);
let product2 = new Product("NB02", "bàn phím", 200, 250, 0.5, 20);
let product3 = new Product("NB03", "lót chuột", 150, 200, 0.5, 15);
let product4 = new Product("NB04", "màn hình", 300, 450, 0.5, 0);

let products = [product1, product2, product3, product4];

let result_1 = products.map(function (product) {
    return (product.price * (1 + product.tax) - product.cost) * product.quantity;
});

let result_2 = products.filter(function (product) {
    return (
        product.cost * product.quantity >
        (product.price * (1 + product.tax) - product.cost) * product.quantity
    );
});

let result_3 = products.reduce(function (sum, product) {
    return (sum += product.price * (1 + product.tax) * product.quantity);
}, 0);

let result_4 = products.every(function (product) {
    return (
        product.cost * product.quantity <
        (product.price * (1 + product.tax) - product.cost) * product.quantity
    );
});

let result_5 = products.some(function (product) {
    return product.quantity < 1;
});