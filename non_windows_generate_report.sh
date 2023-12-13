node src/get-executions.js -branch:"Unmerged scripts" -execution:"e2e-all / Regression"
node src/parse-execution.js  -execution:"e2e-all / Regression"
# node src/extractFailedTestIDs.js
node src/build-json.js
marge -i=true -p "Hubsync Regression Run" -t "Hubsync Regression Run" report/Hubsync_test_run_report.json -o ./html-report
# node  src/email-repport.js 