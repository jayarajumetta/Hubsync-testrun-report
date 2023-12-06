const fs = require('fs');
const axios = require('axios');
var responseFile = './report/testim_response.json';
var responseTestResultFile = './report/testim_testresult_response.json';
const jsonpath = require('jsonpath');


const token = 'PAK-xkKZmb9M38qKTn-KSVDETY9y22fS7N4vmZCTHtfXp/Xd4SHFR5gwgzTrAUJz9PJBWnzVJ2j/d/nI2vZ3G';
let failureIDs = [];
async function extractFailedTestIDs() {
    // Read the contents of the JSON file
    const response = fs.readFileSync(responseFile);
    // Parse the JSON data into a JavaScript object
    const responseData = JSON.parse(response);
    console.log("Before Adding data", JSON.stringify(responseData, null, 4));
    responseData.execution.tests.forEach(async (test) => {
        if (test.executionStatus.toLowerCase() == 'failed') {
            var resultID = test.resultId;
            failureIDs.push(resultID);
        }
    }
    );
}
async function extractFailedTestScreenshots() {
    // Read the contents of the JSON file
    const response = fs.readFileSync(responseFile);
    // Parse the JSON data into a JavaScript object
    const responseData = JSON.parse(response);
    // Read the contents of the JSON file
    console.log("Before Adding data", JSON.stringify(responseData, null, 4));
    const responseFailedTest = fs.readFileSync(responseTestResultFile);
    // Parse the JSON data into a JavaScript object
    const responseFailedTestData = JSON.parse(responseFailedTest);
    console.log("Before Adding data", JSON.stringify(responseFailedTestData, null, 4));
    responseFailedTestData.pop();
    responseFailedTestData.forEach(async (test) => {
        var testId = test.testId;
        const expression = `$[?(@.id === \"${testId}\")]`;
        // Use jsonpath to find the item   
        const screenshot_path = test.screenshot;
        jsonpath.query(responseData.execution.tests, expression)[0].linkToFailureIssue = screenshot_path ;
    }
    );
    fs.writeFileSync(responseFile, JSON.stringify(responseData, null, 2));
}
async function getFailedTestResponse(resultID, token, page = 1) {

    try {
        const response = await axios.get(`https://api.testim.io/runs/tests/${resultID}?runParams=false&stepsResults=true`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        const expression = '$[?(@.status === "FAILED")]';
        // Use jsonpath to find the item
        const screenshot_path = jsonpath.query(response.data.testResult.stepsResults, expression)[0].screenshot;
        // Write the response data to a file
        const step_screenshot = {
            'testId': response.data.testResult.testId,
            'screenshot': screenshot_path
        }
        fs.appendFileSync(responseTestResultFile, JSON.stringify(step_screenshot, null, 2) + ',');
    } catch (error) {
        console.log('Error:', error);
    }
}
const getAllThefilureImage = (failureIDs) => {
    fs.writeFileSync(responseTestResultFile, '[');
    Promise.all(failureIDs.map(v => getFailedTestResponse(v, token))).then((resolvedValues) => {
        fs.appendFileSync(responseTestResultFile, '{}]');
        extractFailedTestScreenshots()
    });
}
extractFailedTestIDs()
getAllThefilureImage(failureIDs)
