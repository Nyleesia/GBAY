  
// Get dependencies
const inquirer = require("inquirer");
const mysql = require("mysql");
const Table = require("cli-table2");

// Save terminal output method as a variable
const log = (console.log);
require("dotenv").config();

// Create connection to mySQL
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.DB_PASSWORD,
    database: "bamazon",
    port: 3306
});

// Connect to the mysql database
connection.connect((err, connected) => {
    if (err){
        log(err);
        log("Connecting to inventory database...");
        log("There was an error connecting to the database")
    }
    else{
        log(connected);
        log("Connecting to inventory database...");
        log("Connection: Successful!");
    }
});

// Show the user the inventory listing so they see what is available
const ShowInventory =  () => {
    connection.query("SELECT * FROM products", (err, data ) => {
        if (err){
            log(err);
            log(`Oops! Something has gone wrong here. Please try connecting later.`)
        }
        log("******************************************************");
        log("******************Welcome to Bamazon******************");
        log("******************************************************");
        log("");
        log("***********See our current inventory below************"); 
        log(""); 

    // Instantiate cli table 2
    let table = new Table({
        head: ["Product ID", "Name", "Department", "Price", "In Stock"], 
        colWidths: [8, 20, 20, 8, 8], 
        colAligns: ["center", "left", "left", "center", "center"], 
        style: {
            head: ["purple"], 
            compact: true
        } 
    });

    for (var i = 0; i < data.length; i++) {
        table.push([
            data[i].item_id, 
            data[i].product_name, 
            data[i].department_name, 
            data[i].price, 
            data[i].stock_quantity]);
    }

    log(table.toString()); 
    log("******************************************************");

    shopNow();
    });
}; 

const shopNow = () => {
    inquirer
    .prompt({
        name : "addToCart", 
        type : "input", 
        message : " Enter the id of the product you want to add to your cart"
    }).then ((productChoice) => {
        let selected = productChoice.addToCart; 
        connection.query ("SELECT * FROM products WHERE item_id = ?", selected, (err, res) => {
            if (err) throw err; 
            if (res.length === 0) {
                log("Sorry, that product is not in our current inventory! Try another by consulting our inventory table, or come back later, when it might be in stock.");
            
            shopNow(); 
            }
            else {
                inquirer
                .prompt({
                  name: "quantity",
                  type: "input",
                  message: "How many items would you like to add to your cart?"
                }).then ((selectQty) => {
                    let quantity = selectQty.quantity; 
                    if (quantity > res[0].stock_quantity) {
                        log(`Oops! Unfortunately, we only have ${res[0].stock_quantity} of these remaining.`);
                        shopNow();
                    } 
                    else {
                        log("");
                        log(`Congratulations ${quantity} ${res[0].product_name} have been added to your cart`);
                        log("******************************************************");
                        log(`Order: ${quantity} ${res[0].product_name} @ $${res[0].price} each`);
                        log("------------------------------------------------------");
                        log(`Total Cost=  $` + res[0].price * quantity);
                        log("------------------------------------------------------");
                        
                        let newQty = res[0].stock_quantity - quantity;

                        connection.query(
                        "UPDATE products SET stock_quantity = " + newQty + " WHERE item_id = " + res[0].item_id, (err, resUpdate) => {
                            if (err) throw err;
                            log("");
                            log(`Your Order has been Processed...`);
                            log(`Thank you for supporting Bamazon!`);
                            log(``);
                            log("******************************************************");
                            log(``);
                            connection.end();
                        });
                    }
                });
            }
        });
    });
};

// Execute fx to show inventory
ShowInventory();
