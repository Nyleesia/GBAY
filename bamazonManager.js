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

// Show the manager the inventory listing so they see products for sale and stock quantities
function viewProductsForSale () {
    connection.query("SELECT * FROM products", (err, data ) => {
        if (err){
            log(err);
            log(`Oops! Something has gone wrong here. Please try connecting later.`)
        }
        log("******************************************************");
        log("************Welcome to Bamazon's Manager Interface*************");
        log("******************************************************");
        log("");
        log("***********Current inventory below************"); 
        log(""); 

    let table = new Table({
      head: ["Product ID","Department", "Price", "In Stock"],
      colWidths: [8, 20, 8, 8],
      colAligns: ["center","left", "center", "center"],
      style: {
        head: ["purple"],
        compact: true
      }
    }); 
    
    for (var i = 0; i < data.length; i++) {
      table.push([
        data[i].item_id, 
        data[i].product_name,
        data[i].price,
        data[i].stock_quantity
      ]);
    }

    log(table.toString()); 
    log("******************************************************");
  
    });
};

function currentInventory() {
  connection.query("SELECT * FROM products WHERE stock_quantity > 0", (
    error,
    data
  ) => {
    if (error) throw error;
    log("");
    log("Bamazon Store Inventory");
    log("");

    let table = new Table({
        head: ["Product ID","Department", "Price", "In Stock"],
        colWidths: [8, 20, 8, 8],
        colAligns: ["center","left", "center", "center"],
        style: {
          head: ["purple"],
          compact: true
        }
      }); 
      
      for (var i = 0; i < data.length; i++) {
        table.push([
          data[i].item_id, 
          data[i].product_name,
          data[i].price,
          data[i].stock_quantity
        ]);
      }
  
      log(table.toString()); 
      log("******************************************************");
    
      });
  };

function lowInventory() {
  connection.query("SELECT * FROM products WHERE stock_quantity < 5", (
    err,
    data
  ) => {
    if (err) throw err;
    log("");
    log("Low Inventory");
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
        data[i].id,
        data[i].products_name,
        data[i].price,
        data[i].stock_quantity
      ]);
    }
    log(table.toString()); 
    log("******************************************************");


  });
};

function addToInventory() {
  inquirer
    .prompt({
      name: "item",
      type: "input",
      message: "What is the id number of the product you would like to add stock to? "
    })
    .then(function(adding) {
      var selection = adding.item;
      connection.query("SELECT * FROM products WHERE item_id=?", selection, function(
        err,
        res
      ) {
        if (err) throw err;
        if (res.length === 0) {
           log("That product doesn't exsist");
          addInventory();
        } else {
          log(res);
          inquirer
            .prompt({
              name: "quantity",
              type: "input",
              message: "How many items do you want to add to the inventory?"
            })
            .then(function(addQty) {
              var quantity = addQty.quantity;
              if (quantity < 0) {
                 log("Please enter a number higher than 0");
                addInventory();
              } else {
                 log("");
                connection.query(
                  "UPDATE products SET stock_quantity = stock_quantity + " +
                  quantity +
                  " WHERE item_id = " +
                  selection,
                  function(err, resUpdate) {
                    if (err) throw err;
                     log("");
                     log("Quantity has been updated");
                     log(
                      quantity + " items added to " + res[0].product_name
                    );
                     log("");
                     managerPrompt();

                  }
                );
              }
            });
        }
      });
    });
}
function addNewProduct() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "Please enter the name of the product you wish to add"
      },
      {
        type: "input",
        name: "department",
        message: "What department does this item belong to?"
      },
      {
        type: "input",
        name: "price",
        message: "Please enter the price of the item?"
      },
      {
        type: "input",
        name: "stock",
        message: "Please enter a stock quantity for this item"
      }
    ])
    .then(function(data) {
      var name = data.name;
      var department = data.department;
      var price = data.price;
      var stock = data.stock;
      connection.query(
        "INSERT INTO products SET ?",
        {
          product_name: name,
          department_name: department,
          price: price,
          stock_quantity: stock
        },
        function(err, insertResult) {
          if (err)  log("Error: " + err);
           log("");
           log("New product " + name + " has been added");
           log("");
           managerPrompt();

        }
      );
    });
}
function viewDepartments() {
  connection.query("SELECT * FROM departments", function(error, results) {
    if (error) throw error;
     log("");
     log("Departments List");
     log("");
    var table = new Table({
      head: ["Depart. Id", "Description", "OH Cost"],
      colWidths: [14, 45, 12],
      colAligns: ["center", "left", "right"],
      style: {
        head: ["blue"],
        compact: true
      }
    }); //end table

    for (var i = 0; i < results.length; i++) {
      table.push([
        results[i].id,
        results[i].department_name,
        results[i].over_head_costs
      ]);
    }
    log(table.toString()); 
    log("******************************************************");

  });
}

function managerPrompt() {
  inquirer
    .prompt({
      name: "select",
      type: "rawlist",
      choices: [
        "View products for sale",
        "View Products with low inventory",
        "View departments",
        "Add to inventory",
        "Add new product(s)",
        "Exit"
      ],
      message: "Select one of the following options: ",
      default: "Number"
    })
    .then(function(answer) {
        log("Fetching your data");
        if(answer.select == 'View products for sale') {
            viewProductsForSale();
            managerPrompt();
        }
        if(answer.select == 'View Products with low inventory') {
            lowInventory();
            managerPrompt();
        }
        if(answer.select == 'View departments') {
            viewDepartments();
            managerPrompt();
        }
        if(answer.select == 'Add to inventory') {
            addToInventory();
        }
        if(answer.select == 'Add new product(s)') {
            addNewProduct();
        }
        if(answer.select == 'Exit') {
            process.exit();
        }

    });
}
managerPrompt();