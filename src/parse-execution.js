const axios = require('axios');
const fs = require('fs');
var responseFile = './report/testim_response.json';
var executionListFile = './report/testim_execution_list_response.json';
const jsonpath = require('jsonpath');

const token = 'PAK-xkKZmb9M38qKTn-KSVDETY9y22fS7N4vmZCTHtfXp/Xd4SHFR5gwgzTrAUJz9PJBWnzVJ2j/d/nI2vZ3G';
let execution_id;

function getExectionByName(eName) {
  // Read the contents of the JSON file
  const responseExecutionList = fs.readFileSync(executionListFile);
  // Parse the JSON data into a JavaScript object
  const responseExecutionData = JSON.parse(responseExecutionList);
  const expression = `$[?(@.execution === \"${eName}\")]`;
  // Use jsonpath to find the item
  execution_id = jsonpath.query(responseExecutionData.executions,expression)[0].executionId;
  console.log("Before Adding data", JSON.stringify(responseExecutionData, null, 4));
}

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
const execution_name = "End to End - All / Regression";
const apiUrl = `https://api.testim.io/v2/runs/executions/${execution_id}?page=0&pageSize=200000`;

getExectionByName(execution_name)
getAllTestResponses(apiUrl, token);