node get-executions.js
node src/parse-execution.js
node extractFailedTestIDs
node src/build-json.js
marge -i=true -p "Hubsync Regression Run" -t "Hubsync Regression Run" report/Hubsync_test_run_report.json