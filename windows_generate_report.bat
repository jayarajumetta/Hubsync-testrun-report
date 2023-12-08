node src/get-executions.js -branch:"Unmerged scripts" -execution:"End to End - All / Regression"
node src/parse-execution.js  -execution:"End to End - All / Regression"
node src/extractFailedTestIDs.js
node src/build-json.js
marge -i=true -p "Hubsync Regression Run" -t "Hubsync Regression Run" report/Hubsync_test_run_report.json -o ./html-report
@REM node  src/email-repport.js 