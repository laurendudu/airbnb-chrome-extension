# A Chrome Extension Implementing AirBnb Price Prediction

## How To Use
To use this extension, you must use the Chrome web browser. 
- Clone this repository or download the according zip file (then extract it)
- Go to **Extensions** to the **top right** of your browser

![image](https://user-images.githubusercontent.com/60437222/144094476-1bf67ce5-ee7b-4f0b-b29f-b0e8693051fa.png)

- Click on **Manage Extensions**

![image](https://user-images.githubusercontent.com/60437222/144094896-f87b27b1-7a07-44dc-a349-f5bc99bc2e7a.png)

- If not already done, toggle the **Developper Mode** at the **top right** of the screen.

![image](https://user-images.githubusercontent.com/60437222/144077044-cff07051-284d-4d59-8bd7-eea073c4ba1d.png)

- At the **top left** click **Load unpacked**

![image](https://user-images.githubusercontent.com/60437222/144077906-c48f1aee-3290-446f-8985-f9510b64d43d.png)

- Select the directory where you cloned the project
- The extension should be added!

**To estimate the price of an AirBnb room, you must be on the [airbnb.com](https://airbnb.com) website. The extension will not work if the extension is .fr or other**

## The Prediction Model
### How Does it Work?

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
The repository for this project can be found [here](https://github.com/laurendudu/airbnb-api-gcloud).

### How Does it Work?

### Issues

## The Extension
### How Does it work?
### Issues

## Costs
### The API
### The Scraping
### The Extension
