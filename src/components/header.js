import { Link, withPrefix } from "gatsby";
import Button from "@mui/material/Button";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

const pages = [
  { name: "Paper List", href: "/" },
  { name: "Further Material", href: "/material" },
  { name: "About", href: "/about" },
];

const Header = () => (
  <AppBar position="static" color="primary">
    <Toolbar disableGutters>
      <Typography variant="h5" noWrap sx={{ ml: 2, mr: 4, fontWeight: "bold" }}>
        Liquid Democracy in Social Choice
      </Typography>
      {pages.map((page) => (
        <Button
          key={page.name}
          sx={{ mr: 1 }}
          color="inherit"
          component={Link}
          to={page.href}  
        >
          {page.name}
        </Button>
      ))}
    </Toolbar>
  </AppBar>
);

export default Header;
