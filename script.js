// Calculator by Vlad Hadyak

const result = document.querySelector(".result");
const numButtons = [];

// Include 10 number buttons
for (let i = 0; i <= 9; i++) {
  numButtons[i] = document.querySelector("#num" + i);
}; 

function displayNumbers() {
  numButtons.forEach((button) => {
    const number = button.textContent;
    button.addEventListener("click", () => {
      let finalResult = result.textContent += number;
      // If numbers exceed over 15 digits in length on display, then restrict it from displaying more numbers
      if (finalResult.toString().length > 15) {                      
         finalResult = finalResult.substring(0, 15);
         console.log("Sorry! You reached maximum number of digits");
      }
      result.textContent = finalResult;
    });   
  });
};
displayNumbers();


let num1 = 6;
let num2 = 3;
let operator = "+"

function addition(num1, num2) {
  return num1 + num2;
};

function subtraction(num1, num2) {
  return num1 - num2;
};

function multiplication(num1, num2) {
  return num1 * num2;
};

function division(num1, num2) {
  return num1 / num2;
};

function operate(operator, num1, num2) {
 if (operator === "+") {
  return addition(num1, num2);
 } else if (operator === "-") {
  return subtraction(num1, num2);
 } else if (operator === "*") {
  return multiplication(num1, num2);
 } else if (operator === "/") {
  return division(num1, num2);
 };
};

//result.textContent = operate(operator, num1, num2);  //Display result in the input text box

