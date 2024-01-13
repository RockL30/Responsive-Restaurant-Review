import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { styled } from '@mui/system';

// Styled div for the filter container with MUI
const FilterContainer = styled('div')(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`, // border color from theme
  borderRadius: theme.shape.borderRadius, // border radius from theme
  padding: theme.spacing(2), // padding from theme
  marginBottom: theme.spacing(2), //margin from theme
}));

// Possible ratings
const ratings = [-1, 1, 2, 3, 4, 5];

// Render ratings
const renderMenuItem = (rating) => (
  // -1 displays all restaurants
  <MenuItem key={rating} value={rating}>
    {
      rating === -1
        ? 'All'
        : `${rating} star${rating > 1
          ? 's' // Plural if rating is greater than 1
          : ''}`
    }
  </MenuItem>
);

// Define the RestaurantFilter component
// Render a MenuItem for each rating
const RestaurantFilter = ({ onFilterRating }) => (
  <FilterContainer>
    <FormControl fullWidth>
      <InputLabel id="filter-label">Filter by rating</InputLabel>
      <Select
        labelId="filter-label"
        onChange={(event) => onFilterRating(Number(event.target.value))} // Call onFilterRating when the selected value changes
        defaultValue="-1" // Default value is -1, which represents 'All'
        aria-label="Rating Filter"
      >
        {ratings.map(renderMenuItem)}
      </Select>
    </FormControl>
  </FilterContainer>
);

// Export the RestaurantFilter component as the default export
export default RestaurantFilter;