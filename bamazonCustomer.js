// Get dependencies
const inquirer = require("inquirer");
const mysql = require("mysql");
const Table = require("cli-table2")

// Save terminal output method as a variable
const log = (console.log);

// Create connection to mySQL
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "bamazon",
    port: 3306
});

// Connect to the mysql server and database
connection.connect((err, connected) => {
    if (err){
        log(`Connecting to inventory database...`)
        log("There was an error connecting to the database")
    }
    else{
        log(`Connecting to inventory database...`)
        log(`Connection: Successful!`)
    }
});

// Show the user the inventory listing so they see what is available
let ShowInventory = function () {
    connection.query("SELECT * FROM products", function(err, data ) {
        if (err){
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
            head: ["aqua"], 
            compact: true
        } 
    });

    for (var i = 0; i < data.length; i++) {
        table.push([data[i].item_id, data[i].product_name, data[i].department_name, data[i].price, data[i].stock_quantity]);
    }

    log(table.toString()); 
    log("******************************************************");
    });
}; 
ShowInventory()
