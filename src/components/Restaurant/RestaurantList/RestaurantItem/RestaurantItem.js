import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/system';
import {
  Card,
  CardContent,
  Typography,
  Rating,
  Grid
} from '@mui/material';

// Styling 
const ItemContainer = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  cursor: 'pointer',
}));

const RestaurantItem = ({ restaurant, onRestaurantSelect }) => {
  // Store the calculated average rating
  const [
    averageRating,
    setAverageRating
  ] = useState(0);

  // Calculate the average rating whenever the restaurant data changes, same as componentDidUpdate
  useEffect(() => {
    if (restaurant && restaurant.ratings.length) {
      // Calculate the total rating by summing up the stars of each review with reduce
      const total = restaurant.ratings.reduce((acc, review) => acc + review.stars, 0);
      const rawAverage = total / restaurant.ratings.length;
      const roundedAverage = Math.round(rawAverage * 2) / 2;
      // Calculate the average rating and set it in the state
      setAverageRating(roundedAverage);
      // setAverageRating(parseFloat((total / restaurant.ratings.length).toFixed(1))); bug with half stars
    }
  }, [restaurant]); // runs whenever the restaurant data changes

  // Handle the click event
  const handleClick = () => {
    onRestaurantSelect(restaurant);
  };

  // calculate the distance
  const distance = Math.round(restaurant.distance);

  return (
    <ItemContainer onClick={handleClick}>
      <Grid container alignItems="center" spacing={2}>
        <Grid item xs={12}>
          <CardContent>
            <Grid container direction="column" alignItems="center">
              <Typography variant="subtitle1" sx={{ margin: 1 }}>
                {restaurant.restaurantName}
              </Typography>
              <Rating
                name="read-only"
                value={averageRating}
                precision={0.5} // More accuracy for stars
                readOnly
                size="small"
                sx={{ justifyContent: 'center', margin: 1 }}
              />
              <Typography variant="body2" sx={{ margin: 1 }}>
                Distance: {distance} meters
              </Typography>
            </Grid>
          </CardContent>
        </Grid>
      </Grid>
    </ItemContainer>
  );
};

// PropTypes to validate the props being passed to the component
RestaurantItem.propTypes = {
  restaurant: PropTypes.shape({
    restaurantName: PropTypes.string.isRequired,
    ratings: PropTypes.arrayOf(
      PropTypes.shape({
        stars: PropTypes.number.isRequired,
        comment: PropTypes.string,
      })
    ).isRequired,
    distance: PropTypes.number.isRequired,
  }).isRequired,
  onRestaurantSelect: PropTypes.func.isRequired,
};

export default RestaurantItem;
