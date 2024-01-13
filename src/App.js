import React, { useState, useCallback } from "react";
// Importing required components and styles
import MapComponent from "./components/GoogleMaps/MapComponent";
import RestaurantList from "./components/Restaurant/RestaurantList/RestaurantList";
import RestaurantFilter from "./components/Restaurant/RestaurantFilter/RestaurantFilter";
import RestaurantCard from "./components/Restaurant/RestaurantCard/RestaurantCard";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

// Define the dark theme for Material UI
const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

// Main App component
const App = () => {
  // State for tracking selected restaurant
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  // State for tracking the filter rating
  const [filterRating, setFilterRating] = useState(-1);
  // State for tracking visible restaurants on the map
  const [visibleRestaurants, setVisibleRestaurants] = useState([]);

  // Callback for handling restaurant selection
  const handleRestaurantSelect = useCallback((restaurant) => {
    setSelectedRestaurant((prevRestaurant) =>
      prevRestaurant && prevRestaurant.restaurantName === restaurant.restaurantName ? null : restaurant
    );
  }, []);

  // Callback for handling rating filter change
  const handleFilterRating = useCallback((rating) => {
    setFilterRating(rating);
  }, []);

  // Callback for handling change in visible restaurants
  const handleRestaurantsChange = useCallback((restaurants) => {
    setVisibleRestaurants(restaurants);
  }, []);


  // Rendering the app components within a theme provider
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Header />
      <Container>
        <Grid container spacing={2} sx={{ paddingBottom: "80px" }}>
          <Grid item xs={7} sm={8} md={10}>
            {/* Map component showing the restaurants */}
            <MapComponent
              selectedRestaurantName={selectedRestaurant ? selectedRestaurant.restaurantName : null}
              onRestaurantSelect={handleRestaurantSelect}
              onRestaurantsChange={handleRestaurantsChange}
            />
            {/* Box component for the RestaurantCard */}
            <Box sx={{ filter: "none", marginTop: 2 }}>
              <RestaurantCard
                selectedRestaurant={selectedRestaurant}
              />
            </Box>
          </Grid>
          <Grid item xs={5} sm={4} md={2}>
            <Box sx={{ filter: "none" }}>
              {/* Restaurant filter component */}
              <RestaurantFilter onFilterRating={handleFilterRating} />
              {/* Restaurant list component */}
              <RestaurantList
                restaurants={visibleRestaurants}
                selectedRestaurant={selectedRestaurant}
                onRestaurantSelect={handleRestaurantSelect}
                filterRating={filterRating}
              />
            </Box>
          </Grid>
        </Grid>
        <Footer />
      </Container>
    </ThemeProvider>
  );
};

export default App;
