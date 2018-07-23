const csv = require('csv');
const fs = require('fs');
const stats = require('stats-lite');
const difference = require('lodash/difference');
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
        let dateCodeArray = [].concat.apply([], totalAvail);
        // Find best times
        let mode = stats.mode(dateCodeArray);
        let modeArray = Array.from(mode);
        console.log(`Mode array: ${modeArray}`);
        let testArray = difference(dateCodeArray, [...modeArray]);
        if (indexOf(testArray, modeArray[0]) !== -1) { console.log('Without() not working'); }
        const newMode = stats.mode(testArray);
        console.log(`First Mode: ${[...mode]}, Second Mode: ${[...newMode]}`);
        console.log(...testArray.sort());

        generateDataset(dateCodeArray)
            .then((bestTime) => {
                console.log('\nBest times:');
                console.log(bestTime);
                printWrapper(bestTime);
                return generateDataset(dateCodeArray, bestTime);
            })
            .then((secondBestTime) => {
                console.log('\nSecond best times:');
                const newArray = without(dateCodeArray, ...secondBestTime);
                secondBestTime ? console.log(secondBestTime) : console.log('Undefined');
                printWrapper(secondBestTime);
            });
    });
});

/**
 * Takes a time string and encodes it in order to compute mode and find best time slots.
 * @param {String} time 
 * @returns {String}
 */
const getTimeCode = (time, dayNum) => `${dayNum}${time.trim().slice(0, -2).replace(':', '8')}`;

const printWrapper = (bestTime) => {
    return new Promise((resolve, reject) => {
        if (typeof bestTime === 'object') {
            resolve(bestTime.forEach((timeCode) => {
                prettyPrintTime(timeCode.toString());
            }));
        } else {
            resolve(prettyPrintTime(bestTime.toString()));
        }
    });
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

const generateDataset = (timeArray, prevMode = undefined) => {
    return new Promise((resolve, reject) => {
        if (prevMode === 'object') {
            resolve(findMode(without(timeArray, [...prevMode])));
        } else {
            resolve(findMode(timeArray));
        }
    }).catch((err) => console.log('Issue detected'));
};

const findMode = (timeArray) => {
    return stats.mode(timeArray);
};
