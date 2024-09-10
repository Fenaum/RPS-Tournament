//Palindrome Checker

// let string = 'racecar'
// let string2 = 'toad'

// function palindrome(str) {
//     if (str === str.split('').reverse().join('')) {
//         console.log(
//           `${str} is the same as ${str.split("").reverse().join("")}`
//         );
//     } else {
//         console.log(`${str} is the the same back word`)
//     }
// };

// palindrome(string);

//Find largest number in Array

// let array1 = [1,2,3,4,5,6,9,1,2,4]

// function findLargetNumber(arr) {
//     let max = arr[0]
//     for (let i = 1; i < arr.length; i++) {
//         if (arr[i] > max) {
//             max = arr[i];
//         }
//     }
//     return max;
// }

// console.log(findLargetNumber(array1))


// Fibonacci Sequence
// Write a function that returns the nth number in the Fibonacci sequence. The Fibonacci sequence starts with 0, 1, and each subsequent number is the sum of the previous two.

function fibonacci(n) {
    const fib = [0,1]
    for (let i = 2; i < n; i++) {
        fib[i] = fib[i - 1] + fib[i - 2]
    }
    console.log(fib);
}

fibonacci(8)