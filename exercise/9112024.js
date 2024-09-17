// 3. Count Vowels in a String
// Write a function that takes a string and returns the number of vowels (a, e, i, o, u) in the string.

function countVowels(str) {
    const vowels = new Set(['a', 'e', 'i', 'o', 'u']);
    return [...str.toLowerCase()].filter(char => vowels.has(char)).length;
}

console.log(countVowels('absolutely')); // Output: 6

function extractVowels(str) {
    const vowels = new Set(['a', 'e', 'i', 'o', 'u']);
    return [...str.toLowerCase()].filter(char => vowels.has(char));
}

console.log(extractVowels('absolutely')); // Output: ['a', 'e']