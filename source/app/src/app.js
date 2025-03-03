const express = require('express');
const nunjucks = require('nunjucks');
const path = require('path');
const {sum} = require("nunjucks/src/filters");

// ---------------------------------------------------------------------------------------------------------------------
// Express app initialization
// ---------------------------------------------------------------------------------------------------------------------

const app = express();

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../public')));

const env = nunjucks.configure(path.join(__dirname, 'views'), {
    autoescape: true,
    express: app
});

app.set('view engine', 'html');

app.use(express.urlencoded({extended: true}));


// ---------------------------------------------------------------------------------------------------------------------
// Utils
// ---------------------------------------------------------------------------------------------------------------------
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ---------------------------------------------------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------------------------------------------------

const products = [
    {
        id: 100,
        image: "/products/imgs/half_eaten_burger.jpg",
        name: "Burger (Half Eaten)",
        description: "I only took 5 bites of the burger. Tastes gooood!",
        price: 10
    },
    {
        id: 101,
        image: "/products/imgs/used_toothpick.jpg",
        name: "Toothpick (Used, Like New)",
        description: "You might need it if you buy the burger!",
        price: 10
    },
    {
        id: 102,
        image: "/products/imgs/used_toothbrush.jpg",
        name: "Toothbrush (Used for 15 years)",
        description: "Better than the toothpick! I don't need it anymore ... because I lost all my teeth.",
        price: 20
    },
    {
        id: 103,
        image: "/products/imgs/land_on_the_moon.jpg",
        name: "The Moon",
        description: "I am the businessman from the little prince and I am selling the moon for 50 bucks. It's a perfect for space lovers.",
        price: 50
    },
    {
        id: 99999,
        image: "/products/imgs/flag.jpg",
        name: "FLAG obtained from @HACK 2025",
        description: "I did NOT register on time, but I managed to get this flag. I am selling it here for $2025.",
        price: 2025
    },


]

// ---------------------------------------------------------------------------------------------------------------------
// Live Data
// ---------------------------------------------------------------------------------------------------------------------

let balance = 2024;

let cart = [];

function cartTotal() {
    return cart.reduce((sum, item) => sum + item.price, 0);
}

let purchases = [];

function purchasesTotal() {
    return purchases.reduce((sum, item) => sum + item.price, 0);
}

// ---------------------------------------------------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------------------------------------------------
let isLocked = false;

// Middleware to lock the route
function lockRoute(req, res, next) {
    if (isLocked) {
        // If the route is locked, send a 503 Service Unavailable response
        return res.status(503).send('This operation is currently locked. Please try again later.');
    }

    isLocked = true;
    next();
}

// ---------------------------------------------------------------------------------------------------------------------
// View Routes
// ---------------------------------------------------------------------------------------------------------------------

app.get('/', (req, res) => {
    res.redirect('/shop');
});

app.get('/shop', (req, res) => {
    res.render(
        'shop.twig',
        {
            products: products,
            cart: cart,
            cartTotal: cartTotal(),
            purchasesTotal: purchasesTotal(),
            balance: balance,
        }
    );
});

app.get('/purchases', (req, res) => {
    res.render(
        'purchases.twig',
        {
            purchases: purchases,
            balance: balance,
        }
    );
});

// ---------------------------------------------------------------------------------------------------------------------
// API Routes
// ---------------------------------------------------------------------------------------------------------------------
app.post("/api/add-to-cart/:productId", (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.productId));
    if (!product) {
        console.log(`Product ${product.id} not found.`);
        return res.status(404).json({message: "Product not found"});
    }
    cart.push(product);
    console.log(`Product ${product.id} added.`);
    res.json({message: "Product added"});
});

// Route to remove an item from the cart
app.post("/api/remove-from-cart/:productId", (req, res) => {
    const productId = parseInt(req.params.productId);
    const product = products.find(p => p.id === parseInt(req.params.productId));
    if (!product) {
        console.log(`Product ${product.id} not found.`);
        return res.status(404).json({message: "Product not found"});
    }
    console.log(`Product ${product.id} removed.`);
    cart = cart.filter(item => item.id !== productId);
    res.json({message: "Product removed from cart"});
});

app.post("/api/buy", lockRoute, async (req, res) => {
    const total = cartTotal();
    if (balance < total) {
        // releasing lock!!!!
        isLocked = false;
        return res.status(401).json({success: false, message: "You have no money"});
    }
    balance -= total;
    await sleep(1000);
    purchases.push(...cart);
    // releasing lock!!!!
    res.json({success: true, message: "New purchases made"});
    isLocked = false;
});


// ---------------------------------------------------------------------------------------------------------------------
// Starting app
// ---------------------------------------------------------------------------------------------------------------------

const PORT = 2025;

app.listen(PORT, () => {
    console.log(`Server is listening at http://localhost:${PORT}`);
});
