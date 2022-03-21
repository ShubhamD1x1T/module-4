const puppeteer = require('puppeteer');
const fs = require('fs');
let pin = "110053";

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://www.cowin.gov.in/');
  await page.waitForSelector(".mat-ripple.mat-tab-label.mat-focus-indicator.ng-star-inserted");
  //await page.click(".mat-ripple.mat-tab-label.mat-focus-indicator.ng-star-inserted");
  await page.evaluate(function(){
      let selall = document.querySelectorAll(".mat-ripple.mat-tab-label.mat-focus-indicator.ng-star-inserted");
      selall[1].click();
      return;
  })
  await page.waitForSelector(".pin-search input");
  //await page.waitForTimeout(3000);
  await page.type(".pin-search input",pin);
  await page.waitForSelector(".searchBtn.pin-search-btn.accessibility-plugin-ac");
  await page.evaluate(function(){
      let serbutton = document.querySelector(".searchBtn.pin-search-btn.accessibility-plugin-ac");
      serbutton.click();
      return;

  })
  await page.waitForSelector(".item.active li");
   await page.waitForSelector(".col-sm-12.col-md-12.col-lg-12.cvc-list-item.ng-star-inserted");

 let arr =  await page.evaluate(function(){
    let a = [];  
    let allday = document.querySelectorAll(".item.active li");
      let allrow = document.querySelectorAll(".col-sm-12.col-md-12.col-lg-12.cvc-list-item.ng-star-inserted");
      for(let i=0;i<allday.length;i++){
          let date = allday[i].textContent;
          for(let j=0;j<allrow.length;j++){
              let name = allrow[j].querySelector(".row-disp>h5").textContent.trim();
              let address =allrow[j].querySelector(".row-disp>p").textContent.trim();
              let vaccine = allrow[j].querySelector(".row-disp div .vaccine-details").textContent.trim();

              let age = allrow[j].querySelector(".row-disp div .session-details>span").textContent.split(":")[1].trim();
              let dose= allrow[j].querySelectorAll(".row-disp div .session-details span")[1].textContent.split(":")[1].trim();
              let slot = allrow[j].querySelectorAll(".slots-box.ng-star-inserted")[i].textContent; 
                slot = slot.trim();
                if(slot !="N/A" && slot !="Booked"){
              let obj = {
                  Name:name,
                  Add:address,
                  Vaccine:vaccine,
                  AgeGroup:age,
                  Slot:slot,
                  Dose:dose,
                  Date:date

              }
              a.push(obj);}
            
          }
      }
      return a;
  })
  let vaccinesch = JSON.stringify(arr);
 fs.writeFileSync("ScheduleofVaccination.json",vaccinesch);
  browser.close();
})();