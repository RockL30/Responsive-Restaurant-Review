import React, { useState } from 'react';
import { styled } from '@mui/system';
import { Card } from '@mui/material';
import RestaurantDetails from './RestaurantDetails/RestaurantDetails';

// Styled Card component for restaurant card container using MUI
const CardContainer = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2), // margin from theme
  padding: theme.spacing(2), // padding from theme
  cursor: 'pointer', // cursor to pointer to indicate clickable
}));

const RestaurantCard = ({ selectedRestaurant }) => {
  // State variable to track whether the card details should be shown
  const [showDetails, setShowDetails] = useState(false);

  const handleClick = () => {
    setShowDetails(!showDetails); // Toggle showDetails 
  };
  // Render restaurant card
  return (
    // Set the click handler on the card container
    <CardContainer onClick={handleClick}>
      <RestaurantDetails
        selectedRestaurant={selectedRestaurant} // Pass the selected restaurant to RestaurantDetails component
        showDetails={showDetails} // Pass showDetails state to the RestaurantDetails component
      />
    </CardContainer>
  );
};

export default RestaurantCard;