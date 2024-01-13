import React from "react";
import { loadGoogleMapsScript } from "./loadGoogleMapsScript";
import restaurants from "../../data/restaurants.json";
import {
  Box, Button, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle,
  Rating, TextField,
} from "@mui/material";
import _ from 'lodash';
import personPng from './personPng.png';
import restaurantPng from './restaurantPng.png';
import restaurantPngGreen from './restaurantPngGreen.png';
// Markers personPng and restaurantPng were obtained from https://mapicons.mapsmarker.com/, free for non-commercial and commercial use with attribution

// Default coordinates for the map (Lodz, Poland)
const defaultLocationCoordinates = { lat: 38.724473, lng: -9.131707 };

class MapComponent extends React.Component {
  mapContainerRef = React.createRef(); // Ref -> Reference to the div element to render the map
  markers = [];
  state = {
    userCoords: null,
    isDragging: false,
    showModal: false,
    newRestaurantName: "",
    newRestaurantReview: "",
    newRestaurantRating: 0,
  };

  // safe-guard against exceeding the maximum number of requests
  requestCounter = 0;
  maxRequests = 50; // IMPORTANT, 5 the limit that I have set, for furhter testing change it to a higher value 
  requestTimeout = 24 * 60 * 60 * 1000; // 24 hours

  // reset request counter every 24 hours
  resetRequestCounter = () => {
    console.log('Resetting request counter.');
    this.requestCounter = 0;
    setTimeout(this.resetRequestCounter, this.requestTimeout);
  }

  // Load Google Maps API script, after the DOM is loaded
  componentDidMount() {
    loadGoogleMapsScript(this.initializeMap);
    this.resetRequestCounter();
  }

  // Triggered when the user location is updated or the map is dragged
  // remove prevProps and replace it with _?
  componentDidUpdate(prevProps, prevState) {
    if (this.state.userCoords !== prevState.userCoords && !this.state.isDragging) {
      this.addRestaurantMarkers();
      this.fetchNearbyRestaurants();
    }
  }

  fetchNearbyRestaurants = _.debounce(() => {
    // No more Requests stop fetching
    if (this.requestCounter >= this.maxRequests) {
      console.log('Maximum number of requests reached.');
      return;
    }

    // API call to Google Places API
    // Paramaters: location, radius, type
    const service = new window.google.maps.places.PlacesService(this.map);
    const request = {
      location: this.state.userCoords,
      radius: "200",
      type: ["restaurant"],
    };

    // Callbacl to handle results
    service.nearbySearch(request, (results, status) => {
      this.handleNearbySearchResults(results, status, service);
    });
  }, 1000);

  // Process the results from the nearbySearch request
  handleNearbySearchResults = (results, status, service) => {
    // Was the request successful?
    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
      // Iterate through the results and process each place
      results.forEach((place, index) => {
        // Delay each request by 2 seconds
        setTimeout(() => {
          if (this.requestCounter >= this.maxRequests) {
            console.log('Maximum number of requests reached.');
            return;
          }
          // Check if the component is still mounted - Bug Fixed
          if (this.map) {
            this.processPlace(place, service);
            // api request is made in processPlace
          }
        }, index * 2000); // 2 seconds delay
      });
    } else {
      console.error(`nearbySearch request failed with status: ${status}`); // Error handling
    }
  };

  // Function called from handleNearbySearchResults
  processPlace = (place, service) => {
    // No more Requests stop fetching
    if (this.requestCounter >= this.maxRequests) {
      console.log('Maximum number of requests reached.');
      return;
    }

    // Get the image URL for the place
    let imageUrl = "";
    if (place.photos && place.photos.length > 0) {
      imageUrl = place.photos[0].getUrl({ maxWidth: 400 });
    }
    // Get the details for the place
    const detailsRequest = {
      placeId: place.place_id,
      fields: ["review"],
    };

    // API call to Google Places API
    service.getDetails(detailsRequest, (placeDetails, detailsStatus) => {
      // Was the request successful?
      if (detailsStatus === window.google.maps.places.PlacesServiceStatus.OK) {
        this.addPlaceToRestaurants(place, placeDetails, imageUrl); // Add the place to the restaurants array
      } else {
        console.error(`getDetails request failed with status: ${detailsStatus}`);
      }
      this.requestCounter++; //Safeguard
      console.log(`Request counter: ${this.requestCounter}`);
    });
  };

  // Function called from processPlace
  // Add the place to the restaurants array
  // Add a marker for the place
  addPlaceToRestaurants(place, placeDetails, imageUrl) {
    let userReviews = [];
    if (placeDetails && placeDetails.reviews) {
      userReviews = placeDetails.reviews.map(
        (review) => ({
          stars: review.rating, // Google stores the stars in the review.rating property
          comment: review.text, // Google stores the comment in the review.text property
        }));
    }
    // Create a new restaurant object
    const newRestaurant = {
      restaurantName: place.name,
      address: place.vicinity, // Google stores the address in the vicinity property
      lat: place.geometry.location.lat(),
      long: place.geometry.location.lng(),
      imageUrl: imageUrl,
      // If the place has a rating, add it to the reviews array
      ratings: place.rating
        ? [...userReviews, { stars: place.rating, comment: "Review without comment" }]
        : [],
    };
    // Add the new restaurant to restaurants array
    restaurants.push(newRestaurant);
    // Add marker 
    new window.google.maps.Marker({
      position: place.geometry.location,
      map: this.map,
      title: place.name,
      icon: {
        url: restaurantPng, // Replace icon
      },
    });
  }
  // Called from componentDidMount
  initializeMap = () => {
    // Create map
    const map = new window.google.maps.Map(this.mapContainerRef.current, {
      center: defaultLocationCoordinates,
      zoom: 13,
    });
    this.map = map; // Save map to component state
    this.setUserLocationMarker(); // Add user location marker
    this.addRestaurantMarkers(); // Add restaurant markers
    this.setupEventListeners();
  };

  setupEventListeners = () => {
    this.map.addListener("bounds_changed", this.addRestaurantMarkers); // Re-render markers 
    // Track whether the map is being dragged
    this.map.addListener("dragstart", () =>
      this.setState({ isDragging: true })
    );
    // Reset isDragging when the map is stops being dragged
    this.map.addListener("dragend", () => this.setState({ isDragging: false }));
    this.map.addListener("click", this.handleMapClick); // Add restaurant on click
  };

  // Called from setupEventListeners
  // Add restaurant on click
  handleMapClick = (event) => {
    // Safeguard so a restaurant only added when the map is not being dragged
    if (!this.state.isDragging) {
      this.setState({
        showModal: true,
        userCoords: { lat: event.latLng.lat(), lng: event.latLng.lng() },
      });
    }
  };

  // Called from handleMapClick
  handleClose = () => {
    this.setState({ showModal: false });
  };

  // Called from initializeMap
  // Add user location marker
  // Add restaurant markers
  setUserLocationMarker = () => {
    // Check if the browser supports geolocation
    if (navigator.geolocation) {
      // Get the current user position
      navigator.geolocation.getCurrentPosition(
        // Success callback
        // Get the lat and lng from the user position
        (position) => {
          const userCoords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          this.setState({ userCoords }); // Save userCoords to component state
          this.map.setCenter(userCoords); // Center the map on the user loc
          // Add a marker for the user location
          new window.google.maps.Marker({
            position: userCoords,
            map: this.map,
            title: "Your Location",
            icon: {
              url: personPng, // Replace icon
            },
          });
          this.addRestaurantMarkers(); // Because of bounds visibility - Bug Fixed
        },
        () => {
          console.error("Unable to retrieve user location.");
        }
      );
    }
  };

  // Called from componentDidUpdate
  addRestaurantMarkers = () => {
    this.markers.forEach((marker) => marker.setMap(null)); // Remove all markers
    this.markers = []; // Reset markers array
    // Get the bounds of the map 
    // contains the geographical coordinates of the south-west and north-east corners of the viewport.
    const bounds = this.map.getBounds();
    const visibleRestaurants = []; // Store Visible Restaurants
    if (bounds && this.state.userCoords) {
      restaurants.forEach((restaurant) => {
        // Create a Object for the lat and long of each restaurant
        const restaurantLocation = new window.google.maps.LatLng(
          restaurant.lat,
          restaurant.long // Bug Fixed
        );
        // Check if the restaurant is within the bounds of the map
        if (bounds.contains(restaurantLocation)) {
          const marker = new window.google.maps.Marker({
            position: restaurantLocation,
            map: this.map,
            title: restaurant.restaurantName,
            // Keep icons consistent when re-rendering markers
            icon: {
              url: this.props.selectedRestaurantName === restaurant.restaurantName
                ? restaurantPngGreen
                : restaurantPng,
            },
          });
          const userLocation = new window.google.maps.LatLng(
            this.state.userCoords.lat,
            this.state.userCoords.lng
          );
          const distance =
            window.google.maps.geometry.spherical.computeDistanceBetween(
              userLocation,
              restaurantLocation
            );
          restaurant.distance = distance;
          marker.addListener("click", () => {
            // Change the icon of all markers back to restaurantPng
            // Ensure that only one marker is green at a time
            if (this.selectedMarker === marker) {
              marker.setIcon(marker.getIcon() === restaurantPngGreen ? restaurantPng : restaurantPngGreen);
            } else {
              // If there's a previously selected marker, reset its icon
              if (this.selectedMarker) {
                this.selectedMarker.setIcon(restaurantPng);
              }

              // Update the selected marker
              this.selectedMarker = marker;

              // Set the icon of the newly clicked marker to the highlighted version
              marker.setIcon(restaurantPngGreen);
            }
            console.log("Marker clicked");
            this.props.onRestaurantSelect(restaurant);
          });
          this.markers.push(marker); // Add to the markers array
          visibleRestaurants.push(restaurant); // Add to the visibleRestaurants array
        }
      });
      this.props.onRestaurantsChange(visibleRestaurants); // Pass visibleRestaurants to parent component
    }
  };

  addRestaurant = () => {
    const {
      newRestaurantName,
      newRestaurantReview,
      newRestaurantRating,
      userCoords,
    } = this.state; // Destructure state variables

    // No more Requests stop fetching
    if (this.requestCounter >= this.maxRequests) {
      console.log('Maximum number of requests reached.');
      return;
    }

    // Bug Fixed - we need to geocode the userCoords to get the address for the custom restaurant
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: userCoords }, (results, status) => {
      if (status === "OK") {
        if (results[0]) {
          const newRestaurant = {
            restaurantName: newRestaurantName,
            address: results[0].formatted_address,
            lat: userCoords.lat,
            long: userCoords.lng,
            image: "Image URL not available",
            ratings: [
              {
                stars: newRestaurantRating,
                comment: newRestaurantReview,
              },
            ],
          };
          restaurants.push(newRestaurant); // Add to restaurants array
          const marker = new window.google.maps.Marker({
            position: userCoords,
            map: this.map,
            title: newRestaurantName,
            icon: {
              url: restaurantPng, // Replace icon
            },
          });
          this.markers.push(marker); // Add to markers array
          // Close modal and reset variables
          this.setState({
            showModal: false,
            newRestaurantName: "",
            newRestaurantReview: "",
            newRestaurantRating: 0,
          });
          this.addRestaurantMarkers(); // Re-render markers
        } else {
          window.alert("No results found"); // Error handling
        }
      } else {
        window.alert("Geocoder failed due to: " + status); // Error handling
      }
      this.requestCounter++; //Safeguard
      console.log(`Request counter: ${this.requestCounter}`);
    });
  };

  render() {
    return (
      <Box
        ref={this.mapContainerRef}
        sx={{
          height: "400px",
          width: "100%",
        }}
      >
        Loading map...
        <Dialog open={this.state.showModal} onClose={this.handleClose}>
          <DialogTitle>Add Restaurant</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter the details of the new restaurant:
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Restaurant Name"
              type="text"
              fullWidth
              variant="standard"
              value={this.state.newRestaurantName}
              onChange={(event) =>
                this.setState({ newRestaurantName: event.target.value })
              }
            />
            <TextField
              margin="dense"
              id="review"
              label="Initial Review"
              type="text"
              fullWidth
              variant="standard"
              value={this.state.newRestaurantReview}
              onChange={(event) =>
                this.setState({ newRestaurantReview: event.target.value })
              }
            />
            <Rating
              name="rating"
              defaultValue={2}
              precision={0.5}
              value={this.state.newRestaurantRating}
              onChange={(event, newValue) =>
                this.setState({ newRestaurantRating: newValue })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose}>Cancel</Button>
            <Button onClick={this.addRestaurant}>Submit</Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }
}

export default MapComponent;