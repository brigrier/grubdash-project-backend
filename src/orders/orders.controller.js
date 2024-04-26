const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");
const { create } = require("domain");

//GET 
function list(req, res){
    res.json({data:orders})
}

//POST
function deliverToExists(req, res, next){
    const {data:{deliverTo} ={}} = req.body
    if (!deliverTo){
        next({
            status: 400,
            message: 'Order must include a deliverTo'
        })
    } else {
        next()
    }
}
function deliverToEmpty(req, res, next){
    const {data:{deliverTo} ={}} = req.body
    if (deliverTo = ''){
        next({
            status: 400,
            message: 'Order must include a deliverTo'
        })
    } else {
        next()
    }
}
function mobileNumExists(req, res, next){
    const {data:{mobileNumber} ={}} = req.body
    if (!mobileNumber){
        next({
            status: 400,
            message: 'Order must include a mobileNumber'
        })
    } else {
        next()
    }
}
function mobileNumEmpty(req, res, next){
    const {data:{mobileNumber} ={}} = req.body
    if (mobileNumber === ''){
        next({
            status: 400,
            message: 'Order must include a mobileNumber'
        })
    } else {
        next()
    }
}
function dishesExists(req, res, next){
    const {data:{dishes} ={}} = req.body
    if (!dishes){
        next({
            status: 400,
            message: 'Order must include a dish'
        })
    } else {
        next()
    }
}
function dishesIsArray(req, res, next){
    const {data:{dishes} ={}} = req.body
    if (!Array.isArray(dishes)){
        next({
            status: 400,
            message: 'Order must include at least one dish'
        })
    } else {
        next()
    }
}
function dishesArrayEmpty(req, res, next){
    const {data:{dishes} ={}} = req.body
    if (dishes.length === 0){
        next({
            status: 400,
            message: 'Order must include at least one dish'
        })
    } else {
        next()
    }
}
function dishQuantity(req, res, next){
    const {data:{dishes} ={}} = req.body
    if (dishes.quantity = ""){
        next({
            status: 400,
            message: `dish ${index} must have a quantity that is an integer greater than 0`
        })
    } else {
        next()
    }
}
function dishQuantityProp(req, res, next){
    const {data:{dishes} ={}} = req.body
    if (dishes.quantity <= 0){
        next({
            status: 400,
            message: `dish ${index} must have a quantity that is an integer greater than 0`
        })
    } else {
        next()
    }
}
function dishQuantityNum(req, res, next){
    const {data:{dishes} ={}} = req.body
    if (!Number(dishes.quantity)){
        next({
            status: 400,
            message: `dish ${index} must have a quantity that is an integer greater than 0`
        })
    } else {
        next()
    }
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
        dishQuantityProp,
        dishQuantityNum,
        dishQuantity
    ],

}