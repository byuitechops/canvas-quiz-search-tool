const Enquirer = require('enquirer');
const QuizSearch = require('./filterObject.js');
const asyncLib = require('async');
const d3 = require('d3-dsv');
const fs = require('fs');
const quizTargets = require('./quizQuestionTargets.js');

var enquirer = new Enquirer();
enquirer.register('checkbox', require('prompt-checkbox'));
enquirer.register('radio', require('prompt-radio'));

//Types of questions available from Canvas
const questionsTypes = ['Multiple Choice', 'True/False', 'Fill in the Blank', 'Fill in Multiple Blanks',
    'Multiple Answers', 'Multiple Dropdowns', 'Matching', 'Numerical Answer', 'Formula Question',
    'Essay Question', 'File Upload Question', 'Text (no question)'];

//Conditions for selection
const conditions = {
    contains: 'Contains',
    equal_to: 'Equal to',
    greater_than: 'Greater than',
    less_than: 'Less than',
    length: 'Length'
};

//Target objects for selection.
var targets = [{
    target: 'Answers',
    conditions: [conditions.contains, conditions.equal_to, conditions.length],
    input_Required: true
}, {
    target: 'Answer Comments',
    conditions: [conditions.contains, conditions.equal_to, conditions.length],
    input_Required: true
}, {
    target: 'Question Comments',
    functionCall: getQuestionComments,
    conditions: [conditions.contains, conditions.equal_to, conditions.length],
    input_Required: true
}, {
    target: 'Point Value',
    conditions: [conditions.equal_to, conditions.greater_than, conditions.less_than],
    input_Required: true
}, {
    target: 'Question Text',
    conditions: [conditions.contains, conditions.equal_to, conditions.length],
    input_Required: true
}, {
    target: 'Title',
    conditions: [conditions.contains, conditions.equal_to, conditions.length],
    input_Required: true
}, {
    target: 'Type',
    conditions: questionsTypes,
    input_Required: false
}, {
    target: 'Get All Questions',
    conditions: false,
    input_Required: false
}];

//Question 1 - Targets
var menuQuestions = [
    {
        name: 'menuChoice',
        message: 'Select a Target below using the spacebar:',
        type: 'radio',
        choices: ['Answers', 'Answer Comments', 'Question Comments', 'Point Value', 'Question Text', 'Title', 'Type', 'Get All Questions']
    }
];

//Question 2 - Conditions
var conditionQuestions = [
    {
        name: 'conditionChoices',
        message: 'Select Conditions below using the spacebar: \n(To select none, press enter)',
        type: 'checkbox',
        choices: []
    }
];

//Question 3 - User Input
//For the moment this is found in the askQuestionThree function.

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
        .then(answers => {
            var target = answers.menuChoice;
            conditionQuestions[0].choices = targets.find(currentTarget => {
                return currentTarget.target == target;
            }).conditions;
            target = targets.find(currentTarget => {
                return currentTarget.target == target;
            });
            return target;
        }).catch(() => {
            console.clear();
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
    return enquirer.prompt(conditionQuestions)
        .then(answers => {
            var conditions = [];
            if (!target.input_Required) {
                conditions = answers.conditionChoices;
                var quizSearch = new QuizSearch(target.target, conditions, [], target.functionCall);
                return quizSearch;
            } else {
                conditions = answers.conditionChoices.map(answer => {
                    return {
                        condition: answer,
                        user_input: ''
                    };
                });
                target.conditions = conditions;
                return target;
            }
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
function askQuestionThree(target) {
    if (!target.input_Required) {
        return target;
    } else {
        return new Promise((resolve) => {
            asyncLib.eachSeries(target.conditions, (condition, callback) => {
                //Ask Question 3 - User Input
                var userInput = enquirer.question({
                    name: 'userInput',
                    message: condition.condition + ':',
                });
                enquirer.prompt(userInput).then(answer => {
                    condition.user_input = answer.userInput;
                    callback();
                });
            }, () => {
                var quizSearch = new QuizSearch(target.target, target.conditions, [], target.functionCall);
                resolve(quizSearch);
            });
        });
    }
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
    .then(readFile)
    .then((quizSearch) => {
        console.clear();
        console.log('Starting');
        quizSearch.functionCall(quizSearch);
    });