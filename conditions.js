const truthy = function (items) {
    return items.some(item => {
        if (item) {
            return true;
        } else {
            return false;
        }
    });
};

const falsey = function (items) {
    return items.some(item => {
        if (!item) {
            return true;
        } else {
            return false;
        }
    });
};

const lessThan = function (items, value) {
    return items.some(item => {
        if (item === null) {
            return false;
        }
        return item < value;
    });
};

const greaterThan = function (items, value) {
    return items.some(item => {
        if (item === null) {
            return false;
        }
        return item > value;
    });
};

const lessThanOrEqualTo = function (items, value) {
    return items.some(item => {
        if (item === null) {
            return false;
        }
        return item <= value;
    });
};

const greaterThanOrEqualTo = function (items, value) {
    return items.some(item => {
        if (item === null) {
            return false;
        }
        return item >= value;
    });
};

const equalTo = function (items, value) {
    return items.some(item => {
        if (item === null) {
            return false;
        }
        return item == value;
    });
};

const notEqualTo = function (items, value) {
    return !equalTo(items, value);
};

const contains = function (items, value) {
    return items.some(item => {
        if (item === null) {
            return false;
        }
        return item.includes(value);
    });
};

const doesNotContain = function (items, value) {
    return !contains(items, value);
};

//Question Type Function
const questionType = function (items, value) {
    return items.some(item => {
        return item === value;
    });

};

//Question Answer Specific Functions 
const answersTruthy = function (items) {
    return items.some(item => {
        if (item.text) {
            return true;
        } else {
            return false;
        }
    });
};
const answersFalsey = function (items) {
    return items.some(item => {
        if (!item.text) {
            return true;
        } else {
            return false;
        }
    });
};
const answersEqualTo = function (items, value) {
    return items.some(item => {
        return item.text === value;
    });
};
const answersNotEqualTo = function (items, value) {
    return !answersEqualTo(items, value);
};
const answersContains = function (items, value) {
    return items.some(item => {
        if (!item.text) {
            return false;
        } else {
            return item.text.includes(value);
        }
    });
};
const answersDoesNotContain = function (items, value) {
    return !answersContains(items, value);
};

//Answer Comment Specific Functions
const answerCommentsTruthy = function (items) {
    return items.some(item => {
        return item.comments || item.comments_html;
    });
};
const answerCommentsFalsey = function (items) {
    return items.some(item => {
        return !item.comments && !item.comments_html;
    });
};
const answerCommentsEqualTo = function (items, value) {
    return items.some(item => {
        return item.comments === value || item.comments_html === value;
    });
};
const answerCommentsNotEqualTo = function (items, value) {
    return !answerCommentsEqualTo(items, value);
};
const answerCommentsContains = function (items, value) {
    return items.some(item => {
        if (item.comments != undefined && item.comments_html != undefined) {
            return item.comments.includes(value) || item.comments_html.includes(value);
        } else if (item.comments != undefined) {
            return item.comments.includes(value);
        } else if (item.comments_html != undefined) {
            return item.comments_html.includes(value);
        } else {
            return false;
        }
    });
};
const answerCommentsDoesNotContain = function (items, value) {
    return !answerCommentsContains(items, value);
};

//Export all the Condition Functions
module.exports = {
    //General Condition Functions
    truthy,
    falsey,
    lessThan,
    lessThanOrEqualTo,
    greaterThan,
    greaterThanOrEqualTo,
    equalTo,
    notEqualTo,
    contains,
    doesNotContain,
    questionType,
    //Answer Specific Functions
    answersTruthy,
    answersFalsey,
    answersEqualTo,
    answersNotEqualTo,
    answersContains,
    answersDoesNotContain,
    //Answer Comment Specific Functions
    answerCommentsTruthy,
    answerCommentsFalsey,
    answerCommentsEqualTo,
    answerCommentsNotEqualTo,
    answerCommentsContains,
    answerCommentsDoesNotContain,
};