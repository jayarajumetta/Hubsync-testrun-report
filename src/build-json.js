const fs = require('fs');
const axios = require('axios');
var responseFile = './report/testim_response.json';
var responseTestResultFile = './report/testim_testresult_response.json';

var templateFile = './report/html_report_template.json';
var finalReportFile = './report/Hubsync_test_run_report.json';
const { v4: uuidv4 } = require('uuid');
const jsonpath = require('jsonpath');
const request = require('request');
const { Console } = require('console');

const token = 'PAK-xkKZmb9M38qKTn-KSVDETY9y22fS7N4vmZCTHtfXp/Xd4SHFR5gwgzTrAUJz9PJBWnzVJ2j/d/nI2vZ3G';
let failureIDs = [];
async function buildJson() {
    // Read the contents of the JSON file
    const response = fs.readFileSync(responseFile);
    // Parse the JSON data into a JavaScript object
    const responseData = JSON.parse(response);
    // console.log("Before Adding data", JSON.stringify(responseData, null, 4));
    // Read the contents of the JSON file
    const template = fs.readFileSync(templateFile);
    // Parse the JSON data into a JavaScript object
    const templateData = JSON.parse(template);
    // console.log("Before Adding data", JSON.stringify(templateData, null, 4));
    templateData.stats.tests = responseData.execution.totalTests;
    templateData.stats.testsRegistered = responseData.execution.totalTests;
    templateData.stats.failures = responseData.execution.failedCount;
    templateData.stats.passes = responseData.execution.totalTests - responseData.execution.failedCount;

    templateData.stats.start = responseData.execution.startTime;
    templateData.stats.duration = responseData.execution.duration;
    templateData.stats.passPercent = ((responseData.execution.totalTests - responseData.execution.failedCount) / responseData.execution.totalTests) * 100
    templateData.results[0].suites[0].title = responseData.execution.execution;
    templateData.results[0].suites[0].duration = responseData.execution.duration;
    responseData.execution.tests.forEach(async (test) => {
        const randomUUID = uuidv4();
        console.log(randomUUID);
        const testResultOBJ = {
            "title": test.testName,
            "fullTitle": test.testName,
            "timedOut": null,
            "duration": test.duration,
            "state": test.executionStatus.toLowerCase(),
            "speed": null,
            "pass": false,
            "fail": false,
            "pending": false,
            "context": "{\n  \"title\": \"Failed-Step-Screenshot\",\n  \"value\": [\n \"image#png\"]\n}",
            "code": "All test steps are a success.",
            "err": {
                "message": "",
                "estack": "",
                "diff": ""
            },
            "uuid": "92bdf36b-e186-4c9c-be43-97d860490e65",
            "parentUUID": "77b20a73-0825-4d5e-af3b-0b21319aefdf",
            "isHook": false,
            "skipped": false
        }

        if (testResultOBJ.duration == "N/A") {
            testResultOBJ.duration = 0;
        }
        if (test.executionStatus.toLowerCase() == 'failed') {
            testResultOBJ.fail = true;
            testResultOBJ.context = testResultOBJ.context.replace('image',test.linkToFailureIssue);
            var resultID = test.resultId;
            failureIDs.push(resultID);
            templateData.results[0].suites[0].failures.push(randomUUID);

            if (test.failedSteps.length > 0) {
                if (test.failedSteps[0].name != undefined) {
                    testResultOBJ.err.message = test.failedSteps[0].name.replaceAll('"', '').replaceAll('/', '');
                }
                else {
                    testResultOBJ.err.message = "";
                }
            }
            else {
                testResultOBJ.err.message = ""
            }
            testResultOBJ.err.estack = test.errorMessage;
            testResultOBJ.err.diff = "- 'FAILED'\n+ 'PASSED'\n"; testResultOBJ.code = "";
        }
        else if (test.executionStatus.toLowerCase() == 'passed') {
            testResultOBJ.pass = true;
            testResultOBJ.err.diff = "- 'PASSED'\n+ 'PASSED'\n";
            testResultOBJ.context = "";
            templateData.results[0].suites[0].passes.push(randomUUID);
        }
        else {
            console.log("Test state is unknown" + test.executionStatus.toLowerCase());
        }
        templateData.results[0].suites[0].tests.push(testResultOBJ);
    }
    );
    // Convert the JavaScript object back into a JSON string
    const reportString = JSON.stringify(templateData, null, 2);

    fs.writeFileSync(finalReportFile, reportString, 'utf-8', (err) => {
        if (err) throw err;
        console.log('Data added to file');
    });

    const update_data = fs.readFileSync(finalReportFile);
    const updated_jsonData = JSON.parse(update_data);
    // console.log("After Adding data", JSON.stringify(updated_jsonData, null, 4));
}
buildJson()
