// import * as React from "react";
// import Avatar from "@mui/material/Avatar";
// import Menu from "@mui/material/Menu";
// import MenuItem from "@mui/material/MenuItem";
// import ListItemIcon from "@mui/material/ListItemIcon";
// import Divider from "@mui/material/Divider";
// import IconButton from "@mui/material/IconButton";
// import Tooltip from "@mui/material/Tooltip";
// import PersonAdd from "@mui/icons-material/PersonAdd";
// import Settings from "@mui/icons-material/Settings";
// import Logout from "@mui/icons-material/Logout";

// const ProfileMenu = () => {
//   const [anchorEl, setAnchorEl] = React.useState(null);
//   const open = Boolean(anchorEl);
//   const handleClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };
//   const handleClose = () => {
//     setAnchorEl(null);
//   };
//   return (
//     <>
//       <Tooltip title="Account settings" arrow>
//         <IconButton
//           onClick={handleClick}
//           size="small"
//           sx={{ ml: 2 }}
//           aria-controls={open ? "account-menu" : undefined}
//           aria-haspopup="true"
//           aria-expanded={open ? "true" : undefined}
//         >
//           <Avatar
//             sx={{ width: 32, height: 32 }}
//             src="/images/avatars/profile-avatar.png"
//           />
//         </IconButton>
//       </Tooltip>

//       <Menu
//         anchorEl={anchorEl}
//         id="account-menu"
//         open={open}
//         onClose={handleClose}
//         onClick={handleClose}
//         PaperProps={{
//           elevation: 0,
//           sx: {
//             overflow: "visible",
//             mt: 1.5,
//             "& .MuiAvatar-root": {
//               width: 32,
//               height: 32,
//               ml: -0.5,
//               mr: 1,
//             },
//             "&:before": {
//               content: '""',
//               display: "block",
//               position: "absolute",
//               top: 0,
//               right: 14,
//               width: 10,
//               height: 10,
//               bgcolor: "background.paper",
//               transform: "translateY(-50%) rotate(45deg)",
//               zIndex: 0,
//             },
//           },
//         }}
//         transformOrigin={{ horizontal: "right", vertical: "top" }}
//         anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
//       >
//         <MenuItem>
//           <Avatar /> Profile
//         </MenuItem>
//         <MenuItem>
//           <Avatar /> My account
//         </MenuItem>
//         <Divider />
//         <MenuItem>
//           <ListItemIcon>
//             <PersonAdd fontSize="small" />
//           </ListItemIcon>
//           Manage Other Accounts
//         </MenuItem>
//         <MenuItem>
//           <ListItemIcon>
//             <Settings fontSize="small" />
//           </ListItemIcon>
//           Settings
//         </MenuItem>
//         <MenuItem>
//           <ListItemIcon>
//             <Logout fontSize="small" />
//           </ListItemIcon>
//           Logout
//         </MenuItem>
//       </Menu>
//     </>
//   );
// };

// export default ProfileMenu;

import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { PUBLIC_API_URI } from "../../api/config";
import { showToast } from "../../api/toast";

const ProfileMenu = ({ role }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  // const [role, setRole] = React.useState('')
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  // Retrieve the user role from localStorage or sessionStorage
  // const userRole = localStorage.getItem("role") || sessionStorage.getItem("role");
  // React.useEffect(() => {
  //   // Function to fetch the user role from localStorage or sessionStorage
  //   const fetchUserRole = () => {
  //     try {
  //       // Retrieve the role from localStorage or sessionStorage
  //       const userRole = localStorage.getItem("role") || sessionStorage.getItem("role");

  //       if (userRole) {
  //         // If the role exists, update the state
  //         setRole(userRole);
  //       } else {
  //         // If no role is found, redirect to the login page
  //         navigate("/login");
  //       }
  //     } catch (error) {
  //       console.error("Error retrieving user role:", error);
  //       navigate("/login"); // Redirect to login in case of an error
  //     }
  //   };

  //   fetchUserRole();
  // }, [navigate]); // Include navigate as a dependency to ensure it's accessible

  // Handle menu open
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle menu close
  const handleClose = () => {
    setAnchorEl(null);
  };

  // // Logout function
  // const handleLogout = () => {
  //   // Clear authentication data
  //   localStorage.removeItem("token");
  //   sessionStorage.removeItem("token");
  //   // localStorage.removeItem("rememberedEmail");
  //   // localStorage.removeItem("rememberedPassword");
  //   // localStorage.removeItem("rememberMe");

  //   // Optionally clear any user data in state (if using a context or state management)
  //   // Redirect to the login page
  //   navigate("/login");
  // };
  const handleLogout = async () => {
    try {
      // Get the token from localStorage or sessionStorage
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");

      if (!token) {
        console.warn("No token found. Redirecting to login...");
        navigate("/login");
        return;
      }

      // Make the API call to the logout endpoint
      const response = await axios.post(
        `${PUBLIC_API_URI}/admin/logout`, // Replace with your API URL
        {}, // Body (if needed, else pass an empty object)
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the header
          },
        }
      );

      if (response.status === 200) {
        console.log("Logout successful:", response.data.message);
        showToast(response.data.message, "success")
      }

      // Clear authentication data
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      localStorage.removeItem("role");

      // Optionally clear additional data (commented here)
      // localStorage.removeItem("rememberedEmail");
      // localStorage.removeItem("rememberedPassword");
      // localStorage.removeItem("rememberMe");

      // Redirect to the login page
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error?.response?.data || error.message);

      // Handle error appropriately, e.g., show a message to the user
      alert("An error occurred during logout. Please try again.");
    }
  };

  // Render Logout button only for gatekeeper role
  if (role === "gatekeeper") {
    return (
      <Tooltip title="Logout" arrow>
        <IconButton onClick={handleLogout} size="small" sx={{ ml: 2 }}>
          <Logout fontSize="small" />
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <>
      <Tooltip title="Account settings" arrow>
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <Avatar
            sx={{ width: 32, height: 32 }}
            src="/images/avatars/profile-avatar.png"
          />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {/* <MenuItem>
          <Avatar /> Profile
        </MenuItem>
        <MenuItem>
          <Avatar /> My account
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Manage Other Accounts
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem> */}
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default ProfileMenu;
