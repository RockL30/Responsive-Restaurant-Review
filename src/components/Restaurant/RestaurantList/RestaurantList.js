import React from 'react';
import PropTypes from 'prop-types';
import RestaurantItem from './RestaurantItem/RestaurantItem';

// Return all restaurants if no rating is selected
// Otherwise, returns only those restaurants that have at least one rating equal to selected rating
const filterRestaurants = (restaurants, filterRating) =>
  restaurants.filter((restaurant) =>
    filterRating === -1 || restaurant.ratings.some((rating) => rating.stars === filterRating)
  );

// Three props: 
//    array of restaurants, 
//    selected rating for filtering, 
//    callback function that handles restaurant selection
const RestaurantList = ({ restaurants, filterRating, onRestaurantSelect }) => {
  // It uses the filterRestaurants function to get a list of restaurants that match the selected rating.
  const filteredRestaurants = filterRestaurants(restaurants, filterRating);

  // Show message if no restaurants match the criteria
  if (filteredRestaurants.length === 0) {
    return <p>No restaurants match the criteria.</p>;
  }

  // use map to render each restaurant
  return (
    <div>
      {filteredRestaurants.map((restaurant, index) => (
        <RestaurantItem
          key={restaurant.id || index} // index as fallback key
          restaurant={restaurant}
          onRestaurantSelect={onRestaurantSelect}
        />
      ))}
    </div>
  );
};

// PropTypes to avoid bugs
RestaurantList.propTypes = {
  restaurants: PropTypes.arrayOf(PropTypes.object).isRequired,
  filterRating: PropTypes.number.isRequired,
  onRestaurantSelect: PropTypes.func.isRequired,
};

// Pprevent unnecessary re-renders if the props don't change
export default React.memo(RestaurantList);