# Practice-Scheduling-App

## Overview

This is an App I quickly developed using Node.js to parse a CSV file containing scheduling information and find the best time
slots to host practices for my Ultimate Frisbee team at school. Currently, requires an availability.csv file within the main directory.

## CSV Formatting

The CSV format I use is the default format that the 'Find a Time' Google Form template generates when you link it to a Sheets
file. It also requires that you set up the time slot section as such: [Form Table](https://imgur.com/DkAX5q0 "Form Screenshot") You can add additional time
slots, but currently only at 30 minute intervals. If you'd like to see the exact formatting, I've uploaded a reference csv file to the repo.

## How to Run

To run the app, all you need to do is: 
* migrate to folder 
* run 'yarn' in the console to install packages
* run 'node app.js'

Next - Currently the code opens and parses the availability-test.csv file.
To change that go to line 5 of app.js:
```javascript
fs.readFile('./availability-test.csv', (err, data) => {
```
Change this to:
```javascript
fs.readFile('./yourFileNameHere.csv', (err, data) => {
```
To change the data you can reference the Google Sheet here:
[CSV Reference](https://docs.google.com/spreadsheets/d/1k8RxCDqoXLEvpui2TgShXwoqRmVR-Zro5_uHdM92bUI/edit?usp=sharing "CSV Reference")

Change the data as necessary / add more based on your needs, then:
* download the file as a csv
* migrate file to the repo root folder
* make sure to correctly input your file in app.js (see above for guide)
* run 'node app.js' in console

## Features to come

* Looking into the Sheets API in order to pull live updates from your scheduling sheet.
* Need to make date encoding scalable - currently if you use an '8' in your time it will interfere with the date
string encoding/decoding function.
* Need to add a csv file in the repo for testing/formatting purposes.
