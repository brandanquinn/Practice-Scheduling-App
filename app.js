const csv = require('csv');
const fs = require('fs');
const { getTimeCode, findModeWrapper, printWrapper } = require('./utils/utils'); 

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

        // Need to convert each element of bestTime to string.
        findModeWrapper(dateCodeArray)
            .then((bestTime) => {
                console.log('\nBest times:');
                console.log(bestTime);
                printWrapper(bestTime);
                return bestTime;
            })
            .then((prevMode) => findModeWrapper(dateCodeArray, prevMode)) 
            .then((secondBestTime) => {
                console.log('\nSecond best times:');
                console.log(secondBestTime);
                printWrapper(secondBestTime);
            })
    });
});