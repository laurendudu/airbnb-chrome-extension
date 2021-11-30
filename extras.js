let loader = document.getElementById("loader")
let price = document.getElementById("div-price")
let price_txt = document.getElementById("price")
let estimateBtn = document.getElementById("estimate-btn")
let toAirbnb = document.getElementById("to-airbnb")
let toRoom = document.getElementById("to-room")
let timeout = document.getElementById("timeout")
let estimated = false


async function setPopup() {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    
    console.log(tab.url);

    if (tab.url.startsWith("https://www.airbnb.com/rooms/")) {
        estimateBtn.hidden = false;
    } else if (tab.url.startsWith("https://www.airbnb.com/")) {
        toRoom.hidden = false;
    } else {
        toAirbnb.hidden = false;
    }
  }


setPopup();

function showAirbnb() {
    var index_url = "https://www.airbnb.com";
    chrome.tabs.create({
        url: index_url
    });
}

document.getElementById('changeUrl').addEventListener("click", showAirbnb);

estimateBtn.addEventListener("click", function() {
    if (estimated == false) {
        estimateBtn.hidden = true;
        loader.hidden = false;
    } else {
        estimateBtn.hidden = true;
        price.hidden = false;
    }

})

function format_price(price) {
    var price_float = parseFloat(price)
    price_float_rounded = price_float.toFixed(2)

    price_string = "$" + price_float_rounded + " per night"

    return price_string
}

console.log(format_price(122.333))