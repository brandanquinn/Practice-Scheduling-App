# Practice-Scheduling-App

## Overview

This is an App I quickly developed using Node.js to parse a CSV file containing scheduling information and find the best time
slots to host practices for our team. Currently, requires an availability.csv file within the main directory.

## CSV Formatting

The CSV format I use is the default format that the 'Find a Time' Google Form template generates when you link it to a Sheets
file. It also requires that you set up the time slot section as such: https://imgur.com/DkAX5q0 You can add additional time
slots, but currently only at 30 minute intervals.

## Features to come

* Looking into the Sheets API in order to pull live updates from your scheduling sheet.
* Need to make date encoding scalable - currently if you use an '8' in your time it will interfere with the date
string encoding/decoding function.
* Need to add a csv file in the repo for testing/formatting purposes.