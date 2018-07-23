const csv = require('csv');
const fs = require('fs');
const stats = require('stats-lite');
const without = require('lodash/without');
const indexOf = require('lodash/indexOf');

fs.readFile('./availability.csv', (err, data) => {
    if (err) throw err;
    const csv_string = data.toString();
    csv.parse(csv_string, (err, data) => {
        if (err) throw err;
        // Iterate through each individuals availability within data array to generate a single array of encoded day/time strings.
        // After array is generated; find the mode object (might need package to do so)
        // After mode is found; remove all elements that match the mode and compute again for second time slot.
        let totalAvail = [];
        for (var i = 1; i < data.length; i++) {
            data[i] = data[i].map((avail, index) => {
                if (index < 2 || index > 6) { return avail; }
                totalAvail.push(avail.split(',').map((time) => {
                    if (time) {
                        return getTimeCode(time, index-1)
                    }
                }));
            });
        };
        // Converts array of nested arrays into one array of timeCodes.
        dateCodeArray = [].concat.apply([], totalAvail);
        const bestTime = stats.mode(dateCodeArray);
        // stats.mode() returns either a set of numbers if mode repeats or a single number.
        const bestTimeArray = [];
        if (typeof bestTime === 'object') {
            bestTime.forEach((timeCode) => {
                prettyPrintTime(timeCode.toString());
                bestTimeArray.push(timeCode.toString());
            });
            generateSecondDataset(dateCodeArray, bestTimeArray)
                .then((secondBestTime) => {
                    secondBestTime.forEach((timeCode) => prettyPrintTime(timeCode.toString()));
                });
        } else {
            prettyPrintTime(bestTime.toString());
            prettyPrintTime(generateSecondDataset(dateCodeArray, bestTime).toString());
        }
    });
});

/**
 * Takes a time string and encodes it in order to compute mode and find best time slots.
 * @param {String} time 
 * @returns {String}
 */
const getTimeCode = (time, dayNum) => `${dayNum}${time.trim().slice(0, -2).replace(':', '8')}`;

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
}

const generateSecondDataset = (timeArray, prevMode) => {
    return new Promise((resolve, reject) => {
        console.log('Second best time slots:');
        resolve(findMode(timeArray, prevMode));
    }).catch((err) => console.log(err));
}

const findMode = (timeArray, prevMode) => {
    return stats.mode(without(timeArray, prevMode));
}
