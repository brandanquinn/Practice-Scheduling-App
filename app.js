const csv = require('csv');
const fs = require('fs');
const { getTimeCode, findTimeSlotWrapper, printTimeSlotWrapper } = require('./utils/utils'); 

fs.readFile('./availability-test.csv', (err, data) => {
    if (err) throw err;
    const csv_string = data.toString();
    csv.parse(csv_string, (err, data) => {
        if (err) throw err;
        // Iterate through each individuals availability within data array to generate a single array of encoded day/time strings.
        let totalAvail = [];
        // Ignores first row containing table headers.
        for (var i = 1; i < data.length; i++) {
            data[i] = data[i].map((avail, column) => {
                // if column is between 2 and 6 (time data columns), parses string to array based on ',' as delimeter, encodes them and pushes to array.
                if (column < 2 || column > 6) { return avail; }
                totalAvail.push(avail.split(',').map((time) => {
                    if (time) {
                        return getTimeCode(time, column-1)
                    }
                }));
            });
        };
        // Converts array of nested arrays into one array of timeCodes.
        let dateCodeArray = [].concat.apply([], totalAvail);


        findTimeSlotWrapper(dateCodeArray)
            .then((bestTime) => {
                console.log('Best times:');
                printTimeSlotWrapper(bestTime);
                return bestTime;
            })
            .then((prevMode) => findTimeSlotWrapper(dateCodeArray, prevMode)) 
            .then((secondBestTime) => {
                console.log('\nSecond best times:');
                printTimeSlotWrapper(secondBestTime);
            });
    });
});