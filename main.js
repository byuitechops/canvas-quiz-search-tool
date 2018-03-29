const canvas = require('canvas-wrapper');
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
const questionsTypes = ['Multiple Choice', 'True/False', 'Fill in the Blank', 'Fill in Multiple Blanks',
    'Multiple Answers', 'Multiple Dropdowns', 'Matching', 'Numerical Answer', 'Formula Question',
    'Essay Question', 'File Upload Question', 'Text (no question)'];

//Question 1 - Targets
var menuQuestions = [
    {
        name: 'menuChoice',
        message: 'Select a Target below using the spacebar:',
        type: 'radio',
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
 * Questions to focus on. The user may only 
 * choose one. This function returns the selected 
 * target as a JavaScript object.
 * 
 * Return Type: Object
 *************************************************/
function askQuestionOne() {
    return enquirer.prompt(menuQuestions)
        .then(answer => {
            return quizTargets[answer.menuChoice];
        }).catch(() => {
            return askQuestionOne();
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

/*************************************************
 *         askQuestionThree() - User Input
 * 
 * Parameters: Object
 * 
 * Description: This function is called when the 
 * target's conditions require input from the 
 * user. Returns a QuizSearch object.
 * 
 * Return Type: Object
 *************************************************/
function askQuestionThree(filterObject) {
    return new Promise((resolve) => {
        asyncLib.eachSeries(filterObject.conditions, (condition, callback) => {
            //Ask Question 3 - User Input
            if (condition.conditionName === 'Has Answers') {
                callback();
            } else {
                var userInput = enquirer.question({
                    name: 'userInput',
                    message: condition.conditionName + ':',
                });
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
function readFile(quizSearch) {
    return new Promise((resolve, reject) => {
        fs.readFile('courseIDs.csv', 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                quizSearch.courseIDs = convertCSV(data);
                resolve(quizSearch);
            }
        });
    });
}

/*************************************************
 *                    Driver
 * 
 * Calls all the necessary functions to run the
 * program. Waterfall style.
 *************************************************/
askQuestionOne()
    .then(askQuestionTwo)
    .then(askQuestionThree)
    .then(filterObject => {
        canvas.get('/api/v1/courses/10463/quizzes/92999/questions', (err, questions) => {
            if (err) console.log(err);
            else {
                console.log(filterStuff(questions, filterObject));
                //filterStuff(questions, filterObject);
            }
        });
    });
// .then(readFile)
// .then((quizSearch) => {
//     console.clear();
//     console.log('Starting');
//     quizSearch.functionCall(quizSearch);
// });