const stats = require('stats-lite');
const difference = require('lodash/difference');
const indexOf = require('lodash/indexOf');

/**
 * Takes a time string and encodes it in order to compute mode and find best time slots.
 * @param {String} time 
 * @returns {String}
 */
const getTimeCode = (time, dayNum) => `${dayNum}${time.trim().slice(0, -2).replace(':', '8')}`;

/**
 * Wrapper function that takes in either a set of mode values or a single mode; if the mode is a set - prettyPrintTime() is called for each element
 * if the mode is singular - prettyPrintTime() is simply called with that value.
 * @param {Object/Number} bestTime
 * @returns {Promise}
 */
const printTimeSlotWrapper = (bestTime) => {
    return new Promise((resolve, reject) => {
        if (!bestTime) { reject('Mode is undefined'); }
        if (typeof bestTime === 'object') {
            resolve(bestTime.forEach((timeCode) => {
                prettyPrintTime(timeCode.toString());
            }));
        } else {
            resolve(prettyPrintTime(bestTime.toString()));
        }
    }).catch((err) => console.log(err));
};

/**
 * Takes in an encoded time string and converts it to a readable time string.
 * @param {String} timeCode 
 */
const prettyPrintTime = (timeCode) => {
    const dayCode = timeCode.slice(0, 1);
    getDay(dayCode).then((day) => {
        console.log(`${day}: ${timeCode.slice(1, ).replace('8', ':')}`);
    });
};

/**
 * Takes in encoded day numeral; calls a function to map that numeral to corresponding weekday; returns a Promise to async print Day/Time string.
 * @param {String} dayCode 
 * @returns {Promise}
 */
const getDay = (dayCode) => {
    return new Promise((resolve, reject) => {
        resolve(daySwitch(parseInt(dayCode, 10)));
    }).catch((err) => console.log(err));
};

/**
 * Takes in encoded day numeral converted to Int via getDay(); returns corresponding Weekday as a String.
 * @param {Integer} dayCode 
 * @returns {String}
 */
const daySwitch = (dayCode) => {
    switch (dayCode) {
        case 1:
            return 'Monday';
            break;
        case 2:
            return 'Tuesday';
            break;
        case 3: 
            return 'Wednesday';
            break;
        case 4:
            return 'Thursday';
            break;
        case 5:
            return 'Friday';
            break; 
    };
};

/**
 * Takes in an array of time slots and an optional variable for previous mode. Function returns a promise and calls findMode().
 * @param {Array} timeArray 
 * @param {Object/Number} prevMode 
 * @returns {Promise}
 */
const findTimeSlotWrapper = (timeArray, prevMode = undefined) => {
    return new Promise((resolve, reject) => {
        if (!timeArray) { reject('Array is undefined'); }
        resolve(findTimeSlot(timeArray, prevMode));
    }).catch((err) => console.log(err));
};

/**
 * Called by findModeWrapper; checks type of prevMode - if it is a set of values; creates an array of strings in order to remove 
 * elements of the previous mode and recalculate for second best time slot(s). If it is a single value - it simply removes that value from the array
 * of time slots and recalculates. If prevMode is undefined; it simply calculates the mode for the first time.
 * @param {Array} timeArray 
 * @param {Object/Number} prevMode 
 */
const findTimeSlot = (timeArray, prevMode) => {
    if (typeof prevMode === 'object') {
        // If first mode is a set of values.
        let modeArray = [...prevMode];
        modeArray = modeArray.map((number) => number.toString());
        return stats.mode(difference(timeArray, modeArray));
    } else if (typeof prevMode === 'number') {
        // If first mode is a single value.
        return stats.mode(difference(timeArray, [prevMode.toString()]));
    } else {
        // If this is the first time mode is computed.
        return stats.mode(timeArray);
    }
};

module.exports = {
    getTimeCode,
    findTimeSlotWrapper,
    printTimeSlotWrapper
};
