node src/get-executions.js -branch:"Unmerged scripts" -execution:"e2e-all / Regression"
node src/parse-execution.js  -execution:"e2e-all / Regression"
@REM node src/extractFailedTestIDs.js
node src/build-json.js
marge -i=true -p "Hubsync Regression Run" -t "Hubsync Regression Run" report/Hubsync_test_run_report.json -o ./html-report
@REM node  src/email-repport.js 