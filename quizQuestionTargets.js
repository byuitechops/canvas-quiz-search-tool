const conditions = require('./conditions.js');

module.exports = {
    'Answers': {
        conditions: {
            'Has Answers': conditions.answersTruthy,
            'Does Not Have Answers': conditions.answersFalsey,
            'Equal To': conditions.answersEqualTo,
            'Not Equal To': conditions.answersNotEqualTo,
            'Contains': conditions.answersContains,
            'Does Not Contain': conditions.answersDoesNotContain,
        },
        property: 'answers' //An Array of answers.
    },
    'Answer Comments': {
        conditions: {
            'Has Comments': conditions.answerCommentsTruthy,
            'Does Not Have Comments': conditions.answerCommentsFalsey,
            'Equal To': conditions.answerCommentsEqualTo,
            'Not Equal To': conditions.answerCommentsNotEqualTo,
            'Contains': conditions.answerCommentsContains,
            'Does Not Contain': conditions.answerCommentsDoesNotContain,
        },
        property: 'answers' //I need to go one layer deaper. answer[i].comments, answer[i].comments_html
    },
    'Question Comments': {
        conditions: {
            'Has Comments': conditions.truthy,
            'Does Not have Comments': conditions.falsey,
            'Equal To': conditions.equalTo,
            'Not Equal To': conditions.notEqualTo,
            'Contains': conditions.contains,
            'Does Not Contain': conditions.doesNotContain,
        },
        property: ['correct_comments', 'incorrect_comments', 'neutral_comments',
            'correct_comments_html', 'neutral_comments_html', 'incorrect_comments_html']
    },
    'Point Value': {
        conditions: {
            'Has Point Values': conditions.truthy,
            'Does Not Have Point Values': conditions.falsey,
            'Less Than': conditions.lessThan,
            'Greater Than': conditions.greaterThan,
            'Equal To': conditions.equalTo
        },
        property: 'points_possible'
    },
    'Question Text': {
        conditions: {
            'Has Question Text': conditions.truthy,
            'Does Not Have Question Text': conditions.falsey,
            'Equal To': conditions.equalTo,
            'Not Equal To': conditions.notEqualTo,
            'Contains': conditions.contains,
            'Does Not Contain': conditions.doesNotContain,
        },
        property: 'question_text'
    },
    'Question Title': {
        conditions: {
            'Has Question Title': conditions.truthy,
            'Does Not Have Question Title': conditions.falsey,
            'Equal To': conditions.equalTo,
            'Not Equal To': conditions.notEqualTo,
            'Contains': conditions.contains,
            'Does Not Contain': conditions.doesNotContain,
        },
        property: 'question_name'
    },
    'Question Type': {
        conditions: {
            'Calculated': conditions.questionType,
            'Essay': conditions.questionType,
            'File Upload': conditions.questionType,
            'Fill In Multiple Blanks': conditions.questionType,
            'Matching': conditions.questionType,
            'Multiple Answers': conditions.questionType,
            'Multiple Choice': conditions.questionType,
            'Multiple Drowndowns': conditions.questionType,
            'Numerical': conditions.questionType,
            'Short Answer': conditions.questionType,
            'Text Only': conditions.questionType,
            'True/False': conditions.questionType
        },
        questionTypes: {
            'Calculated': 'calculated_question',
            'Essay': 'essay_question',
            'File Upload': 'file_upload_question',
            'Fill In Multiple Blanks': 'fill_in_multiple_blanks_question',
            'Matching': 'matching_question',
            'Multiple Answers': 'multiple_answers_question',
            'Multiple Choice': 'multiple_choice_question',
            'Multiple Drowndowns': 'multiple_dropdowns_question',
            'Numerical': 'numerical_question',
            'Short Answer': 'short_answer_question',
            'Text Only': 'text_only_question',
            'True/False': 'true_false_question'
        },
        property: 'question_type'
    }

};