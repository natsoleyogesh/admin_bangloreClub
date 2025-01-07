import {
  AppBar,
  Badge,
  Box,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import { BsBell } from "react-icons/bs";
import { FiMenu, FiMoon, FiSun } from "react-icons/fi";
import { useColorTheme } from "../../contexts/ThemeContext";
import ProfileMenu from "./ProfileMenu";
import { useNavigate } from "react-router-dom";

const Navbar = ({ sideBarWidth, handleDrawerToggle }) => {
  const [role, setRole] = React.useState('')
  const navigate = useNavigate();
  const colorMode = useColorTheme();
  const theme = useTheme();

  const currentTheme = theme.palette.mode;

  React.useEffect(() => {
    // Function to fetch the user role from localStorage or sessionStorage
    const fetchUserRole = () => {
      try {
        // Retrieve the role from localStorage or sessionStorage
        const userRole = localStorage.getItem("role") || sessionStorage.getItem("role");

        if (userRole) {
          // If the role exists, update the state
          setRole(userRole);
        } else {
          // If no role is found, redirect to the login page
          navigate("/login");
        }
      } catch (error) {
        console.error("Error retrieving user role:", error);
        navigate("/login"); // Redirect to login in case of an error
      }
    };

    fetchUserRole();
  }, [navigate]); // Include navigate as a dependency to ensure it's acc

  return (
    <AppBar
      position="fixed"
      sx={{
        // width: { md: `calc(100% - ${sideBarWidth}px)` },
        width: { md: role === "gatekeeper" ? "100%" : `calc(100% - ${sideBarWidth}px)` },
        ml: { md: `${sideBarWidth}px` },
        boxShadow: "unset",
        backgroundColor: "background.paper",
        color: "text.primary",
        borderBottomWidth: 1,
        borderBottomColor: "divider",
      }}
    >
      <Toolbar>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Tooltip title="Menu" arrow>
              <IconButton
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { md: "none" } }}
              >
                <FiMenu />
              </IconButton>
            </Tooltip>

            <Typography
              variant="h5"
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              {/* Dashboard */}
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <Tooltip title="Notifications" arrow>
              <IconButton sx={{ fontSize: "20px", color: "text.primary" }}>
                <Badge color="error" variant="dot">
                  <BsBell />
                </Badge>
              </IconButton>
            </Tooltip>
            <Tooltip title="Toggle Theme" arrow>
              <IconButton
                onClick={colorMode.toggleColorMode}
                sx={{ fontSize: "20px", color: "text.primary" }}
              >
                {currentTheme === "light" ? <FiMoon /> : <FiSun />}
              </IconButton>
            </Tooltip>

            <ProfileMenu role={role} />
          </Stack>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
