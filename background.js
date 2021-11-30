// background.js

// Call the API
async function callAPI() {

    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
  
    url_room = tab.url
  
    // OPTIONS FOR FIRST API CALL
    var myHeaders_ID = new Headers();
    myHeaders_ID.append("Content-Type", "application/json");
  
    var raw_ID = JSON.stringify({
      "simple": false,
      "includeReviews": false,
      "includeCalendar": false,
      "addMoreHostInfo": false,
      "currency": "USD",
      "proxyConfiguration": {
        "useApifyProxy": true
      },
      "maxListings": 10,
      "maxConcurrency": 50,
      "limitPoints": 100,
      "timeoutMs": 60000,
      "debugLog": false,
      "startUrls": [
        {
          "url": url_room
        }
      ],
      "maxReviews": 10,
      "minPrice": 0,
      "maxPrice": 100000
    });
  
    var requestOptions_ID = {
      method: 'POST',
      headers: myHeaders_ID,
      body: raw_ID,
      redirect: 'follow'
    };
  
    // OPTIONS FOR SECOND API CALL 
    var requestOptions_data = {
    method: 'GET',
    redirect: 'follow'
    };
  
    fetch("https://api.apify.com/v2/acts/dtrungtin~airbnb-scraper/runs?token=apify_api_AW7LxUxcA98eMif2BsweJdVbFScRJv4rQ3o4", requestOptions_ID).
    then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject(response);
      }
    })
    .then(async function (data) {
  
      // Store the post data to a variable
      datasetID = data.data.defaultDatasetId
      // Wait 9 seconds so the scraping can finish
      await delay(20000);
      
  
      fetch("https://api.apify.com/v2/datasets/" + datasetID + "/items", requestOptions_data)
      .then(function (response) {
        if (response.ok) {
          return response.json();
        } else {
          return Promise.reject(response);
        }
      }).then(function (userData) {
        var guests;
        var bathroom;
        var bedroom;
        var beds;
        var reviews;
        var roomtype;
        var roomtype_n;
        var superhost;
        var superhost_n;
  
  
        guests = userData[0].numberOfGuests
        bathroom = parseInt(userData[0].bathroomLabel.charAt(0))
  
        if (isNaN(parseInt("S"))) {
          bedroom = 0
        } else {
          bedroom = parseInt(userData[0].bedroomLabel.charAt(0))
        }
  
        beds = parseInt(userData[0].bedLabel.charAt(0))
        reviews = userData[0].reviewDetailsInterface.reviewCount
        roomtype = userData[0].roomTypeCategory
  
  
        if (roomtype == "entire_home") {
          roomtype_n = 0
        } else if (roomtype == "private_room") {
          roomtype_n = 1
        } else if (roomtype == "shared_room") {
          roomtype_n = 2
        } else {
          roomtype_n = 3
        }
        
        superhost = userData[0].isHostedBySuperhost
        if (superhost == true) {
          superhost_n = 1
        } else {
          superhost_n = 0
        }
  
  
        var myHeaders_price = new Headers();
        myHeaders_price.append("Content-Type", "application/json");
  
        var raw_price = JSON.stringify([
          [
            guests,
            bathroom,
            bedroom,
            beds,
            reviews,
            roomtype_n,
            superhost_n
          ]
        ]);
  
        console.log(raw_price)
        var requestOptions_price = {
          method: 'POST',
          headers: myHeaders_price,
          body: raw_price,
          redirect: 'follow'
        };
  
        fetch("https://evening-sands-92844.herokuapp.com/https://boston-airbnb-api-gcloud-x2kpqos4ma-lz.a.run.app/api/", requestOptions_price)
        .then(function (response) {
          if (response.ok) {
            return response.json();
          } else {
            return Promise.reject(response);
          }
        }).then(function (data) {
          console.log(data)
          price.innerHTML = data.replace(/[\[\]']+/g,'')
          estimated = true;
          if (estimateBtn.hidden == true) {
            loader.hidden = true;
            price.hidden = false;
          }
  
        })
      }).catch(function (error) {
        console.warn(error);
      });
      
  })}