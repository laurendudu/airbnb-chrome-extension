# A Chrome Extension Implementing AirBnb Price Prediction

This repository contains the code for a chrome extension which scraps an AirbBnb room page, and calls an API which predicts the price for one night. 

## How To Use
To use this extension, you must use the Chrome web browser. 
1. Clone this repository or download the according zip file (then extract it)
2. Go to **Extensions** to the **top right** of your browser

<p align="center">
  <img  src="https://user-images.githubusercontent.com/60437222/144094476-1bf67ce5-ee7b-4f0b-b29f-b0e8693051fa.png">
</p>

3. Click on **Manage Extensions**

<p align="center">
  <img  src="https://user-images.githubusercontent.com/60437222/144094896-f87b27b1-7a07-44dc-a349-f5bc99bc2e7a.png">
</p>

4. If not already done, toggle the **Developper Mode** at the **top right** of the screen.

<p align="center">
  <img  src="https://user-images.githubusercontent.com/60437222/144077044-cff07051-284d-4d59-8bd7-eea073c4ba1d.png">
</p>

5. At the **top left** click **Load unpacked**

<p align="center">
  <img  src="https://user-images.githubusercontent.com/60437222/144077906-c48f1aee-3290-446f-8985-f9510b64d43d.png">
</p>


6. Select the directory where you cloned the project
7. The extension should be added!

**To estimate the price of an AirBnb room, you must be on the [airbnb.com](https://airbnb.com) website. The extension will not work if the extension is .fr or other.**

## The Prediction Model
### Overview

The idea we had was to predict the price of an Airbnb room based on a dataset. In order to do so, we searched for a complete dataset on Kaggle with the variables we wanted. We chose [this one](https://www.kaggle.com/airbnb/boston?select=listings.csv). The dataset matched all of the Airbnb room price in Boston, in the United States. 

The name of the dataset is “listings.csv”. We treated the data to select only the variables we were interested in. As features, we wanted the `number of guests`, `bathrooms`, `bedrooms`, `beds` and `reviews`. But also, what `type of room` it was (an entire home/apartment, a private room or a shared room) and if the host is a `superhost` or not. Of course, we had also the price variable, which is the variable we wanted to predict. Since the column associated to the price was in a string format, we had to treat it in order to have a column of integer without the dollar sign. 

We decided to create our prediction model in python through a Jupyter Notebook. The libraries we used are the following: 
  -	`Tensorflow`
  -	`Sklearn` 
  -	`Keras`

We have created a sequential neural network with a test size equal to 0.1. Indeed, our dataset was a very small dataset, with only 3557 lines. That is why the test size is very low. Our sequential neural network has 1 input layer, 4 hidden layers and 1 output layer. We entered the values of the features in the input layer, it is then treated through the hidden layers and then, we have the predicted price associated to those features. 


### Issues
The issue we encountered while training this model was the accuracy. Since our dataset is relatively small, we had to choose a small test size, so we could minimize the loss. This lead to a bad accuracy when predicting the prices, generally the prices are predicted higher than expected. To solve this porblem, we could gather data from other locations, not only boston to construct a bigger dataset, and also use more input variables. 

## The API


### Overview
The repository for this project can be found [here](https://github.com/laurendudu/airbnb-api-gcloud). The API imports the model mentioned previously. It is coded in Python, with the `Flask` library, and was deployed with [Google Cloud Platform](https://cloud.google.com/). It is callable by a `POST` method, by specifying the header `Content-Type: application/json`

The input should be specified in the body as a raw format. The parameters are:
```
[[
  number of guests, 
  number of bathrooms, 
  number of bedrooms, 
  number of beds, 
  number of reviews, 
  room type, 
  superhost boolean
]]
```

## Issues 
While deploying the API, there was some conflict between the keras and tensorflow versions. If the keras version was unspecified, the API had an internal server error. To solve this problem, we had to spcify a downgraded version of keras in `requirements.txt`.

The second issue which was the biggest, was dealing with the CORS policy. When calling the API from the extension, the ports are not the same, which causes a block from the CORS policy. 

```js
Access to fetch at 'xxx' from origin 'chrome-extension://xxx' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.
```

To solve this problem, we used [cors-anywhere](https://github.com/Rob--W/cors-anywhere). This repository allowed to easily deploy a proxy with `Heroku`, which added the correct headers to the request. 

```bash
git clone https://github.com/Rob--W/cors-anywhere.git
cd cors-anywhere/
npm install
heroku create
git push heroku master
```

This:
1. Forwards the request to the API.
2. Receives the response from the API.
3. Adds the Access-Control-Allow-Origin header to the response.
4. Passes that response, with that added header, back to the requesting frontend code.

### Costs
- Continer Registry

The container is situated in the US (multi-region) is about $0.026 per GB per month. 

- Cloud Run

The cloud run is deploye in `europe-north` which is subject to Tier 1 pricing. 

The cost for the CPU which is allocated only during request processing is $0.00002400 / vCPU-second beyond free tier. 

The cost for the memory is $0.00000250 / GiB-second beyond free tier. 

The cost for requests is $0.40 / million requests beyond free tier. 

The cost is estimated [here](https://cloud.google.com/products/calculator/#id=ac02c40b-a2bf-4240-8a64-7bcbd5409b57)


## The Extension
The extension calls the API and displayes the estimated price for the specific room. 

### How Does it work?
The extension makes multiple API calls. To scrape the data of the AirBnb page, we used this [actor](https://apify.com/dtrungtin/airbnb-scraper) from [Apify](https://apify.com/).

1. Call the Apify API to run a scraping task 

This is is a `POST` call. It takes as an input the url form the active tab and returns data concerning the call, such as the ID of the run and the ID of the dataset. 

2. Call the Apify API to retrieve the logs of the run

This is a `GET` call. Thanks to the IDof the run we got earlier, we can access the logs of the task and determine if the scraping has finished, and stored the values to the according dataset provided by Apify. 

3. Call the Apify API to retrieve the Dataset Items

Once the logs confirm that the scraping has finished, we call a last Apify API with a `GET` method and the dataset ID to get the items of the scraping. These are presented in a JSON file and are very convenient for extraction.

4. Call the price estimation API to estimate the price


### Issues
The biggest issue was dealing with asynchronous functions. We had to implement them to deal with the multiple API calls, one after the other. 

Another issue was caused by the scraping. As the scraping can take some time, we needed to wait for the dataset to be filled, to be able to retrieve it. We tried to delay the task with a fixed amount of time, such as 20 senconds, but sometimes it was not enough. Instead, we used a `setInterval()` method to check the logs of the scraper run every second. 

Originally, we wanted to use the [Official AirBnb API](https://www.airbnb.fr/partner), but it is not available for use anymore. This is why we had to resolve to [Apify](apify.com) which is costly. 


### Costs
Apify is pretty costly, scraping around 10,000 pages a month is aproximately $42. The free tier contains $5 credits and 4GB of actor RAM. This could be reduced by scraping the active tab in the action of the extension popup, but this was too complicated to implement with the time given. 
