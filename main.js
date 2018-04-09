const canvas = require('canvas-wrapper');
const Logger = require('logger');
const Enquirer = require('enquirer');
const asyncLib = require('async');
const d3 = require('d3-dsv');
const fs = require('fs');
const FilterObject = require('./filterObject.js');
const quizTargets = require('./quizQuestionTargets.js');

var logger = new Logger();

var enquirer = new Enquirer();
enquirer.register('checkbox', require('prompt-checkbox'));
enquirer.register('radio', require('prompt-radio'));

//These strings are for checking if the condition is a truthy or falsey question. They do not require input.
//These are hardcoded.
const noInputConditions = ['Has', 'Does Not'];

//Question 1 - Targets
var menuQuestions = [
    {
        name: 'menuChoice',
        message: 'Select a Target below using the spacebar:',
        type: 'radio',
        validate: input => {
            //This uses a Not Not(!! = true) check to find out if the input is truthy or falsey. We want to see if the input is true. 
            //Doing 'return input' just returns a copy of input, however 'return !!input' will return a boolean true or false.
            return !!input;
        },
        choices: Object.keys(quizTargets)
    }
];

/*************************************************
 *                 filterStuff()
 * 
 * Parameters: array, object
 * 
 * Description: This function takes in an array
 * of items and the current filterObject. It
 * calls all the conditions on the filterObject.
 * Each condition returns true or false. If a
 * condition returns true on an item, that item
 * is added to the return Array. Once finished,
 * the function returns an array of filtered items. 
 * 
 * Return Type: Array
 *************************************************/
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
 * target. The target is which part of the quiz 
 * Questions to focus on. This function returns 
 * the selected target as a JavaScript object
 * wrapped in a promise.
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
 * conditions for the target selected.
 * The user may choose none(Just grabs all the 
 * data for the specified target). If a condition
 * is chosen, it will make a filterObject object
 * and add the chosen condition(s) to the object.
 * This function will always return a filterObject.
 * 
 * Return Type: Object
 *************************************************/
function askQuestionTwo(target) {
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
 * user. Returns a filterObject wrapped  inside 
 * a promise.
 * 
 * Return Type: Promise
 *************************************************/
function askQuestionThree(filterObject) {
    return new Promise((resolve) => {
        asyncLib.eachSeries(filterObject.conditions, (condition, callback) => {
            //Ask Question 3 - User Input
            //Check if the condition requires user input
            if (noInputConditions.some(string => {
                return condition.conditionName.includes(string);
            }) || filterObject.target.property === 'question_type') {
                if (filterObject.target.property === 'question_type') {
                    condition.value = filterObject.target.questionTypes[condition.conditionName];
                }
                callback();
            } else {
                //The condition does require user input.
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

/*************************************************
 *                moreFilters()
 * 
 * Parameters: Object
 * 
 * Description: Prompts the user if they would
 * like to add another filter to the filterObjects
 * array. Returns an array, wrapped in a promise,
 * that contains the current filterObject and
 * their response(Yes, No).
 * 
 * Return Type: Array
 *************************************************/
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
 *                  convertCSV()
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

/*************************************************
 *               getQuizQuestions()
 * 
 * Parameters: Object, string/number
 * 
 * Description: Gets the quiz questions for a
 * given course. The course is specified by its
 * ID. This function returns an array, wrapped in
 * a promise, containing three items: filterObjects,
 * questions, and quizzes.
 * 
 * Return Type: Promise
 *************************************************/
function getQuizQuestions(filterObjects, courseID) {
    return new Promise((resolve) => {
        var questionData = [];
        canvas.getQuizzes(courseID, (err, quizzes) => {
            function getQuestions(quiz, callback) {
                canvas.getQuizQuestions(courseID, quiz.id, (err, questions) => {
                    if (err) {
                        logger.error(err);
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
                    logger.log(err);
                }
                var newArray = [];
                questionData.forEach(questionArray => {
                    if (questionArray.length != 0) {
                        newArray = newArray.concat(questionArray);
                    }
                });
                resolve([filterObjects, newArray, quizzes]);
            });
        });
    });
}

/*************************************************
 *                applyFilters()
 * 
 * Parameters: Array
 * 
 * Description: The applyFilters function takes in
 * an array containing two items: the filterObjects
 * and the questions to be filtered. This function
 * calls the filterStuff function for each
 * filterObject. Once finished, this function 
 * returns an array, wrapped in a promise,
 * containing the questions and the original
 * quizzes.
 * 
 * Return Type: Promise
 *************************************************/
function applyFilters(filterData) {
    return new Promise((resolve) => {
        var filterObjects = filterData[0];
        var questions = filterData[1];
        asyncLib.each(filterObjects, (filterObject, callback) => {
            questions = filterStuff(questions, filterObject);
            callback(null);
        }, err => {
            if (err) {
                logger.error(err);
            }
            resolve([questions, filterData[2]]);
        });
    });
}

/*************************************************
 *                createReport()
 * 
 * Parameters: Array, string/number, array, array
 * 
 * Description: The create report function creates
 * a dynamic HTML report using the Logger. It
 * creates an object to be reported based on the
 * amount of and which filterObjects given.
 * 
 * Return Type: Nothing
 *************************************************/
function createReport(filteredQuestions, courseID, quizzes, filterObjects) {
    canvas.get(`/api/v1/courses/${courseID}`, (err, course) => {
        var courseCode = course[0].course_code;
        logger.reportTitle = courseCode;
        asyncLib.each(filteredQuestions, (question, callback) => {
            var currentQuiz = quizzes.find(quiz => {
                return quiz.id === question.quiz_id;
            });
            var questionObj = { 'Question Number': question.position };
            filterObjects.forEach(filterObject => {
                if (filterObject.target.property !== 'answers') {
                    questionObj[filterObject.target.property] = question[filterObject.target.property];
                } else {
                    questionObj[filterObject.target.property] = question[filterObject.target.property].map(answer => {
                        return answer.text;
                    }).join();
                }
            });
            //Create the Logger report here
            logger.log(`${currentQuiz.title}`, questionObj);
            callback(null);
        }, err => {
            if (err) {
                logger.error(err);
            }
            logger.htmlReport('./reports');
            console.log('\nReport Created for: ' + courseCode);
        });
    });
}

/*************************************************
 *                main() - Driver
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
                    .then(questionData => {
                        createReport(questionData[0], courseID, questionData[1], filterData[0]);
                    });
                callback(null);
            });
        });
}

//This starts it all.
main();