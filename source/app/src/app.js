const express = require('express');
const nunjucks = require('nunjucks');
const path = require('path');

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
        name: "Own a Piece of the Moon",
        description: "Perfect for space lovers. I am the businessman from the little prince.",
        price: 50
    },
    {
        id: 104,
        image: "/products/imgs/the_moon.jpg",
        name: "Own a Piece of the Moon",
        description: "I am selling the whole moon for a dollar! I saw the moon first, it's mine!",
        price: 1
    },
    {
        id: 105,
        image: "/products/imgs/flag.jpg",
        name: "FLAG obtained from @HACK 2025",
        description: "I did NOT register on time, but I managed to the flag somehow... So I am selling it here :))",
        price: 2025
    },


]

// ---------------------------------------------------------------------------------------------------------------------
// Live Data
// ---------------------------------------------------------------------------------------------------------------------

let cart = [];

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
            cart: cart
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

// ---------------------------------------------------------------------------------------------------------------------
// Starting app
// ---------------------------------------------------------------------------------------------------------------------

const PORT = 2025;

app.listen(PORT, () => {
    console.log(`Server is listening at http://localhost:${PORT}`);
});