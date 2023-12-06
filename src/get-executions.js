const axios = require('axios');
const fs = require('fs');
var responseFile = './report/testim_execution_list_response.json';
 
const token = 'PAK-xkKZmb9M38qKTn-KSVDETY9y22fS7N4vmZCTHtfXp/Xd4SHFR5gwgzTrAUJz9PJBWnzVJ2j/d/nI2vZ3G';
 
async function getAllTestResponses(url, token, page = 1) {
  try {
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`      }
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

const today = new Date();
// Subtract 7 days (7 * 24 * 60 * 60 * 1000 milliseconds)
const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

const day = String(lastWeek.getDate()).padStart(2, '0');
const month = String(lastWeek.getMonth() + 1).padStart(2, '0');
const year = lastWeek.getFullYear();

const formattedLastWeekDate = `${month}-${day}-${year}`;

console.log(formattedLastWeekDate);


const branchname = "Unmerged scripts";
const executionName = "End to End - All / Regression";
const apiUrl  = `https://api.testim.io/runs/executions?fromDate=${formattedLastWeekDate}&branch=${branchname}&name=${executionName}`;
// const apiUrl  = "https://api.testim.io/runs/executions?fromDate=12-02-2023&name=End%20to%20End%20-%20All%20%2F%20Regression&branch=Unmerged%20scripts"
console.log(apiUrl);

getAllTestResponses(apiUrl, token);