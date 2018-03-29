const lessThan = function (itemValue, value) {
    return itemValue < value;
};
const greaterThan = function (itemValue, value) {
    return itemValue > value;
};
const lessThanOrEqualTo = function (itemValue, value) {
    return itemValue <= value;
};
const greaterThanOrEqualTo = function (itemValue, value) {
    return itemValue >= value;
};
const equalTo = function (itemValue, value) {
    return itemValue === value;
};
const NotEqualTo = function (itemValue, value) {
    return itemValue !== value;
};
const contains = function (itemValue, value) {
    return itemValue.includes(value);
};
const doesNotContain = function (itemValue, value) {
    return !itemValue.includes(value);
};
const questionType = function (itemValue, value) {
    return itemValue === value;
};

module.exports = {
    lessThan,
    lessThanOrEqualTo,
    greaterThan,
    greaterThanOrEqualTo,
    equalTo,
    NotEqualTo,
    contains,
    doesNotContain,
    questionType
};








// var checkMark = '<p style="text-align:center">&#x2714;</p>';
// const contains = function (userInput, target, object) {
//     return object[target].includes(userInput);
// };

// const equalTo = function (userInput, question) {
//     console.log('Equal to!');
// };

// const greaterThan = function (userInput, question) {
//     console.log('Greater than!');
// };

// const lessThan = function (userInput, question) {
//     console.log('Less than!');
// };

// const length = function (userInput, question) {
//     console.log('Length!');
// };

// const questionTypes = function (userInput, question) {
//     console.log('Question Types!');
// };

// module.exports = {
//     contains,
//     equal_to: equalTo,
//     greater_than: greaterThan,
//     less_than: lessThan,
//     length,
//     questionTypes

// };