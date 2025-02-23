import { Box, AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Link } from 'react-router-dom';

function Navbar() {
 

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: '#FAF2F2' }}>
        <Toolbar>
          {/* Navbar Items */}
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, color: 'black' }} >
            <Button color="inherit" component={Link} to="/">Home</Button>
            <Button color="inherit" component={Link} to="/gems">Gems</Button>
            <Button color="inherit" component={Link} to="/jewellery">Jewellery</Button>
            <Button color="inherit" component={Link} to="/About">About Us</Button>
            <Button color="inherit" component={Link} to="/Contact">Contact Us</Button>
          </Typography>

          {/* Right Side Items */}
          <IconButton
            size="large"
            aria-label="show cart items"
            color="black"
            component={Link} to="/cart"
          >
            <ShoppingCartIcon />
          </IconButton>

          <Button color="inherit" component={Link} to="/login" sx={{ mx: 2, color: 'black' }}>Sign In</Button>
          <Button color="inherit" component={Link} to="/signup"  sx={{ mx: 2, color: 'black' }}>Sign Up</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Navbar;
