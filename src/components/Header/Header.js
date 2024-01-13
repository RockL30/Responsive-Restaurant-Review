import React from 'react';
import { AppBar, Toolbar, Typography, Box } from "@mui/material";

const Header = ({ restaurantName = "Restaurant Review - Project 7" }) => {

  // restaurantName = "Restaurant Review - Project 7";

  return (
    <Box sx={{ flexGrow: 1, marginBottom: 2 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}>
            {restaurantName}
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
