import React, { useState, useEffect } from 'react';
import {
  Typography, Box, Rating, Grid, Button, Dialog,
  DialogActions, DialogContent, DialogContentText,
  DialogTitle, TextField
} from '@mui/material';

// Define the RestaurantDetails component
const RestaurantDetails = ({ selectedRestaurant }) => {
  // Define state variables for the dialog, review text, review rating, reviews, and average rating
  const [open, setOpen] = useState(false); // Dialog state
  const [reviewText, setReviewText] = useState(''); // Review text state
  const [reviewRating, setReviewRating] = useState(0); // Review rating state
  const [reviews, setReviews] = useState([]); // ReviewS state
  const [averageRating, setAverageRating] = useState(0); // Average rating state

  // Use an effect to update the reviews and average rating when the selected restaurant changes
  useEffect(() => {
    if (selectedRestaurant) {
      const { ratings } = selectedRestaurant; // Get ratings from the selected restaurant
      setReviews(ratings); // Set reviews to the ratings array
      const totalRating = ratings.reduce((acc, review) => acc + review.stars, 0); // Calculate the total rating for average rating
      setAverageRating(totalRating / ratings.length || 0); // Logical Operator to prevent NaN if ratings.length is 0
    }
  }, [selectedRestaurant]);

  // Define functions to open and close the dialog
  const handleOpen = () => setOpen(true); // Open the dialog
  const handleClose = () => setOpen(false); // Close the dialog


  const addReview = () => {
    const newReview = { comment: reviewText, stars: reviewRating }; // Create a new review object
    setReviews([...reviews, newReview]); // Add the new review to the reviews array
    setReviewText(''); // Reset review text
    setReviewRating(0); // Reset rating
    setOpen(false); // Close the dialog
  };

  // Message to display if no restaurant is selected
  if (!selectedRestaurant) {
    return <p>Click on a restaurant to view details.</p>;
  }

  // Render restaurant details
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <Box display="flex" justifyContent="center" alignItems="flex-start" height="100%">
          <img
            src={selectedRestaurant.imageUrl || 'https://via.placeholder.com/400x300?text=New+Restaurant'}
            alt={selectedRestaurant.restaurantName}
            style={{ width: '100%', objectFit: 'cover' }}
            onError={(e) => e.target.src = 'https://via.placeholder.com/400x300?text=No+Image+Available'}
          />
        </Box>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography variant="h4">{selectedRestaurant.restaurantName}</Typography>
        <Typography variant="h6">Average Rating:</Typography>
        <Rating
          name="average-rating"
          precision={0.5} // More accuracy for stars
          value={averageRating}
          readOnly />
        <Typography variant="body1">Address: {selectedRestaurant.address}</Typography>

        <Typography variant="h6">Ratings:</Typography>
        {reviews.map((rating, index) => (
          <Box key={index} mb={2}>
            <Rating
              name="rating"
              value={rating.stars}
              precision={0.5} // More accuracy for stars
              readOnly
              size="small"
            />
            <Typography variant="body2">{rating.comment}</Typography>
          </Box>
        ))}

        <Button variant="contained" color="primary" onClick={handleOpen}>Add Review</Button>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Add Review</DialogTitle>
          <DialogContent>
            <DialogContentText>Please write your review below:</DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="review"
              label="Review"
              type="text"
              fullWidth
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
            <Rating
              name="simple-controlled"
              value={reviewRating}
              onChange={(event, newValue) => setReviewRating(newValue)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={addReview}>Submit</Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </Grid>
  );
};

export default RestaurantDetails;