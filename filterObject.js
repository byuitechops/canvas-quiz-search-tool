class FilterObject {
    constructor(target = '', conditions = []) {
        this.target = target;
        this.conditions = conditions;
        this.courseIDs = '';
    }
}
module.exports = FilterObject;