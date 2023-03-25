// Calculator by Vlad Hadyak

let firstNum = 5;
let operator = "+"
let secNum = 3;


function addition() {
  return firstNum + secNum;
};

function subtraction() {
  return firstNum - secNum;
};

function multiplication() {
  return firstNum * secNum;
};

function division() {
  return firstNum / secNum;
};


function operate() {
 if (operator === "+") {
  return addition();
 } else if (operator === "-") {
  return subtraction();
 } else if (operator === "*") {
  return multiplication();
 } else if (operator === "/") {
  return division();
 };
};
console.log(operate());

