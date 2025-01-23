// import { Box, Divider, Drawer, List, Toolbar, Typography } from "@mui/material";
// import React from "react";
// import { links } from "../../data/links";
// import SidebarItem from "./SidebarItem";
// import SidebarItemCollapse from "./SidebarItemCollapse";

// const Sidebar = ({ window, sideBarWidth, mobileOpen, handleDrawerToggle }) => {
//   const drawer = (
//     <div>
//       <Toolbar>
//         <img src="/logo.png" alt="Logo" width="40" />
//         <Typography variant="h6" sx={{ fontWeight: "bold", ml: 2 }}>
//           Bangalore Club
//         </Typography>
//       </Toolbar>
//       <Divider />
//       <List disablePadding>
//         {links?.map((link, index) =>
//           link?.subLinks ? (
//             <SidebarItemCollapse {...link} key={index} />
//           ) : (
//             <SidebarItem {...link} key={index} />
//           )
//         )}
//       </List>
//     </div>
//   );

//   const container =
//     window !== undefined ? () => window().document.body : undefined;

//   return (
//     <Box
//       component="nav"
//       sx={{ width: { md: sideBarWidth }, flexShrink: { md: 0 } }}
//       aria-label="mailbox folders"
//     >
//       {/* For Mobile and Small Sized Tablets. */}
//       <Drawer
//         container={container}
//         variant="temporary"
//         open={mobileOpen}
//         onClose={handleDrawerToggle}
//         ModalProps={{
//           keepMounted: true, // Better open performance on mobile.
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

//       {/* For Desktop and large Sized Tablets. */}
//       <Drawer
//         variant="permanent"
//         sx={{
//           display: {
//             xs: "none",
//             md: "block",
//           },
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


// import React, { useEffect, useState } from "react";
// import { Box, Divider, Drawer, List, Toolbar, Typography, CircularProgress } from "@mui/material";
// // import { filterLinksByRole, fetchUserRole } from "../../utils/filterLinksByRole";
// import SidebarItem from "./SidebarItem";
// import SidebarItemCollapse from "./SidebarItemCollapse";
// import { fetchUserRole, filterLinksByRole } from "./filterLinksByRole";

// const Sidebar = ({ window, sideBarWidth, mobileOpen, handleDrawerToggle }) => {
//   const [filteredLinks, setFilteredLinks] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const initializeSidebar = async () => {
//       setLoading(true);
//       const role = await fetchUserRole(); // Fetch role from API
//       if (role) {
//         const authorizedLinks = filterLinksByRole(role);
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
//       {/* For Mobile and Small Sized Tablets */}
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

import React, { useEffect, useState } from "react";
import { Box, Divider, Drawer, List, Toolbar, Typography, CircularProgress } from "@mui/material";
import SidebarItem from "./SidebarItem";
import SidebarItemCollapse from "./SidebarItemCollapse";
import { fetchUserRole, filterLinksByRole } from "./filterLinksByRole";

const Sidebar = ({ window, sideBarWidth, mobileOpen, handleDrawerToggle }) => {
  const [filteredLinks, setFilteredLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeSidebar = async () => {
      setLoading(true);
      const role = await fetchUserRole(); // Fetch user role from API
      if (role) {
        const authorizedLinks = filterLinksByRole(role);
        setFilteredLinks(authorizedLinks);
      }
      setLoading(false);
    };
    initializeSidebar();
  }, []);

  const drawer = (
    <div>
      <Toolbar>
        <img src="/logo.png" alt="Logo" width="40" />
        <Typography variant="h6" sx={{ fontWeight: "bold", ml: 2 }}>
          Bangalore Club
        </Typography>
      </Toolbar>
      <Divider />
      {loading ? (
        <Box sx={{ textAlign: "center", py: 2 }}>
          <CircularProgress />
        </Box>
      ) : (
        <List disablePadding>
          {filteredLinks?.map((link, index) =>
            link?.subLinks ? (
              <SidebarItemCollapse {...link} key={index} />
            ) : (
              <SidebarItem {...link} key={index} />
            )
          )}
        </List>
      )}
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box
      component="nav"
      sx={{ width: { md: sideBarWidth }, flexShrink: { md: 0 } }}
      aria-label="mailbox folders"
    >
      {/* For Mobile and Small Sized Tablets */}
      <Drawer
        container={container}
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
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

      {/* For Desktop and Large Tablets */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
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


