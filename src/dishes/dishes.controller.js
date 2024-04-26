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
function priceCheck(req, res, next) {
    const { data: { price } = {} } = req.body;
    if (typeof price !== "number" || price <= 0) {
        next({
            status: 400,
            message: "Dish must have a price that is a positive number"
        });
    } else {
        next();
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
function create(req, res){
    const {data:{name, description, price, image_url} = {}} = req.body
    const newDish = {
      id: nextId(),
      name: name,
      description: description,
      price: price,
      image_url: image_url
    }
    dishes.push(newDish)
    res.status(201).json({data: newDish})
}

//GET W ID 
function dishExists(req, res, next) {
    const dishId = req.params.dishId;
    const foundDish = dishes.find((dish) => dish.id === dishId);
    if (foundDish) {
        res.locals.dish = foundDish;
        next();
    } else {
        next({
            status: 404,
            message: `Dish with ID ${dishId} does not exist`
        });
    }
}


function read(req, res) {
    let dish = res.locals.dish;
    res.status(200).json({ data: dish });
}

//PUT
//extra error checkers
function idExists(req, res, next) {
    const dishId = req.params.dishId;
    const foundDish = dishes.find((dish) => dish.id === dishId);
    if (foundDish) {
        res.locals.dish = foundDish;
        next();
    } else {
        next({
            status: 404,
            message: `Dish does not exist: ${dishId}`
        });
    }
}

function idMatch(req, res, next) {
    const dishId = req.params.dishId;
    const { data: { id } = {} } = req.body;

    if (id && dishId !== id) {
        next({
            status: 400,
            message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`
        });
    } else {
        next();
    }
}

function update(req, res, next) {
    const { data: { name, description, price, image_url } = {} } = req.body;
    const dish = res.locals.dish;

    if (name) dish.name = name;
    if (description) dish.description = description;
    if (price) dish.price = price;
    if (image_url) dish.image_url = image_url;

    res.json({ data: dish });
}



//DELETE
function destroy(req, res, next) {
    const dishId = req.params.dishId;
    const index = dishes.findIndex((dish) => dish.id === dishId);
    console.log(typeof dishes[0].id, typeof dishId)
    if (index > -1) {
        dishes.splice(index, 1);
        res.sendStatus(204);
    } else {
        next({
            status: 405
        });
    }
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
    read: [
        dishExists,
        read
    ],
    update: [
        dishExists,
        namePresent,
        nameEmpty,
        descriptionPresent,
        descriptionEmpty,
        pricePresent,
        priceCheck,
        imagePresent,
        imageEmpty,
        idExists,
        idMatch,
        update
    ],
}