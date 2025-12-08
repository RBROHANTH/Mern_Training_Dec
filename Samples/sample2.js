console.log("Select a number to select a fruit:");
let number = 1;
switch (number) {
    case 1:
        console.log("You selected Apple.");
        break;
    case 2:
        console.log("You selected Banana.");  
        break; 
    default:
        console.log("No valid selection made.");
}
console.log("-------------------------------------------------------");
let person = {name: "Alice", age: 25, city: "New York"};
for (let key in person) {
    console.log(key + ": " + person[key]);
}
console.log("-------------------------------------------------------");
let fruits = ["Apple", "Banana", "Cherry"];
for (let fruit of fruits) {
    console.log(fruit);
}
console.log("-------------------------------------------------------");
console.log("Ternary Operator Example:");
let age = 19;
let eligibility = (age >= 18) ? "Eligible to vote." : "Not eligible to vote.";
console.log(eligibility);
console.log("-------------------------------------------------------");
const object1 = {name: "rohanth", age: 20};
const updatedObject = {...object1, city: "Karur"};
console.log(object1);
console.log(updatedObject);
console.log("-------------------------------------------------------");
let arr = [1, 2, 3, 4,5,6];
let [a,b,c,d] = arr;
console.log(a);
console.log(b);
console.log(c);
console.log(d);
console.log("-------------------------------------------------------");

const [first, , third] = fruits;
console.log(first,third);
const [x,y,...rest] = arr;
console.log(x);
console.log(y);
console.log(rest);
console.log("-------------------------------------------------------");
const sum = arr.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
console.log("Sum of array elements: " + sum);
console.log("-------------------------------------------------------");
function multiply(...numbers) {
    return numbers.reduce((acc, val) => acc * val, 1);
}
console.log(multiply(2, 3));
console.log(multiply(4, 5, 6));
console.log("-------------------------------------------------------");