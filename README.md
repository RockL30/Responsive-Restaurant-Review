# p7-oc Responsive-Restaurant-Review

## Requirements

- Dependencies
- Objectives
  - Step 1 - Restaurants
  - Step 2 - Add restaurants and reviews
  - Step 3 - Integration with Google Places API

## Dependencies

### Right Place

- be sure that you are in the right place before running the terminal

### Get the node_modules

- npm install

### Start Project

- npm start

### Create Production Build

- npm run build.

### API Key

-(optional) if the dependency for .env is missing run: npm i --save-dev dotenv

- create a .env.local file
- add this to your .env.local file REACT_APP_GOOGLE_MAPS_API_KEY = 'APIKEY'
- replace 'APIKEY' with your api key

### Adjust Limitations

- go to MapComponent.js, located in src/components/GoogleMaps, and change the value for maxRequests on the line 32.

Ex: maxRequests = 40;

## Objectives

### Step 1

- [x] Initialize Google Maps:

  - [x] Implement Google Maps API to display a map.
  - [x] Center map on user's current location
  - [x] Differentiate user from restaurant marker

- [x] Load and Display Restaurant Data:
  - [x] Load JSON restaurants
  - [x] Add restaurant markers according to coordinates
- [x] Create a Restaurant List:

  - [x] Only show restaurants that are within map bounds on the list
  - [x] Calculate and display average restaurant rating
  - [x] Only show restaurants that are within map bounds on the list
  - [x] Calculate and display average restaurant rating

- [x] Interactivity with Restaurants:

  - [x] View details (ratings and reviews) of the restaurant upon clicking on marker or list item
  - [x] Integrate Google Street View for selected restaurants.

- [x] Implement a Rating Filter:

  - [x] Filter restaurant List by rating

- [x] Other Objectives:
  - [x] Responsive design for the map and restaurant list.
  - [x] Error handling for geolocation and data loading.

### Step 2

- [x] Adding Reviews to Existing Restaurants:

  - [x] Create an interface that allows users to submit reviews for existing restaurants.
  - [x] Update the restaurant's information on the map and list immediately after adding a review.

- [x] Adding New Restaurants:
  - [x] Add the possibility to create a new custom restaurant by clicking on the map.
  - [x] Display a form to enter details of the new restaurant and submit.
  - [x] Add a new marker for the newly added restaurant on the map.
- [x] Other Objectives
  - [x] Ensuring that the data is only visible during the current session.

### Step 3

- [x] Fetch Additional Restaurants and Reviews:

  - [x] Get real data with Google Places API with more restaurants and reviews.
  - [x] Display additional restaurants and reviews on the map and list.

- [x] Other Objectives
  - [x] Update markers and list in according to viewport bounds
  - [x] Integrate local data with Google API Data.
  - [x] Manage API rate limits and handle API errors.
