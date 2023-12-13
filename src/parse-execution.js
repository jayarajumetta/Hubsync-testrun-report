const axios = require('axios');
const fs = require('fs');
var responseFile = './report/testim_response.json';
var executionListFile = './report/testim_execution_list_response.json';
const jsonpath = require('jsonpath');
var apiUrl;

const token = 'PAK-xkKZmb9M38qKTn-KSVDETY9y22fS7N4vmZCTHtfXp/Xd4SHFR5gwgzTrAUJz9PJBWnzVJ2j/d/nI2vZ3G';
var executionId;
const args = process.argv.slice(2);
console.log('Arguments:', args);
function getExectionByName(eName) {
  let isExecutionIdSet = false;
  args.forEach(v => { 
    if(v.includes("executionId")){
      isExecutionIdSet = true;
    } 
  });
  if (!isExecutionIdSet) {
  fs.writeFileSync(responseFile, JSON.stringify({}, null, 2));
  // Read the contents of the JSON file
  const responseExecutionList = fs.readFileSync(executionListFile);
  // Parse the JSON data into a JavaScript object
  const responseExecutionData = JSON.parse(responseExecutionList);

  const executionList = fs.readFileSync(executionListFile);
  // Parse the JSON data into a JavaScript object
  const executionListData = JSON.parse(executionList);

  // Custom comparator function for sorting by ISO date
  const sortByIsoString = (a, b) => new Date(b.startTime) - new Date(a.startTime);
  // Sort the JSON array based on isoString key
  executionListData.executions.sort(sortByIsoString);
  // Now, jsonArray is sorted by isoString
  console.log(executionListData.executions);
  // Write the response data to a file
  fs.writeFileSync(executionListFile, JSON.stringify(executionListData, null, 2));

  const expression = `$[?(@.execution === \"${eName}\" && !(@.executionResult === \"ABORTED\"))]`;
  // Use jsonpath to find the item
  executionId = jsonpath.query(responseExecutionData.executions,expression)[0].executionId;
  apiUrl = `https://api.testim.io/v2/runs/executions/${executionId}?page=0&pageSize=200000`;
  console.log(apiUrl);

  // console.log("Before Adding data", JSON.stringify(responseExecutionData, null, 4));
  }
  else{
    console.log("Passed Arguments"+args)
  }}

async function getAllTestResponses(url, token, page = 0) {
  try {
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });

    // Write the response data to a file
    fs.writeFileSync(responseFile, JSON.stringify(response.data, null, 2));

    // ...

    if (response.data.pagination && response.data.pagination.hasNext) {
      const nextPage = page + 1;
      return getAllTestResponses(url, token, nextPage);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}
let execution;
args.forEach(arg => { 
  if(arg.includes("executionId")){
    console.log("executionId is included in args");
  }
  else{
    if(arg.split(':')[0].includes('branch')){
      branch = arg.split(':')[1];
      console.log("Included in args:"+args);
    }
    else if(arg.split(':')[0].includes('execution')){
      execution = arg.split(':')[1];
      console.log("Included in args:"+args);
    }
    else if(arg.split(':')[0].includes('executionId')){
      executionId = arg.split(':')[1];
      console.log("Included in args:"+args);
      apiUrl = `https://api.testim.io/v2/runs/executions/${executionId}?page=0&pageSize=200000`;
      console.log(apiUrl);
    }
    else{
      console.log("Included in args:"+args);
    }
  }
});
getExectionByName(execution)
getAllTestResponses(apiUrl, token);