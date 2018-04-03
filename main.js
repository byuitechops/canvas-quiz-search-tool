const canvas = require('canvas-wrapper');
const Logger = require('logger');
const Enquirer = require('enquirer');
const asyncLib = require('async');
const d3 = require('d3-dsv');
const fs = require('fs');
const FilterObject = require('./filterObject.js');
const quizTargets = require('./quizQuestionTargets.js');

var enquirer = new Enquirer();
enquirer.register('checkbox', require('prompt-checkbox'));
enquirer.register('radio', require('prompt-radio'));

//Types of questions available from Canvas

const noInputConditions = ['Has', 'Does Not'];

//Question 1 - Targets
var menuQuestions = [
    {
        name: 'menuChoice',
        message: 'Select a Target below using the spacebar:',
        type: 'radio',
        validate: input => {
            //This uses a Not Not check to find out if the input is truthy or falsey. We want to see if input is true. 
            //Doing 'return input' just returns a copy of input, however 'return !!input' will return a boolean true or false.
            return !!input;
        },
        choices: Object.keys(quizTargets)
    }
];

var filterStuff = (items, filterObject) => {
    return items.filter(item => {
        return filterObject.conditions.every(condition => {
            var property = filterObject.target.property;
            var itemValue;
            if (Array.isArray(property)) {
                itemValue = property.map(val => item[val]);
            } else {
                itemValue = item[property];
            }
            if (!Array.isArray(itemValue)) {
                itemValue = [itemValue];
            }
            return condition.condition(itemValue, condition.value);
        });
    });
};

/*************************************************
 *           askQuestionOne() - Target
 * 
 * Parameters: None
 * 
 * Description: Prompts the user to select a 
 * target. The target is the part of the quiz 
 * Questions to focus on. This function returns 
 * the selected target as a JavaScript object.
 * 
 * Return Type: Promise
 *************************************************/
function askQuestionOne() {
    return enquirer.prompt(menuQuestions)
        .then(answer => {
            return quizTargets[answer.menuChoice];
        });
}

/*************************************************
 *         askQuestionTwo() - Conditions
 * 
 * Parameters: Object
 * 
 * Description: Prompts the user to select 
 * conditions for the target selected. If the
 * Target doesn't require conditions it returns
 * the original target. The user may choose none.
 * If the user chooses a condition(s) that does not 
 * require user input the function will return a 
 * QuizSearch object. If it does it will return 
 * the target and its current data.
 * 
 * Return Type: Object
 *************************************************/
function askQuestionTwo(target) {
    if (!target.conditions) {
        return target;
    }
    //If the target is Question Type, we need the question to be a radio, otherwise it's a checkbox
    if (target.property === 'question_type') {
        //Question 2 - Question Type
        var typeQuestions = [
            {
                name: 'typeChoices',
                message: 'Select a question type below using the spacebar: \n(To select none, press enter)',
                type: 'radio',
                validate: input => {
                    //This uses a Not Not check to find out if the input is truthy or falsey. We want to see if input is true. 
                    //Doing 'return input' just returns a copy of input, however 'return !!input' will return a boolean true or false.
                    return !!input;
                },
                choices: Object.keys(target.conditions)
            }
        ];
        return enquirer.prompt(typeQuestions)
            .then(answers => {
                var conditionsArray = [];
                conditionsArray.push({
                    condition: quizTargets[answers.menuChoice].conditions[answers.typeChoices],
                    conditionName: answers.typeChoices,
                    value: ''
                });
                return new FilterObject(quizTargets[answers.menuChoice], conditionsArray);
            });
    } else {
        //Question 2 - Conditions
        var conditionQuestions = [
            {
                name: 'conditionChoices',
                message: 'Select Conditions below using the spacebar: \n(To select none, press enter)',
                type: 'checkbox',
                choices: Object.keys(target.conditions)
            }
        ];
        return enquirer.prompt(conditionQuestions)
            .then(answers => {
                var conditionsArray = [];
                answers.conditionChoices.forEach(condition => {
                    conditionsArray.push({
                        condition: quizTargets[answers.menuChoice].conditions[condition],
                        conditionName: condition,
                        value: ''
                    });
                });
                return new FilterObject(quizTargets[answers.menuChoice], conditionsArray);
            });
    }
}

/*************************************************
 *         askQuestionThree() - User Input
 * 
 * Parameters: Object
 * 
 * Description: This function is called when the 
 * target's conditions require input from the 
 * user. Returns a QuizSearch object.
 * 
 * Return Type: Promise
 *************************************************/
function askQuestionThree(filterObject) {
    return new Promise((resolve) => {
        asyncLib.eachSeries(filterObject.conditions, (condition, callback) => {
            //Ask Question 3 - User Input
            if (noInputConditions.some(string => {
                return condition.conditionName.includes(string);
            }) || filterObject.target.property === 'question_type') {
                if (filterObject.target.property === 'question_type') {
                    condition.value = filterObject.target.questionTypes[condition.conditionName];
                }
                callback();
            } else {
                var userInput = [
                    {
                        name: 'userInput',
                        message: condition.conditionName + ':',
                        validate: input => {
                            //This uses a Not Not check to find out if the input is truthy or falsey. We want to see if input is true. 
                            //Doing 'return input' just returns a copy of input, however 'return !!input' will return a boolean true or false.
                            return !!input;
                        },
                    }
                ];
                enquirer.prompt(userInput).then(answer => {
                    condition.value = answer.userInput;
                    callback();
                });
            }
        }, () => {
            resolve(filterObject);
        });

    });
}

function moreFilters(filterObject) {
    return new Promise((resolve) => {
        var moreFilters = [
            {
                name: 'moreFilters',
                message: 'Would you like to add another filter?',
                validate: input => {
                    //This uses a Not Not check to find out if the input is truthy or falsey. We want to see if input is true. 
                    //Doing 'return input' just returns a copy of input, however 'return !!input' will return a boolean true or false.
                    return !!input;
                },
                type: 'radio',
                choices: ['Yes', 'No']
            }
        ];
        enquirer.prompt(moreFilters).then(answer => {
            resolve([filterObject, answer.moreFilters]);
        });
    });
}


/*************************************************
 *                convertCSV()
 * 
 * Parameters: String
 * 
 * Description: Takes in a CSV string, converts 
 * the string into an object, and returns only the
 * course IDs in the object. 
 * 
 * Return Type: Array
 *************************************************/
function convertCSV(csvString) {
    var data = d3.csvParse(csvString).map(course => {
        return course.ID;
    });
    return data;
}

/*************************************************
 *                  readFile()
 * 
 * Parameters: Object
 * 
 * Description: Reads the CSV file. If successfull,
 * calls the convertCSV function and returns a 
 * quizSearch object containing the course IDs.
 * 
 * Return Type: Object
 *************************************************/
function readFile(filterObject) {
    return new Promise((resolve, reject) => {
        fs.readFile('courseIDs.csv', 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve([filterObject, convertCSV(data)]);
            }
        });
    });
}


function getQuizQuestions(filterObjects, courseID) {
    return new Promise((resolve) => {
        var questionData = [];
        canvas.getQuizzes(courseID, (err, quizzes) => {
            function getQuestions(quiz, callback) {
                canvas.getQuizQuestions(courseID, quiz.id, (err, questions) => {
                    if (err) {
                        console.log(err);
                        callback(null);
                        return;
                    }
                    if (questions.length != 0) {

                        questionData.push(questions);
                    }
                    callback(null);
                });
            }
            asyncLib.eachLimit(quizzes, 10, getQuestions, err => {
                if (err) {
                    console.log(err);
                }
                var newArray = [];
                questionData.forEach(questionArray => {
                    if (questionArray.length != 0) {
                        newArray = newArray.concat(questionArray);
                    }
                });
                resolve([filterObjects, newArray]);
            });
        });
    });
}

function applyFilters(filterData) {
    return new Promise((resolve) => {
        var filterObjects = filterData[0];
        var questions = filterData[1];
        asyncLib.each(filterObjects, (filterObject, callback) => {
            questions = filterStuff(questions, filterObject);
            callback(null);
        }, err => {
            if (err) {
                console.error(err);
            }
            resolve(questions);
        });
    });
}

function createReport(filteredQuestions, courseID) {
    canvas.get(`/api/v1/courses/${courseID}`, (err, course) => {
        console.log(course);
        var courseCode = course[0].course_code;
        asyncLib.each(filteredQuestions, (question, callback) => {
            //Create the Logger report here
            var logger = new Logger('');
            console.log(question);
            callback(null);
        }, err => {
            if (err) {
                console.error(err);
            }
            console.log('\nReport Created for: ' + courseCode);
        });
    });
}

/*************************************************
 *                    Driver
 * 
 * Calls all the necessary functions to run the
 * program. Waterfall style.
 *************************************************/
function main(filters = []) {
    askQuestionOne()
        .then(askQuestionTwo)
        .then(askQuestionThree)
        .then(moreFilters)
        .then(answer => {
            return new Promise((resolve) => {
                if (answer[1] === 'Yes') {
                    filters.push(answer[0]);
                    main(filters);
                } else {
                    filters.push(answer[0]);
                    resolve(filters);
                }
            });
        })
        .then(readFile)
        .then(filterData => {
            asyncLib.each(filterData[1], (courseID, callback) => {
                getQuizQuestions(filterData[0], courseID)
                    .then(applyFilters)
                    .then(questions => {
                        createReport(questions, courseID);
                    });
                callback(null);
            });
        });
}

main();