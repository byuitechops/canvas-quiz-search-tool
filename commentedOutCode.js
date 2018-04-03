/***********************************************
 *                    menu()
 * 
 * Displays the menus and retrieves the users
 * input. Returns a quizSearch object contating
 * the target and conditions.
 ***********************************************/
// function menu() {
//     //Ask question 1 - Get Target. 
//     return enquirer.prompt(menuQuestions)
//         .then(answers => {
//             var target = answers.menuChoice;
//             conditionQuestions[0].choices = targets.find(currentTarget => {
//                 return currentTarget.target == target;
//             }).conditions;
//             target = targets.find(currentTarget => {
//                 return currentTarget.target == target;
//             });

//             //Ask question 2 - Get Condition(s)
//             return enquirer.prompt(conditionQuestions)
//                 .then(answers => {
//                     var conditions = [];
//                     if (target.input_Required === false) {
//                         conditions = answers.conditionChoices;
//                         var quizSearch = new QuizSearch(target, conditions);
//                         return quizSearch;
//                     } else {
//                         conditions = answers.conditionChoices.map(answer => {
//                             return {
//                                 condition: answer,
//                                 user_input: ''
//                             };
//                         });
//                         return new Promise((resolve) => {
//                             asyncLib.eachSeries(conditions, (condition, callback) => {
//                                 //Ask Question 3 - User Input
//                                 var userInput = enquirer.question({
//                                     name: 'userInput',
//                                     message: condition.condition + ':',
//                                 });
//                                 enquirer.prompt(userInput).then(answer => {
//                                     condition.user_input = answer.userInput;
//                                     callback();
//                                 }).catch(console.error);
//                             }, () => {
//                                 var quizSearch = new QuizSearch(target.target, conditions);
//                                 resolve(quizSearch);
//                             });
//                         });
//                     }
//                 }).catch(console.error);
//         }).catch((err) => {
//             console.clear();
//             console.error('Please select a target from the menu using the spacebar.\n');
//             return err;
//         });
// }

// async function promptUser() {
//     enquirer.question('numCourses', 'Number of courses:', {});
//     var answers = await enquirer.ask();
//     var courseObjects = [];
//     console.clear();
//     var count;
//     for (var i = 0; i < answers.numCourses; i++) {
//         if (i < 9) {
//             count = '0' + (i + 1);
//         } else {
//             count = i + 1;
//         }
//         enquirer = new Enquirer();
//         enquirer.question('canvasID', `Canvas Course ID - ${count}:`, { 'default': '' });
//         courseObjects.push(await enquirer.ask());
//     }
//     console.clear();
//     var courseIDs = [];
//     courseObjects.forEach(currentCourse => {
//         courseIDs.push(currentCourse.canvasID);
//     });
//     return courseIDs;
// };

// class QuizSearch {
//     constructor(target = [], conditions = [], courseIDs = [], functionCall) {
//         this.target = target;
//         this.conditions = conditions;
//         this.courseIDs = courseIDs;
//         this.functionCall = functionCall;
//     }
// }

//Target objects for selection.
// var targets = [{
//     target: 'Answers',
//     conditions: [conditions.contains, conditions.equal_to, conditions.length],
//     input_Required: true
// }, {
//     target: 'Answer Comments',
//     conditions: [conditions.contains, conditions.equal_to, conditions.length],
//     input_Required: true
// }, {
//     target: 'Question Comments',
//     functionCall: getQuestionComments,
//     conditions: [conditions.contains, conditions.equal_to, conditions.length],
//     input_Required: true
// }, {
//     target: 'Point Value',
//     conditions: [conditions.equal_to, conditions.greater_than, conditions.less_than],
//     input_Required: true
// }, {
//     target: 'Question Text',
//     conditions: [conditions.contains, conditions.equal_to, conditions.length],
//     input_Required: true
// }, {
//     target: 'Title',
//     conditions: [conditions.contains, conditions.equal_to, conditions.length],
//     input_Required: true
// }, {
//     target: 'Type',
//     conditions: questionsTypes,
//     input_Required: false
// }, {
//     target: 'Get All Questions',
//     conditions: false,
//     input_Required: false
// }];

//Part of askQuestionTwo
// var conditions = [];
// if (!target.input_Required) {
//     conditions = answers.conditionChoices;
//     var quizSearch = new QuizSearch(target.target, conditions, [], target.functionCall);
//     return quizSearch;
// } else {
//     conditions = answers.conditionChoices.map(answer => {
//         return {
//             condition: answer,
//             user_input: ''
//         };
//     });
//     target.conditions = conditions;
//     return target;
// }
//});

// const truthy = function (itemValue) {
//     if (itemValue) {
//         return true;
//     } else {
//         return false;
//     }
// };
// const falsey = function (itemValue) {
//     if (!itemValue) {
//         return true;
//     } else {
//         return false;
//     }
// };
// const lessThan = function (itemValue, value) {
//     return itemValue < value;
// };
// const greaterThan = function (itemValue, value) {
//     return itemValue > value;
// };
// const lessThanOrEqualTo = function (itemValue, value) {
//     return itemValue <= value;
// };
// const greaterThanOrEqualTo = function (itemValue, value) {
//     return itemValue >= value;
// };
// const equalTo = function (itemValue, value) {
//     return itemValue === value;
// };
// const notEqualTo = function (itemValue, value) {
//     return itemValue !== value;
// };
// const contains = function (itemValue, value) {
//     return itemValue.includes(value);
// };
// const doesNotContain = function (itemValue, value) {
//     return !itemValue.includes(value);
// };

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

// for (var i = 0; i < questionTypes.length; i++) {
//     console.log(condition.conditionName, questionTypes[i]);
//     condition.value = questionTypes[i].match(new RegExp(condition.conditionName + '+', 'i'));
//     if (condition.value != null) {
//         condition.value = condition.value.input;
//         break;
//     }
// }

// .then(readFile)
// .then((quizSearch) => {
//     console.clear();
//     console.log('Starting');
//     quizSearch.functionCall(quizSearch);
// });

// .then(filterObject => {
//     asyncLib.each(filterObject.courseIDs, (courseID, eachCallBack) => {
//         canvas.getQuizzes(courseID, (err, quizzes) => {
//             function getQuestions(quiz, callback) {
//                 canvas.getQuizQuestions(courseID, quiz.id, (err, questions) => {
//                     if (err) {
//                         console.log('Hello', err);
//                         callback(null);
//                         return;
//                     }
//                     var filteredData = filterStuff(questions, filterObject);
//                     if (filteredData.length > 0) {
//                         filteredData.forEach(data => {
//                             console.log(data[filterObject.target.property]);
//                         });
//                     }

//                     callback(null);
//                 });

//             }
//             asyncLib.eachLimit(quizzes, 10, getQuestions, err => {
//                 if (err) {
//                     console.log(err);
//                 }
//                 eachCallBack(null);
//             });

//         });
//     }, err => {
//         if (err) {
//             console.log(err);
//         }
//         console.log('\nFinished');
//     });
// });

//const noInputConditions = [/Has+/g, /Does Not+/g];

// if (noInputConditions.some(regEx => {
//     return regEx.test(condition.conditionName);
// }) || filterObject.target.property === 'question_type') 