const canvas = require('canvas-wrapper');
const asyncLib = require('async');
const Logger = require('logger');



module.exports = (quizSearch) => {
    asyncLib.each(quizSearch.courseIDs, (courseID, eachCallback) => {
        const logger = new Logger();

        // Get all of the quizzes
        canvas.getQuizzes(courseID, (quizzesErr, quizzes) => {
            if (quizzesErr) {
                logger.error(quizzesErr);
                eachCallback(null);
                return;
            }

            // Get the quiz questions for each quiz
            function getQuestions(quiz, callback) {
                if (quiz.question_count > 0) {
                    canvas.getQuizQuestions(courseID, quiz.id, (questionErr, questions) => {
                        if (questionErr) {
                            questionErr.message += '\n<strong>Quiz Title: ' + quiz.title + '</strong>';
                            logger.error(questionErr);
                            callback(null);
                            return;
                        }
                        var questionsWithFeedback = questions.filter(question => {
                            if (question.question_type != 'text_only_question') {
                                return question.correct_comments ||
                                    question.neutral_comments ||
                                    question.incorrect_comments ||
                                    question.correct_comments_html ||
                                    question.neutral_comments_html ||
                                    question.incorrect_comments_html;
                            } else {
                                return false;
                            }
                        });

                        var checkMark = '<p style="text-align:center">&#x2714;</p>';
                        questionsWithFeedback.forEach(question => {
                            logger.log(`${quiz.title}`, {
                                'Question Number': question.position,
                                'Neutral Comments': question.neutral_comments ? checkMark : '',
                                'Correct Comments': question.correct_comments ? checkMark : '',
                                'Incorrect Comments': question.incorrect_comments ? checkMark : '',
                                'Neutral Comments HTML': question.neutral_comments_html ? checkMark : '',
                                'Correct Comments HTML': question.correct_comments_html ? checkMark : '',
                                'Incorrect Comments HTML': question.incorrect_comments_html ? checkMark : '',
                            });
                        });

                        callback(null);
                    });
                } else {
                    callback(null);
                }
            }

            // For each quiz, append its questions to the accumulator

            asyncLib.eachLimit(quizzes, 10, getQuestions, (eachErr) => {
                if (eachErr) {
                    logger.error(eachErr);
                    return;
                }
                logger.setHeader('<h2>Quiz Questions with Feedback</h2><p>Each section below contains all of the questions for each quiz that contain question feedback for correct and incorrect answers, as well as feedback that shows regardless.');
                canvas.get(`/api/v1/courses/${courseID}`, (courseErr, courses) => {
                    if (courseErr) {
                        eachCallback(null);
                    } else {
                        logger.htmlReport('.', `${courses[0].course_code} Quiz Question Feedback`);
                        eachCallback(null);
                    }
                });
            });
        });

    }, err => {
        if (err) {
            console.log(err);
        }
        console.log('Finished');
    });
};
