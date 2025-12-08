var country = "India";
console.log("Country: " + country);
let city = "Mumbai";
console.log("City: " + city);
function greet(district = "Andheri") {
    console.log("Hello from " + country + " and " + district);
}   
console.log("-------------------------------------------------------");
greet();
greet("Karur");
console.log("-------------------------------------------------------");
console.log(5 === "5");
console.log(5 == "5");
console.log("-------------------------------------------------------");
function major_finder(age) {
    return age >= 18 ? "You are a major." : "You are a minor.";
}
console.log(major_finder(20));
console.log(major_finder(16));
console.log("-------------------------------------------------------");
let fruits = ["Apple", "Banana", "Cherry"];
let car = {make: "Toyota",model: "Camry",year: 2020};
console.log(car.make);
console.log(fruits[1]);
console.log("-------------------------------------------------------");
console.log(`Housting`);

console.log(a);
var a = 10;
// let a = 10;

let b = 20;
b = 30;
console.log(b);