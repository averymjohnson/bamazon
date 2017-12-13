var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "2203",
  database: "bamazon"
});

connection.connect(function(err){
	console.log("Connected to Bamazon Manager");
	runSearch();
	});


function runSearch() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View Products for Sale",
        "View Low Inventory",
        "Add to Inventory",
        "Add New Product"
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
        case "View Products for Sale":
          productsSale();
          break;

        case "View Low Inventory":
          lowInventory();
          break;

        case "Add to Inventory":
          addInventory();
          break;

        case "Add New Product":
          addProduct();
          break;
      }
    });
}

function productsSale(){
	var query = "SELECT * FROM bamazon.products";
		connection.query(query, function(err, res) {
		for(var i = 0; i < res.length; i++){
			var productId = res[i].item_id;
			var name = res[i].product_name;
			var dept = res[i].department_name;
			var price = "$" + res[i].price;
			var stock = res[i].stock_quantity;


			console.log(productId,name,dept,price,stock);
		};
	});
};

function lowInventory(){
	var query = "SELECT * FROM bamazon.products WHERE stock_quantity < 5";
	connection.query(query, function(err, res){
		for(var i = 0; i < res.length; i++){
		var productId = res[i].item_id;
		var name = res[i].product_name;
		var stock = res[i].stock_quantity;


		console.log(productId,name,stock);
		};

	});
};


function addInventory(){
	inquirer.prompt([
		{
			name:"add",
			type: "input",
			message: "What is the id of the product you would like to add inventory to?"
		},
		{	name:"qty",
			type: "input",
			message: "How many would you like to add?"
		}
		])
	.then(function(answer){
		var query1 = "SELECT * FROM products WHERE item_id = ?";
		connection.query(query1, [answer.add], function(err, res){
    		var stock = parseInt(res[0].stock_quantity) + parseInt(answer.qty);

		  var query2 = "UPDATE products SET stock_quantity = ? WHERE item_id = ?"
		connection.query(query2,[stock, answer.productId] , function(err, result){
        	console.log("Inventory is Updated");
        		     connection.end();
				});
			});
		});
	};


function addProduct(){
		inquirer.prompt([
		{
			name:"name",
			type: "input",
			message: "What is the product name?"
		},
		{	name:"department",
			type: "input",
			message: "What is the department name?"
		},
		{	name:"price",
			type: "input",
			message: "What is the product's price?"
		},
		{	name:"amt",
			type: "input",
			message: "How many units would you like to post?"
		}
		])
	.then(function(answer){
		var responses = [[answer.name, answer.department, answer.price, answer.amt]];
		var query3 = "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ?"
		connection.query(query3, [responses], function(err, res){
			console.log("Product is added");
		});

		connection.end();
	});
};