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
	console.log("Connected to Bamazon");
	show();
	});


function show(){
	var query = "SELECT * FROM bamazon.products";
		connection.query(query, function(err, res) {
			for(var i = 0; i < res.length; i++){
			var productId = res[i].item_id;
			var name = res[i].product_name;
			var price = res[i].price;

			console.log(productId,name,price);
		};

		ask();
	});
};


function ask(){
	inquirer.prompt([
		{
			name:"buyid",
			type: "input",
			message: "What is the id of the product you would like to purchase?"
		},
		{	name:"qty",
			type: "input",
			message: "How many would you like to buy?"
		}
		])
	.then(function(answer){
		var query1 = "SELECT * FROM products WHERE item_id = ?";
		connection.query(query1, [answer.buyid], function(err, res){
			if(res[0].stock_quantity < answer.qty){
				console.log("Out of Stock");
			} else {
				var price = res[0].price;
				var stock = parseInt(res[0].stock_quantity) - parseInt(answer.qty);
				var query2 = "UPDATE products SET stock_quantity = ? WHERE item_id = ?";
				connection.query(query2, [stock, answer.buyid], function(err, res){
					var cost = price * answer.qty;
					console.log("Your total cost is $" + cost);
				});	
			};
		});
	});

}