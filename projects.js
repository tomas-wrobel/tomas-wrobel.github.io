/**
 * @file certificates.js
 * @author Tomáš Wróbel
 * @version 1.01
 * calculator preview
 */
var Calculator = {
	input: document.querySelector("#calculator").querySelector("td"),
	operatorKeys: $("#calculator tr td:not([contenteditable]):not(.eq)"),
	functionKeys: document.querySelectorAll("#calculator tr td.eq"),
	setResult() {
		try {
			this.input.innerHTML = (eval(this.input.innerHTML.replace(/:/g, "/").replace(/–/g, "-").replace(/\^/g, "**").replace(/([-]{0,1}[\d]*[.]{0,1}[\d]+)\!/g, "Calculator.fact($1)")) || "0");
		} catch {
			this.input.innerHTML = "Math Error";
		}
		var range, selection;
		if (document.createRange) {
			range = document.createRange();//Create a range (a range is a like the selection but invisible)
			range.selectNodeContents(this.input);//Select the entire contents of the element with the range
			range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
			selection = window.getSelection();//get the selection object (allows you to change selection)
			selection.removeAllRanges();//remove any selections already made
			selection.addRange(range);//make the range you have just created the visible selection
		} else if (document.selection) { 
			range = document.body.createTextRange();//Create a range (a range is a like the selection but invisible)
			range.moveToElementText(this.input);//Select the entire contents of the element with the range
			range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
			range.select();//Select the range (make it the visible selection
		}
	},
	/**
	 * @returns {number}
	 * @param {number} num 
	 * simple factorial
	 */
	fact(num) {
		if (num === 0) {
			return 1;
		}
		return num * this.fact(num - 1);
	}
};

Calculator.input.onkeypress = function (event) {
	event.preventDefault();
	if (event.key === "Enter" || event.key === "=") {
		return Calculator.setResult();
	}
	if (this.innerHTML === "Math Error") {
		this.innerHTML = "";
	}
	if (event.code === "Backspace") {
		this.innerHTML = this.innerHTML.substring(0, this.innerHTML.length - 1);
		return;
	}
	if (event.code === "Delete") {
		this.innerHTML = this.innerHTML.substring(1);
	}
	if (event.code === "NumpadDecimal") {
		this.innerHTML += ".";
		return;
	}
	this.innerHTML += event.key.replace("/", ":").replace("-", "–");
	this.innerHTML = this.innerHTML.replace("**", "^");
	var range, selection;
	if (document.createRange) {
		range = document.createRange();//Create a range (a range is a like the selection but invisible)
		range.selectNodeContents(this);//Select the entire contents of the element with the range
		range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
		selection = window.getSelection();//get the selection object (allows you to change selection)
		selection.removeAllRanges();//remove any selections already made
		selection.addRange(range);//make the range you have just created the visible selection
	} else if (document.selection) { 
		range = document.body.createTextRange();//Create a range (a range is a like the selection but invisible)
		range.moveToElementText(this);//Select the entire contents of the element with the range
		range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
		range.select();//Select the range (make it the visible selection
	}
};

Calculator.input.onpaste = function (event) {
	event.preventDefault();
	this.innerHTML += event.innerText.replace("/", ":").replace("-", "–");
};

Calculator.operatorKeys.on("click", function() {
	if (Calculator.input.innerHTML.includes("Error")) {
		Calculator.input.innerHTML = "";
	}
	Calculator.input.innerHTML += this.innerHTML.replace("-", "–").replace("×", "*");
});

for (let td of Calculator.functionKeys) {
	if (td.innerHTML === "=") {
		td.addEventListener("click", function () {
			Calculator.setResult();
		});
	} else {
		td.addEventListener("click", function () {
			Calculator.input.onkeypress({
				code: "Backspace",
				preventDefault() {}
			});
		});

		td.addEventListener("dblclick", function() {
			Calculator.input.innerHTML = "";
		});
	}
}

/**
 * @file currency.js
 * @author Tomáš Wróbel
 * converting currency using free API
 */

var Currency = {
	apiKey: "?apiKey=98dee94eea68b01792a3",
	/**
	 * converting request
	 * @param {string} from 
	 * @param {string} to 
	 * @param {number} number
	 * @returns {number}
	 */
	convert(from, to, number) {
		url = "https://free.currconv.com/api/v7/convert",
		main = "&q=" + from + "_" + to + "&compact=ultra",
		request = new XMLHttpRequest();
		request.open("GET", url + this.apiKey + main, false);
		request.send(null);

		if (request.status === 200) {
			var json = request.responseText;
		} else {
			return new Error("code: ", request.status);
		}

		var object = JSON.parse(json);
		return Number.parseFloat(object[from + "_" + to]) * number;
	},
	/**
	 * @returns {Object<string, string>}
	 */
	createInputOptions() {
		const inputOptions = {},
		url = "https://free.currconv.com/api/v7/currencies",
		request = new XMLHttpRequest();
		request.open("GET", url + this.apiKey, false);
		request.send(null);

		if (request.status === 200) {
			var json = request.responseText;
		} else {
			return new Error("code: ", request.status);
		}

		const object = JSON.parse(json),
			  array = Object.values(object["results"]);
		for (item of array) {
			let id = item["id"],
				name = item["currencyName"],
				symbol = item["currencySymbol"];
			inputOptions[id] = [name + (symbol ? (" &ndash; " + symbol) : "")];
		}
		return inputOptions;
	},
	
	get() {
		Swal.mixin({
			input: "select",
			inputValidator(value) {
				return !value && "You must select a value!";
			},
			icon: "question",
			inputOptions: this.createInputOptions(),
			showCancelButton: true, inputPlaceholder: "Select a currency...",
			confirmButtonText: 'Next <i class="fas fa-long-arrow-alt-right"></i>'
		}).queue([
			"From", "To",
			{
				input: "number",
				inputOptions: {
					min: 0.01,
				},
				inputAttributes: {
					style: "width: 100%; display: inline-block !important"
				},
				title: "How much?",
				confirmButtonText: "OK",
				inputPlaceholder: "Number..."
			}
		]).then(result => {
			if (result.value) {
				Swal.fire("Success", `${result.value[2]} ${result.value[0]} is ${this.convert(...result.value)} ${result.value[1]}`, "success");
			}
		}).catch(footer => {
			Swal.fire({
				text: "Request wasn't succesfull", 
				icon: "error", footer, title: "Error"
			});
		});
	}
};

/**
 * @file todolist.js
 * @author Tomáš Wróbel
 * appending item to to-do list
 */
var ToDoList = {
	removed: [],
	target: $("ul#to-do-list"),
	applyEvents() {
		this.target.sortable({
			appendTo: this.target,
			ghostClass: "dragged",
			animation: 150
		});

		this.target.children("li").on("click", event => {
			if (event.target instanceof HTMLLIElement) {
				$(event.target).toggleClass("checked");
			}
		});

		this.target.find(".fa-trash-alt").on("click", function () {
			ToDoList.removed.push($(this).parent("li").fadeOut(1000));
		});

		$(".header > i").on("click", () =>{
			this.removed[this.removed.length - 1].fadeIn(1000);
			this.removed.splice(-1, 1);
		});

		$(".header > span").on("click", () => {
			this.newItem($(".header > input").val());
		});
	},
	newItem(value) {
		if (!value) {
			Swal.fire("Error", "You must type something!", "error");
		} else if (this.target.children("li").filter(function () {
			return this.innerText == value;
		}).length > 0) {
			Swal.fire({
				title: "Warning",
				text: "You already added this! Are you sure?",
				icon: "warning",
				confirmButtonText: "Yes, I am!",
				showCancelButton: true,
				cancelButtonText: "Oh, I didn\u2019t notice"
			}).then(result => {
				if (result.value) {
					this.target.append($(`<li>${value} <i class="fas fa-trash-alt"></i></li>`));
					this.applyEvents();
				}
			})
		} else {
			this.target.append($(`<li>${value} <i class="fas fa-trash-alt"></i></li>`));
			this.applyEvents();
		}
	}
};

ToDoList.applyEvents();

/* Graph.js */
const data = {
	"HTML": 5467,
	"JavaScript": 1500,
	"Java": 457,
	"C#": 387
}

window.addEventListener("load", () => {
	new PieChart(data).appendTo(document.getElementById("pie"));
	new BarGraph("Programming languages", data).appendTo(document.getElementById("graph"));
	$("#pie p").insertAfter($("#libraries table"));
});

/* InputStyling */
$("#is-types").on("click", event => {
	$("#tryme").attr("type", event.target.innerText);
});