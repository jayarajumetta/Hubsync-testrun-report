
branch="master"
execution="End to End-All-Sequential / Regression2-Sequential"
node src/get-executions.js -branch:$branch -execution:"$execution"
node src/parse-execution.js  -execution:"$execution"
node src/extractFailedTestIDs.js
node src/build-json.js
marge -i=true -p "Hubsync Regression Run" -t "Hubsync Regression Run" report/Hubsync_test_run_report.json -o ./html-report
# node  src/email-repport.js 