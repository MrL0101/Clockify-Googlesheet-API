function onOpen() {
  let ui = SpreadsheetApp.getUi();
  ui.createMenu('Clockify')
      .addItem('Sync Month','syncMonth')
      //.addItem('Sync Daily','syncDaily')
      .addItem('Clear Sheet', 'clearSheet')
      .addToUi();
}

// ===============================

function apiCall(dateStart, dateEnd) {

  const URL = 'https://reports.api.clockify.me/v1/workspaces/{Workspace_ID}/reports/detailed';
  //"dateRangeStart": "2022-03-01T00:00:00.000Z",
  //"dateRangeEnd": "2022-03-31T23:59:59.000Z",
  let data = {
    "dateRangeStart": dateStart,
    "dateRangeEnd": dateEnd,
    "detailedFilter": {
        "page": 1,
        "pageSize": 1000
    },
    "sortOrder": "DESCENDING",
    "userGroups": {
        "ids": ["{UserGroup_ID}"],
        "contains": "CONTAINS",
        "status": "ALL"
    }
  };
  
  let options = {
    method:"POST",
    headers: { 
      "X-Api-Key": "{Clockify API}",
      "Content-type": "application/json"},
    payload: JSON.stringify(data)
    
  }

  let response = UrlFetchApp.fetch(URL, options);
  let obj = JSON.parse(response);

  const taskEntries = obj.totals[0].entriesCount;

  let roundoff = parseInt((taskEntries/1000).toFixed(0));

  if(taskEntries % 1000 != 0) roundoff += 1;

  let counter = 1;
  let arrayData = [];

  errorAlert(roundoff);

  while(counter <= roundoff) {
    Utilities.sleep(1100);
    //data.detailedFilter.page = counter;

    let data1 = {
      "dateRangeStart": dateStart,
      "dateRangeEnd": dateEnd,
      "detailedFilter": {
          "page": counter,
          "pageSize": 1000
      },
      "sortOrder": "DESCENDING",
      "userGroups": {
          "ids": ["UserGroup_ID"],
          "contains": "CONTAINS",
          "status": "ALL"
      }
    }

    let options1 = {
      method:"POST",
      headers: { 
        "X-Api-Key": "{Clockify API}",
        "Content-type": "application/json"},
      payload: JSON.stringify(data1)
      
    }
    response = UrlFetchApp.fetch(URL, options1);
    obj = JSON.parse(response);
    arrayData.push(obj.timeentries);  
    counter++;

  }


  return arrayData;
  
}