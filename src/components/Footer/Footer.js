import React from 'react';
import PropTypes from 'prop-types';
import { Box, Link, IconButton } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from '@mui/icons-material/GitHub';

const Footer = ({ socialLinks }) => {
  return (
    <Box
      sx={{
        width: "100%",
        // add more styles?
      }}
      component="footer"
    >
      <Box sx={{ display: "flex", justifyContent: "center", pt: 1 }}>
        {socialLinks.map((link, index) => (
          <IconButton key={index} color="inherit" aria-label={link.label}>
            <Link href={link.href} target="_blank">
              {link.icon}
            </Link>
          </IconButton>
        ))}
      </Box>
    </Box>
  );
};

// Used prop types for type checking
Footer.propTypes = {
  socialLinks: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.node.isRequired,
      href: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
};

// Links
const socialLinks = [
  { icon: <FacebookIcon />, href: "https://www.facebook.com/Franc1scoMat/", label: "Facebook" },
  { icon: <LinkedInIcon />, href: "https://www.linkedin.com/in/franc1scomat/", label: "LinkedIn" },
  { icon: <GitHubIcon />, href: "https://github.com/elthask", label: "GitHub" },
];

export default function App() {
  return <Footer socialLinks={socialLinks} />;
}
