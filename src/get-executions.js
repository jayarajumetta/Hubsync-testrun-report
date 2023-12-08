const axios = require('axios');
const fs = require('fs');
var responseFile = './report/testim_execution_list_response.json';

const token = 'PAK-xkKZmb9M38qKTn-KSVDETY9y22fS7N4vmZCTHtfXp/Xd4SHFR5gwgzTrAUJz9PJBWnzVJ2j/d/nI2vZ3G';
const args = process.argv.slice(2);
console.log('Arguments:', args);
async function getAllTestResponses(url, token, page = 1) {
  fs.writeFileSync(responseFile, JSON.stringify({}, null, 2));

  let isExecutionIdSet = false;
  args.forEach(v => { 
    if(v.includes("executionId")){
      isExecutionIdSet = true;
    } 
  });
  if (!isExecutionIdSet) {
    try {
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`
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
  else{
    console.log("Passed Arguments"+args)
  }
}

const today = new Date();
// Subtract 7 days (7 * 24 * 60 * 60 * 1000 milliseconds)
const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

const day = String(lastWeek.getDate()).padStart(2, '0');
const month = String(lastWeek.getMonth() + 1).padStart(2, '0');
const year = lastWeek.getFullYear();

const formattedLastWeekDate = `${month}-${day}-${year}`;

console.log(formattedLastWeekDate);

// const branchname = "Unmerged scripts";
// const executionName = "End to End - All / Regression";
let branch;
let execution;
let apiUrl;
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
    else{
      console.log("Included in args:"+args);
    }
  }
});
apiUrl = `https://api.testim.io/runs/executions?fromDate=${formattedLastWeekDate}&branch=${branch}&name=${execution}`;
console.log(apiUrl);
getAllTestResponses(apiUrl, token);