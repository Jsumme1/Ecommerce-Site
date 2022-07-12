const express = require("express");
const cartsRepo = require("../repositories/carts")
const productsRepo = require("../repositories/products");
const cartShowTemplate = require ('../views/carts/show')


const router = express.Router();

// receive a post request to add an item to a cart
router.post('/cart/products', async(req, res) => {
    // figure out the cart - does it exist, do we need to make?
    let cart;
    if(!req.session.cartId) {
        // we dont have a cart, need to create one and store the cartId on tje req.session.cart.Id
       cart = await cartsRepo.create({items: []});
        req.session.cartId = cart.id;
    } else {
    // we have a cart and need to get it
       cart = await cartsRepo.getOne(req.session.cartId) 
    
    }
    // either increment existing product or add to products array;
 const existingItem = cart.items.find(item =>  item.id === req.body.productId)
 if(existingItem) {
    // increment quantity and save cart
    existingItem.quantity++;
 } else {
    // add new product id to items array
    cart.items.push({id: req.body.productId, quantity: 1});

 }

 await cartsRepo.update(cart.id, {
    items: cart.items
});

    res.redirect('/cart');
})

// receive a get request to show all items in a cart

router.get('/cart', async (req, res) => {
    // make sure user has cart first
    if(!req.session.cartId) {
        return res.redirect('/');
    }

    const cart = await cartsRepo.getOne(req.session.cartId);
    for (let item of cart.items) {
        const product = await productsRepo.getOne(item.id);
        item.product = product;
    }

    res.send(cartShowTemplate({items: cart.items}));
});

//  receive a post request to delete an item from a cart

router.post("/cart/products/delete", async (req, res) => {
    const { itemId} = req.body;
    const cart = await cartsRepo.getOne(req.session.cartId);

    const items = cart.items.filter(item => item.id !==itemId );

    await cartsRepo.update(req.session.cartId, {items});

    res.redirect('/cart');

});

module.exports = router;
