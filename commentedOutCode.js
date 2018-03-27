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