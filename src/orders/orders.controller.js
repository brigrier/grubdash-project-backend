const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));
const dishes = require("../data/dishes-data")

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
            status:404,
           
            message: `OrderId ${orderId} doesnt exist`
        })
    }
}
function read(req, res, next){
    const order = res.locals.order
    res.status(200).json({data:order})
}

//PUT 
//validators
function orderIdMatch(req, res, next) {
    const { orderId } = req.params;
    const {data:{id} = {}} = req.body
    const match = orders.find((order) => order.id === orderId);
    if (id && orderId !== id) {
        next({
            status: 400,
            message: `Order id does not match route id. Order:             ${id}, Route: ${orderId}.`
        });
    } else {
        next()
    }
}


function statusCheck(req, res, next){
    const {data:{status} = {}} = req.body
    if (!status) {
        next({
            status: 400,
            message: "Order must have a status of pending, preparing, out-for-delivery, delivered"
        })
    } else if (status === "") {
        next({
            status: 400,
            message: "Order must have a status of pending, preparing, out-for-delivery, delivered"
        })
    } else if (!status === "pending") {
        next({
            status: 400,
            message: "A delivered order cannot be changed"
        })
    } else {
      next()
    }
}
//put function
function update(req, res, next) {
    const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;
    const order = res.locals.order;

    if (deliverTo) order.deliverTo = deliverTo;
    if (mobileNumber) order.mobileNumber = mobileNumber;
    if (status && !["pending", "preparing", "out-for-delivery", "delivered"].includes(status)){
      return next({  status: 400, message: "status" }); }
    
    if (dishes) order.dishes = dishes;

    res.json({ data: order });
}

//DELETE
function pendingStat(req, res, next){
//     const {data: {status} = {}} = req.body
    if (res.locals.order.status !== "pending") {
        next({
            status: 400,
            message: "An order cannot be deleted unless it is pending"
        })
    }  else {
       next()
    }
}

function destroy(req, res, next){
    const {orderId} = req.params
    const index = orders.findIndex((order) => Number(order.id) === Number(orderId))
    const remove = orders.splice(index, 1)
    res.status(204).json({data:remove})
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
    update: [
        orderExists,
        orderIdMatch,
        deliverToExists,
        deliverToEmpty,
        mobileNumEmpty,
        mobileNumExists,
        dishesExists,
        dishesIsArray,
        dishesArrayEmpty,
        dishQuantity,
        statusCheck,
        update
    ],
     destroy: [
        orderExists,
        pendingStat,
        destroy
    ],
};
