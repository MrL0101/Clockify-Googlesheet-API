function syncMonth() {
    let ss = SpreadsheetApp.getActiveSpreadsheet();
  
    let sheet_name = ss.getActiveSheet().getName(); //get sheet tab name
    let substring_2023 = "2023"; // substring to check if sheet tab name has 2023 on name
  
    let monthSheet = ss.getActiveSheet();
  
    let clockifyData = [];
  
    //let checkedMonth = checkMonth(monthSheet.getSheetName());
    
    //let y = 2022, m = checkedMonth[1];
  
    if(sheet_name.includes(substring_2023)) { //if it contains 2023 then let year be 2023
      var y = 2023;
  
      var checkedMonth = checkMonth(monthSheet.getSheetName().replace(' - 2023','')); //remove the text " - 2023" to get the 3 letter month name
      
      m = checkedMonth[1];
    } else {
      var y = 2022;
  
      var checkedMonth = checkMonth(monthSheet.getSheetName());
  
      m = checkedMonth[1];
    }//end if it contains 2023
  
    if (checkedMonth[0]) {
      clearSheet();
  
      let firstDay = new Date(y, m, 1);
      let lastDay = new Date(y, m + 1, 0);
      //let lastDay = new Date(y, m, 2);//For Testing, output only 2 days
      lastDay.setHours(23,59,59,999);
  
      errorAlert("S" + firstDay);
      errorAlert("E" + lastDay );
  
      let apiData = apiCall(firstDay, lastDay);
  
      for (let a in apiData) {
        let arr = apiData[a]
  
        for (let b in arr) {
          let data = arr[b];
  
          const project = data.projectName;
          const client = data.clientName;
          const desc = data.description;
          const task = data.taskName;
          const user = data.userName;
          const email = data.userEmail;
  
          const tagsRaw = data.tags;
          if (tagsRaw == null) { //Check if tags is empty, because flatMap will not work if empty
            var tags = '';
          } else {
            var tags = tagsRaw.flatMap(f=>f.name);//Get the Name from Array
          }
  
          const billable = data.billable;
  
          const timeStartLog = timeSplit(data.timeInterval.start)
          const startDate = timeStartLog[0];
          const startTime = timeStartLog[1];
  
          const timeEndLog = timeSplit(data.timeInterval.end)
          const endDate = timeEndLog[0];
          const endTime = timeEndLog[1];
  
          const durationDec = data.timeInterval.duration;
          const durationH = durationDec / 3600;
  
          clockifyData.push([
            project, client, desc, task, user, email, tags, billable, startDate, endDate, startTime, endTime, durationH, durationDec
          ]);
  
        }//arrayData
      }//apiData
  
      let lastRow = monthSheet.getLastRow();
      monthSheet.getRange("A" + (lastRow + 1) + ":N" + (lastRow + clockifyData.length)).setValues(clockifyData);
    }//Correct Sheet
    else {
      errorAlert("Please select the a Month Sheet ")
    }
  }//END
  