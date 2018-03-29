const canvas = require('canvas-wrapper');
const quizTargets = require('./quizQuestionTargets.js');

var filterStuff = (items, filterObject) => {
    return items.filter(item => {
        return filterObject.conditions.every(condition => {
            return condition.condition(item[filterObject.target.property], condition.value);
        });
    });
};


canvas.get('/api/v1/courses/10463/quizzes/92999/questions', (err, questions) => {
    if (err) console.log(err);
    else {
        console.log(filterStuff(
            questions,
            {
                target: quizTargets['Point Value'],
                conditions: [
                    { condition: quizTargets['Point Value'].conditions['Greater Than'], value: 5 },
                    { condition: quizTargets['Point Value'].conditions['Less Than'], value: 9 }
                ]
            }));
    }
});