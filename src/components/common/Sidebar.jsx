import { Box, Divider, Drawer, List, Toolbar, Typography } from "@mui/material";
import React from "react";
import { links } from "../../data/links";
import SidebarItem from "./SidebarItem";
import SidebarItemCollapse from "./SidebarItemCollapse";

const Sidebar = ({ window, sideBarWidth, mobileOpen, handleDrawerToggle }) => {
  const drawer = (
    <div>
      <Toolbar>
        <img src="/logo.png" alt="Logo" width="40" />
        <Typography variant="h6" sx={{ fontWeight: "bold", ml: 2 }}>
          Bangalore Club
        </Typography>
      </Toolbar>
      <Divider />
      <List disablePadding>
        {links?.map((link, index) =>
          link?.subLinks ? (
            <SidebarItemCollapse {...link} key={index} />
          ) : (
            <SidebarItem {...link} key={index} />
          )
        )}
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box
      component="nav"
      sx={{ width: { md: sideBarWidth }, flexShrink: { md: 0 } }}
      aria-label="mailbox folders"
    >
      {/* For Mobile and Small Sized Tablets. */}
      <Drawer
        container={container}
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: sideBarWidth,
            backgroundColor: "sidebar.background",
            color: "sidebar.textColor",
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* For Desktop and large Sized Tablets. */}
      <Drawer
        variant="permanent"
        sx={{
          display: {
            xs: "none",
            md: "block",
          },
          "& .MuiDrawer-paper": {
            width: sideBarWidth,
            boxSizing: "border-box",
            borderRight: 0,
            backgroundColor: "sidebar.background",
            color: "sidebar.textColor",
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;

// import React, { useEffect, useState } from "react";
// import { Box, Divider, Drawer, List, Toolbar, Typography, CircularProgress } from "@mui/material";
// import SidebarItem from "./SidebarItem";
// import SidebarItemCollapse from "./SidebarItemCollapse";
// import axios from "axios";
// import { links } from "../../data/links";
// import { PUBLIC_API_URI } from "../../api/config";


// const Sidebar = ({ window, sideBarWidth, mobileOpen, handleDrawerToggle }) => {
//   const [filteredLinks, setFilteredLinks] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Fetch permissions from the API
//   const fetchPermissionsForAdmin = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       console.error("No token found, user might not be authenticated.");
//       return null;
//     }

//     try {
//       const response = await axios.get(`${PUBLIC_API_URI}/get-permissions`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       if (response.status === 200) {
//         return response.data.permissions;
//       }
//     } catch (error) {
//       console.error("Failed to fetch permissions:", error);
//     }
//     return null;
//   };

//   console.log(filteredLinks, "filteredLinks")

//   // // Filter sidebar links based on permissions
//   // const filterLinksByPermissions = (permissions) => {
//   //   return links
//   //     .map((menu) => {
//   //       const menuPermission = permissions.find((perm) => perm.menuName === menu.name);
//   //       if (!menuPermission) return null; // Skip menus not in permissions

//   //       const filteredSubLinks = menu.subLinks
//   //         ? menu.subLinks.filter((subMenu) =>
//   //           menuPermission.subMenus.some((sub) => sub.name === subMenu.name)
//   //         )
//   //         : [];

//   //       console.log(filteredSubLinks, "filteredSubLinks")

//   //       return {
//   //         ...menu,
//   //         subLinks: filteredSubLinks,
//   //       };
//   //     })
//   //     .filter(Boolean); // Remove null values
//   // };
//   // Filter sidebar links based on permissions
//   const filterLinksByPermissions = (permissions) => {
//     return links.filter((menu) => {
//       // Find permissions for the current menu
//       const menuPermission = permissions.find((perm) => perm.menuName === menu.name);

//       // If no permission or the menu is not viewable, exclude it
//       if (!menuPermission || !menuPermission.status) return false;

//       // Filter submenus based on permissions
//       if (menu.subLinks) {
//         menu.subLinks = menu.subLinks.filter((subMenu) => {
//           const subPermission = menuPermission.subMenus.find((sub) => sub.name === subMenu.name);
//           return subPermission && subPermission.canView;
//         });

//         // Exclude the menu if no submenus are viewable
//         if (menu.subLinks.length === 0) return false;
//       }

//       return true;
//     });
//   };

//   // Initialize the sidebar
//   useEffect(() => {
//     const initializeSidebar = async () => {
//       setLoading(true);
//       const permissions = await fetchPermissionsForAdmin();
//       if (permissions) {
//         const authorizedLinks = filterLinksByPermissions(permissions);
//         setFilteredLinks(authorizedLinks);
//       }
//       setLoading(false);
//     };
//     initializeSidebar();
//   }, []);

//   const drawer = (
//     <div>
//       <Toolbar>
//         <img src="/logo.png" alt="Logo" width="40" />
//         <Typography variant="h6" sx={{ fontWeight: "bold", ml: 2 }}>
//           Bangalore Club
//         </Typography>
//       </Toolbar>
//       <Divider />
//       {loading ? (
//         <Box sx={{ textAlign: "center", py: 2 }}>
//           <CircularProgress />
//         </Box>
//       ) : (
//         // <List disablePadding>
//         //   {filteredLinks.map((link, index) =>
//         //     links.subLinks && link.subLinks.length > 0 ? (
//         //       <SidebarItemCollapse {...link} key={index} />
//         //     ) : (
//         //       <SidebarItem {...link} key={index} />
//         //     )
//         //   )}
//         // </List>
//         <List disablePadding>
//           {filteredLinks?.map((link, index) =>
//             link?.subLinks ? (
//               <SidebarItemCollapse {...link} key={index} />
//             ) : (
//               <SidebarItem {...link} key={index} />
//             )
//           )}
//         </List>
//       )}
//     </div>
//   );

//   const container = window !== undefined ? () => window().document.body : undefined;

//   return (
//     <Box
//       component="nav"
//       sx={{ width: { md: sideBarWidth }, flexShrink: { md: 0 } }}
//       aria-label="mailbox folders"
//     >
//       {/* For Mobile and Small-Sized Tablets */}
//       <Drawer
//         container={container}
//         variant="temporary"
//         open={mobileOpen}
//         onClose={handleDrawerToggle}
//         ModalProps={{
//           keepMounted: true, // Better open performance on mobile
//         }}
//         sx={{
//           display: { xs: "block", md: "none" },
//           "& .MuiDrawer-paper": {
//             boxSizing: "border-box",
//             width: sideBarWidth,
//             backgroundColor: "sidebar.background",
//             color: "sidebar.textColor",
//           },
//         }}
//       >
//         {drawer}
//       </Drawer>

//       {/* For Desktop and Large Tablets */}
//       <Drawer
//         variant="permanent"
//         sx={{
//           display: { xs: "none", md: "block" },
//           "& .MuiDrawer-paper": {
//             width: sideBarWidth,
//             boxSizing: "border-box",
//             borderRight: 0,
//             backgroundColor: "sidebar.background",
//             color: "sidebar.textColor",
//           },
//         }}
//         open
//       >
//         {drawer}
//       </Drawer>
//     </Box>
//   );
// };

// export default Sidebar;
