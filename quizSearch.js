class QuizSearch {
    constructor(target = '', conditions = [], courseIDs = []) {
        this.target = target;
        this.conditions = conditions;
        this.courseIDs = courseIDs;
    }
}

module.exports = QuizSearch;