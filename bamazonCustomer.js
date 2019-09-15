// Get dependencies
const inquirer = require("inquirer");
const mySQL = require("mysql");

// Create connection to mySQL
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "bamazon"
});

// Connect to the mysql server and database
connection.connect(function(err) {
  if (err) throw err;
  ShowInventory();
});

// Show the user the inventory listing so they see what is available
function ShowInventory() {
    connection.query("SELECT * FROM bamazon", function(err, data) {
        if (err) throw err;

    //Get information from user to determine order
    inquirer
        .prompt({
            name: "inventory",
            type: "rawlist",
            choices: function() {
                let inventoryArray = [];
                let inventoryNames = [];
                let inventoryPrices = [];
                for (var i = 0; i < data.length; i++) {
                    inventoryNames.push(data[i].product_name),  inventoryPrices.push(data[i].price), inventoryArray.push( inventoryNames), inventoryArray.push( inventoryPrices);
                }
                return inventoryArray;
              },
            message: "What would you like to order today?"
        }).then(function(answer) {
        // Acertain the quantity that the user wants to order

            // Or end the connection 
            {
                connection.end();
            }
        });
    });
};
