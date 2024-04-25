const path = require("path");


// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

//GET
function list(req, res){
    res.json({data:dishes})
}

//POST
//validators
function namePresent(req, res, next){
    const {data:{name} = {}} = req.body
    if (!name) {
        next({
            status: 400,
            message: `Dish must include a name`
        })
    } else {
        next()
    }
}
function nameEmpty(req, res, next){
    const {data:{name} = {}} = req.body
    if (name === ""){
        next({
            status: 400,
            message: "Dish must include a name"
        })
    } else {
        next()
    }
}
function descriptionPresent(req, res, next){
    const {data:{description} = {}} = req.body
    if (!description){
        next({
            status: 400,
            message: "Dish must include a description"
        })
    } else {
        next()
    }
}
function descriptionEmpty(req, res, next){
    const {data:{description} = {}} = req.body
    if (description === ""){
        next({
            status: 400,
            message: "Dish must include a description"
        })
    } else {
        next()
    }
}
function pricePresent(req, res, next){
    const {data:{price} = {}} = req.body
    if (!price){
        next({
            status: 400,
            message: "Dish must include price"
        })
    } else {
        next()
    }
}
function priceCheck(req, res, next){
    const {data:{price} = {}} = req.body
    if(price !== Number() || price <= 0){
        next({
            status: 400,
            message: "Dish must have a price that is an integer greater than 0"
        })
    } else {
        next()
    }
}
function imagePresent(req, res, next){
    const { data: { image_url } = {} } = req.body;
    if (!image_url) {
        next({
            status: 400,
            message: "Dish must include an image_url"
        });
    } else {
        next();
    }
}

function imageEmpty(req, res, next){
    const { data: { image_url } = {} } = req.body;
    if (!image_url) {
        next({
            status: 400,
            message: "Dish must include an image_url"
        });
    } else {
        next();
    }
}

// post func
let lastId = dishes.reduce((maxId, dish) => Math.max(maxId, dish.id), 0);

function create(req, res){
    const {data:{name, description, price, image_url} = {}} = req.body
    const newDish = {
      id: ++lastId,
      name: name,
      description: description,
      price: price,
      image_url: image_url
    }
    dishes.push(newDish)
    res.status(201).json({data: newDish})
}




module.exports = {
    list,
    create: [
        namePresent,
        nameEmpty,
        descriptionPresent,
        descriptionEmpty,
        pricePresent,
        priceCheck,
        imagePresent,
        imageEmpty,
        create
    ],
}