const conditions = require('./conditions.js');

module.exports = {
    'Question Answers': {
        conditions: {
            'Equal To': conditions.equalTo,
            'Not Equal To': conditions.notEqualTo,
            'Contains': conditions.contains,
            'Does Not Contain': conditions.doesNotContain,
        },
        property: 'answers' //An Array of answers.
    },
    'Answer Comments': {
        conditions: {
            'Equal To': conditions.equalTo,
            'Not Equal To': conditions.notEqualTo,
            'Contains': conditions.contains,
            'Does Not Contain': conditions.doesNotContain,
        },
        property: 'answers' //I need to go one layer deaper. answer[i].answer_comments
    },
    'Question Comments': {
        conditions: {
            'Equal To': conditions.equalTo,
            'Not Equal To': conditions.notEqualTo,
            'Contains': conditions.contains,
            'Does Not Contain': conditions.doesNotContain,
        },
        property: ['correct_comments', 'incorrect_comments', 'neutral_comments',
            'question.correct_comments_html', 'question.neutral_comments_html', 'question.incorrect_comments_html']
    },
    'Point Value': {
        conditions: {
            'Less Than': conditions.lessThan,
            'Greater Than': conditions.greaterThan,
            'Equal To': conditions.equalTo
        },
        property: 'points_possible'
    },
    'Question Text': {
        conditions: {
            'Equal To': conditions.equalTo,
            'Not Equal To': conditions.notEqualTo,
            'Contains': conditions.contains,
            'Does Not Contain': conditions.doesNotContain,
        },
        property: 'question_text'
    },
    'Question Title': {
        conditions: {
            'Equal To': conditions.equalTo,
            'Not Equal To': conditions.notEqualTo,
            'Contains': conditions.contains,
            'Does Not Contain': conditions.doesNotContain,
        },
        property: 'question_name'
    },
    'Question Type': {
        conditions: {
            'Question Type': conditions.questionType
        },
        property: 'question_type'
    }

};