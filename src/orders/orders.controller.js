const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assign IDs when necessary
const nextId = require("../utils/nextId");

//GET 
function list(req, res) {
    res.json({ data: orders });
}

//POST
function deliverToExists(req, res, next) {
    const { data: { deliverTo } = {} } = req.body;
    if (!deliverTo) {
        next({
            status: 400,
            message: 'Order must include a deliverTo'
        });
    } else {
        next();
    }
}

function deliverToEmpty(req, res, next) {
    const { data: { deliverTo } = {} } = req.body;
    if (deliverTo === '') { 
        next({
            status: 400,
            message: 'Order must include a deliverTo'
        });
    } else {
        next();
    }
}

function mobileNumExists(req, res, next) {
    const { data: { mobileNumber } = {} } = req.body;
    if (!mobileNumber) {
        next({
            status: 400,
            message: 'Order must include a mobileNumber'
        });
    } else {
        next();
    }
}

function mobileNumEmpty(req, res, next) {
    const { data: { mobileNumber } = {} } = req.body;
    if (mobileNumber === '') { 
        next({
            status: 400,
            message: 'Order must include a mobileNumber'
        });
    } else {
        next();
    }
}

function dishesExists(req, res, next) {
    const { data: { dishes } = {} } = req.body;
    if (!dishes) {
        next({
            status: 400,
            message: 'Order must include a dish'
        });
    } else {
        next();
    }
}

function dishesIsArray(req, res, next) {
    const { data: { dishes } = {} } = req.body;
    if (!Array.isArray(dishes)) {
        next({
            status: 400,
            message: 'Order must include at least one dish'
        });
    } else {
        next();
    }
}

function dishesArrayEmpty(req, res, next) {
    const { data: { dishes } = {} } = req.body;
    if (dishes.length === 0) {
        next({
            status: 400,
            message: 'Order must include at least one dish'
        });
    } else {
        next();
    }
}

function dishQuantity(req, res, next) {
    const { data: { dishes } = {} } = req.body;
    
    for (let index = 0; index < dishes.length; index++) {
        if (!dishes[index].quantity || !Number.isInteger(dishes[index].quantity) || dishes[index].quantity <= 0) {
            next({
                status: 400,
                message: `dish ${index} must have a quantity that is an integer greater than 0`
            });
            return; 
        }
    }
    next();
}

function create(req, res, next) {
    const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;
    const newOrder = {
        id: nextId(), 
        deliverTo: deliverTo,
        mobileNumber: mobileNumber,
        status: status,
        dishes: dishes,
    };
    orders.push(newOrder);
    res.status(201).json({ data: newOrder });
}
//GET W ID
function orderExists(req, res, next){
    const orderId = req.params.orderId
    const foundOrder = orders.find((order)=> order.id === orderId)
    if(foundOrder){
        res.locals.order = foundOrder
        next()
    } else {
        next({
            status:404
        })
    }
}
function read(req, res, next){
    const order = res.locals.order
    res.status(200).json({data:order})
}




module.exports = {
    list,
    create: [
        deliverToExists,
        deliverToEmpty,
        mobileNumEmpty,
        mobileNumExists,
        dishesExists,
        dishesIsArray,
        dishesArrayEmpty,
        dishQuantity,
        create
    ],
    read: [
        orderExists,
        read
    ],
};
