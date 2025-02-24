

import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    Grid,
    Paper,
    Typography,
    CircularProgress,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { getRequest, putRequest } from "../../../api/commonAPI";
import { showToast } from "../../../api/toast";
import Breadcrumb from "../../../components/common/Breadcrumb";
import { links } from "../../../data/links";

const SinglePermission = () => {
    const navigate = useNavigate()
    const { roleId } = useParams();
    const [permissions, setPermissions] = useState({});
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        fetchPermissions(roleId);
    }, [roleId]);

    // Fetch permissions for the role
    const fetchPermissions = async (roleId) => {
        try {
            setLoading(true);
            const response = await getRequest(`/permissions/${roleId}`);
            const fetchedPermissions = response?.data?.permissions || [];
            const formattedPermissions = initializePermissions(fetchedPermissions);
            setPermissions(formattedPermissions);
        } catch (error) {
            console.error("Failed to fetch permissions:", error);
            showToast("Failed to fetch permissions. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    // Initialize permissions with all links/sub-links and mark API-provided ones as checked
    const initializePermissions = (fetchedPermissions) => {
        const initialized = {};
        links.forEach((menu) => {
            const existingPermission = fetchedPermissions.find(
                (perm) => perm.menuName === menu.name
            );
            initialized[menu.name] = {
                isChecked: !!existingPermission, // Checked if in API
                subMenus: menu.subLinks.map((subMenu) => {
                    const subPermission = existingPermission?.subMenus.find(
                        (sub) => sub.name === subMenu.name
                    );
                    return {
                        name: subMenu.name,
                        isChecked: !!subPermission, // Checked if in API
                        canView: subPermission?.canView || false,
                        canEdit: subPermission?.canEdit || false,
                        canDelete: subPermission?.canDelete || false,
                        canAdd: subPermission?.canAdd || false,
                    };
                }),
            };
        });
        return initialized;
    };

    // Handle main link checkbox change
    const handleMenuChange = (menuName, checked) => {
        setPermissions((prev) => ({
            ...prev,
            [menuName]: {
                isChecked: checked,
                subMenus: prev[menuName].subMenus.map((subMenu) => ({
                    ...subMenu,
                    isChecked: checked,
                    canView: checked,
                    canEdit: checked,
                    canDelete: checked,
                    canAdd: checked,
                })),
            },
        }));
    };

    // Handle sub-link checkbox change
    const handleSubMenuChange = (menuName, subMenuName, checked) => {
        setPermissions((prev) => ({
            ...prev,
            [menuName]: {
                ...prev[menuName],
                subMenus: prev[menuName].subMenus.map((subMenu) =>
                    subMenu.name === subMenuName
                        ? {
                            ...subMenu,
                            isChecked: checked,
                            canView: checked,
                            canEdit: checked,
                            canDelete: checked,
                            canAdd: checked,
                        }
                        : subMenu
                ),
            },
        }));
    };

    // Handle CRUD permission checkbox change
    const handleCrudChange = (menuName, subMenuName, permissionType, checked) => {
        setPermissions((prev) => ({
            ...prev,
            [menuName]: {
                ...prev[menuName],
                subMenus: prev[menuName].subMenus.map((subMenu) =>
                    subMenu.name === subMenuName
                        ? { ...subMenu, [permissionType]: checked }
                        : subMenu
                ),
            },
        }));
    };

    // Save permissions
    const handleSavePermissions = async () => {
        try {
            setLoading(true);

            // Filter only checked menus and sub-menus
            const formattedPermissions = Object.entries(permissions).reduce(
                (acc, [menuName, menuPermissions]) => {
                    if (menuPermissions.isChecked) {
                        acc.push({
                            menuName,
                            subMenus: menuPermissions.subMenus
                                .filter((subMenu) => subMenu.isChecked)
                                .map((subMenu) => ({
                                    name: subMenu.name,
                                    canView: subMenu.canView,
                                    canEdit: subMenu.canEdit,
                                    canDelete: subMenu.canDelete,
                                    canAdd: subMenu.canAdd,
                                })),
                        });
                    }
                    return acc;
                },
                []
            );

            // Send the filtered payload to the API
            await putRequest("/permissions", { roleId, permissions: formattedPermissions });

            showToast("Permissions updated successfully!", "success");
            navigate(`/role/${roleId}`)
            fetchPermissions(roleId); // Refresh permissions after saving
        } catch (error) {
            console.error("Failed to save permissions:", error);
            showToast("Failed to save permissions. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ textAlign: "center", mt: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ pt: "80px", pb: "20px" }}>
            <Breadcrumb />
            <Typography variant="h4" sx={{ mb: 2 }}>
                Role Permissions
            </Typography>
            <Paper elevation={3} sx={{ p: 3, borderRadius: "12px", mb: 3 }}>
                {links.map((menu) => (
                    <Box key={menu.name} sx={{ mb: 3 }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={permissions[menu.name]?.isChecked || false}
                                    onChange={(e) => handleMenuChange(menu.name, e.target.checked)}
                                />
                            }
                            label={menu.name}
                        />
                        <Grid container spacing={2} sx={{ ml: 3 }}>
                            {menu.subLinks.map((subMenu) => (
                                <Grid item xs={12} md={6} key={subMenu.name}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={
                                                    permissions[menu.name]?.subMenus.find(
                                                        (sub) => sub.name === subMenu.name
                                                    )?.isChecked || false
                                                }
                                                disabled={!permissions[menu.name]?.isChecked}
                                                onChange={(e) =>
                                                    handleSubMenuChange(
                                                        menu.name,
                                                        subMenu.name,
                                                        e.target.checked
                                                    )
                                                }
                                            />
                                        }
                                        label={subMenu.name}
                                    />
                                    <Box sx={{ ml: 3 }}>
                                        {["canView", "canEdit", "canDelete", "canAdd"].map((crudType) => (
                                            <FormControlLabel
                                                key={crudType}
                                                control={
                                                    <Checkbox
                                                        checked={
                                                            permissions[menu.name]?.subMenus.find(
                                                                (sub) => sub.name === subMenu.name
                                                            )?.[crudType] || false
                                                        }
                                                        disabled={
                                                            !permissions[menu.name]?.isChecked ||
                                                            !permissions[menu.name]?.subMenus.find(
                                                                (sub) => sub.name === subMenu.name
                                                            )?.isChecked
                                                        }
                                                        onChange={(e) =>
                                                            handleCrudChange(
                                                                menu.name,
                                                                subMenu.name,
                                                                crudType,
                                                                e.target.checked
                                                            )
                                                        }
                                                    />
                                                }
                                                label={crudType.replace("can", "")}
                                            />
                                        ))}
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                ))}
            </Paper>
            <Button
                variant="contained"
                color="primary"
                onClick={handleSavePermissions}
                disabled={loading}
            >
                Save Permissions
            </Button>
        </Box>
    );
};

export default SinglePermission;


// import React, { useState, useEffect } from "react";
// import {
//     Box,
//     Button,
//     Checkbox,
//     FormControlLabel,
//     Grid,
//     Paper,
//     Typography,
//     CircularProgress,
// } from "@mui/material";
// import { useParams } from "react-router-dom";
// import { getRequest, putRequest } from "../../../api/commonAPI";
// import { showToast } from "../../../api/toast";
// import Breadcrumb from "../../../components/common/Breadcrumb";
// import { links } from "../../../data/links";

// const SinglePermission = () => {
//     const { roleId } = useParams();
//     const [permissions, setPermissions] = useState({});
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         fetchPermissions(roleId);
//     }, [roleId]);

//     // Fetch permissions for the role
//     const fetchPermissions = async (roleId) => {
//         try {
//             setLoading(true);
//             const response = await getRequest(`/permissions/${roleId}`);
//             const fetchedPermissions = response?.data?.permissions || [];
//             const formattedPermissions = initializePermissions(fetchedPermissions);
//             setPermissions(formattedPermissions);
//         } catch (error) {
//             console.error("Failed to fetch permissions:", error);
//             showToast("Failed to fetch permissions. Please try again.", "error");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Initialize permissions with all links/sub-links and mark API-provided ones as checked
//     const initializePermissions = (fetchedPermissions) => {
//         const initialized = {};
//         links.forEach((menu) => {
//             const existingPermission = fetchedPermissions.find(
//                 (perm) => perm.menuName === menu.name
//             );
//             initialized[menu.name] = {
//                 isChecked: !!existingPermission, // Checked if in API
//                 subMenus: menu.subLinks.map((subMenu) => {
//                     const subPermission = existingPermission?.subMenus.find(
//                         (sub) => sub.name === subMenu.name
//                     );
//                     return {
//                         name: subMenu.name,
//                         isChecked: !!subPermission, // Checked if in API
//                         canView: subPermission?.canView || false,
//                         canEdit: subPermission?.canEdit || false,
//                         canDelete: subPermission?.canDelete || false,
//                         canAdd: subPermission?.canAdd || false,
//                     };
//                 }),
//             };
//         });
//         return initialized;
//     };

//     // Handle main link checkbox change
//     const handleMenuChange = (menuName, checked) => {
//         setPermissions((prev) => ({
//             ...prev,
//             [menuName]: {
//                 isChecked: checked,
//                 subMenus: prev[menuName].subMenus.map((subMenu) => ({
//                     ...subMenu,
//                     isChecked: checked,
//                     canView: checked,
//                     canEdit: checked,
//                     canDelete: checked,
//                     canAdd: checked,
//                 })),
//             },
//         }));
//     };

//     // Handle sub-link checkbox change
//     const handleSubMenuChange = (menuName, subMenuName, checked) => {
//         setPermissions((prev) => ({
//             ...prev,
//             [menuName]: {
//                 ...prev[menuName],
//                 subMenus: prev[menuName].subMenus.map((subMenu) =>
//                     subMenu.name === subMenuName
//                         ? {
//                             ...subMenu,
//                             isChecked: checked,
//                             canView: checked,
//                             canEdit: checked,
//                             canDelete: checked,
//                             canAdd: checked,
//                         }
//                         : subMenu
//                 ),
//             },
//         }));
//     };

//     // Handle CRUD permission checkbox change
//     const handleCrudChange = (menuName, subMenuName, permissionType, checked) => {
//         setPermissions((prev) => ({
//             ...prev,
//             [menuName]: {
//                 ...prev[menuName],
//                 subMenus: prev[menuName].subMenus.map((subMenu) =>
//                     subMenu.name === subMenuName
//                         ? { ...subMenu, [permissionType]: checked }
//                         : subMenu
//                 ),
//             },
//         }));
//     };

//     // Save permissions
//     const handleSavePermissions = async () => {
//         try {
//             setLoading(true);

//             // Filter only checked menus and sub-menus
//             const formattedPermissions = Object.entries(permissions).reduce(
//                 (acc, [menuName, menuPermissions]) => {
//                     if (menuPermissions.isChecked) {
//                         acc.push({
//                             menuName,
//                             subMenus: menuPermissions.subMenus
//                                 .filter((subMenu) => subMenu.isChecked)
//                                 .map((subMenu) => ({
//                                     name: subMenu.name,
//                                     canView: subMenu.canView,
//                                     canEdit: subMenu.canEdit,
//                                     canDelete: subMenu.canDelete,
//                                     canAdd: subMenu.canAdd,
//                                 })),
//                         });
//                     }
//                     return acc;
//                 },
//                 []
//             );

//             // Send the filtered payload to the API
//             await putRequest("/permissions", { roleId, permissions: formattedPermissions });

//             showToast("Permissions updated successfully!", "success");
//             fetchPermissions(roleId); // Refresh permissions after saving
//         } catch (error) {
//             console.error("Failed to save permissions:", error);
//             showToast("Failed to save permissions. Please try again.", "error");
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (loading) {
//         return (
//             <Box sx={{ textAlign: "center", mt: 5 }}>
//                 <CircularProgress />
//             </Box>
//         );
//     }

//     return (
//         <Box sx={{ pt: "80px", pb: "20px" }}>
//             <Breadcrumb />
//             <Typography variant="h4" sx={{ mb: 2 }}>
//                 Role Permissions
//             </Typography>
//             <Paper elevation={3} sx={{ p: 3, borderRadius: "12px", mb: 3 }}>
//                 {links.map((menu) => (
//                     <Box key={menu.name} sx={{ mb: 3 }}>
//                         <FormControlLabel
//                             control={
//                                 <Checkbox
//                                     checked={permissions[menu.name]?.isChecked || false}
//                                     onChange={(e) => handleMenuChange(menu.name, e.target.checked)}
//                                 />
//                             }
//                             label={menu.name}
//                         />
//                         <Grid container spacing={2} sx={{ ml: 3 }}>
//                             {menu.subLinks.map((subMenu) => (
//                                 <Grid item xs={12} md={6} key={subMenu.name}>
//                                     <FormControlLabel
//                                         control={
//                                             <Checkbox
//                                                 checked={
//                                                     permissions[menu.name]?.subMenus.find(
//                                                         (sub) => sub.name === subMenu.name
//                                                     )?.isChecked || false
//                                                 }
//                                                 disabled={!permissions[menu.name]?.isChecked}
//                                                 onChange={(e) =>
//                                                     handleSubMenuChange(
//                                                         menu.name,
//                                                         subMenu.name,
//                                                         e.target.checked
//                                                     )
//                                                 }
//                                             />
//                                         }
//                                         label={subMenu.name}
//                                     />
//                                     <Box sx={{ ml: 3 }}>
//                                         {["canView", "canEdit", "canDelete", "canAdd"].map((crudType) => (
//                                             <FormControlLabel
//                                                 key={crudType}
//                                                 control={
//                                                     <Checkbox
//                                                         checked={
//                                                             permissions[menu.name]?.subMenus.find(
//                                                                 (sub) => sub.name === subMenu.name
//                                                             )?.[crudType] || false
//                                                         }
//                                                         disabled={
//                                                             !permissions[menu.name]?.isChecked ||
//                                                             !permissions[menu.name]?.subMenus.find(
//                                                                 (sub) => sub.name === subMenu.name
//                                                             )?.isChecked
//                                                         }
//                                                         onChange={(e) =>
//                                                             handleCrudChange(
//                                                                 menu.name,
//                                                                 subMenu.name,
//                                                                 crudType,
//                                                                 e.target.checked
//                                                             )
//                                                         }
//                                                     />
//                                                 }
//                                                 label={crudType.replace("can", "")}
//                                             />
//                                         ))}
//                                     </Box>
//                                 </Grid>
//                             ))}
//                         </Grid>
//                     </Box>
//                 ))}
//             </Paper>
//             <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handleSavePermissions}
//                 disabled={loading}
//             >
//                 Save Permissions
//             </Button>
//         </Box>
//     );
// };

// export default SinglePermission;




//-------------------------------------------------------------------------------
// import React, { useState, useEffect } from "react";
// import {
//     Box,
//     Button,
//     Checkbox,
//     FormControlLabel,
//     Grid,
//     Paper,
//     Typography,
//     Dialog,
//     DialogActions,
//     DialogContent,
//     DialogTitle,
//     CircularProgress,
// } from "@mui/material";
// import { useParams } from "react-router-dom";
// import { getRequest, putRequest } from "../../../api/commonAPI";
// import { showToast } from "../../../api/toast";
// import Breadcrumb from "../../../components/common/Breadcrumb";
// import { links } from "../../../data/links";

// const SinglePermission = () => {
//     const { roleId } = useParams();
//     const [permissions, setPermissions] = useState({});
//     const [loading, setLoading] = useState(false);
//     const [isEditDialogOpen, setEditDialogOpen] = useState(false);

//     // Fetch permissions for the role on component mount
//     useEffect(() => {
//         fetchPermissions(roleId);
//     }, [roleId]);

//     // Fetch API permissions and merge with base `links`
//     const fetchPermissions = async (roleId) => {
//         try {
//             setLoading(true);
//             const response = await getRequest(`/permissions/${roleId}`);
//             const fetchedPermissions = response?.data?.permissions || [];
//             const formattedPermissions = formatPermissions(fetchedPermissions);

//             setPermissions(formattedPermissions);
//         } catch (error) {
//             console.error("Failed to fetch permissions:", error);
//             showToast("Failed to fetch permissions. Please try again.", "error");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Merge `links` with API permissions
//     const formatPermissions = (fetchedPermissions) => {
//         const formatted = {};

//         // Iterate over the `links` array
//         links.forEach((menu) => {
//             const rolePermission = fetchedPermissions.find(
//                 (perm) => perm.menuName === menu.name
//             );

//             formatted[menu.name] = {
//                 canView: rolePermission?.canView || false, // Default to false if not in API
//                 subMenus: menu.subLinks.map((subMenu) => {
//                     const subPermission = rolePermission?.subMenus.find(
//                         (sub) => sub.name === subMenu.name
//                     );

//                     return {
//                         name: subMenu.name,
//                         canView: subPermission?.canView || false, // Default permissions
//                         canEdit: subPermission?.canEdit || false,
//                         canDelete: subPermission?.canDelete || false,
//                         canAdd: subPermission?.canAdd || false,
//                     };
//                 }),
//             };
//         });

//         return formatted;
//     };

//     const handleEditClick = () => setEditDialogOpen(true);
//     const handleDialogClose = () => setEditDialogOpen(false);

//     // Menu-level permissions change
//     const handleMenuChange = (menuName, checked) => {
//         setPermissions((prev) => ({
//             ...prev,
//             [menuName]: {
//                 ...prev[menuName],
//                 canView: checked,
//                 subMenus: prev[menuName].subMenus.map((subMenu) => ({
//                     ...subMenu,
//                     canView: checked,
//                 })),
//             },
//         }));
//     };

//     // Submenu-level permissions change
//     const handleSubMenuChange = (menuName, subMenuName, permissionType, checked) => {
//         setPermissions((prev) => ({
//             ...prev,
//             [menuName]: {
//                 ...prev[menuName],
//                 subMenus: prev[menuName].subMenus.map((subMenu) =>
//                     subMenu.name === subMenuName
//                         ? { ...subMenu, [permissionType]: checked }
//                         : subMenu
//                 ),
//             },
//         }));
//     };

//     // Save permissions
//     const handleSavePermissions = async () => {
//         try {
//             setLoading(true);
//             const formattedPermissions = Object.entries(permissions).map(
//                 ([menuName, menuPermissions]) => ({
//                     menuName,
//                     canView: menuPermissions.canView,
//                     subMenus: menuPermissions.subMenus.map((subMenu) => ({
//                         name: subMenu.name,
//                         canView: subMenu.canView,
//                         canEdit: subMenu.canEdit,
//                         canDelete: subMenu.canDelete,
//                         canAdd: subMenu.canAdd,
//                     })),
//                 })
//             );

//             await putRequest("/permissions", { roleId, permissions: formattedPermissions });
//             fetchPermissions(roleId);
//             showToast("Permissions updated successfully!", "success");
//             setEditDialogOpen(false);
//         } catch (error) {
//             console.error("Failed to update permissions:", error);
//             showToast("Failed to update permissions. Please try again.", "error");
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (loading) {
//         return (
//             <Box
//                 sx={{
//                     position: "absolute",
//                     top: 0,
//                     left: 0,
//                     width: "100%",
//                     height: "100%",
//                     backgroundColor: "rgba(255, 255, 255, 0.7)",
//                     zIndex: 1000,
//                     display: "flex",
//                     justifyContent: "center",
//                     alignItems: "center",
//                 }}
//             >
//                 <CircularProgress />
//             </Box>
//         );
//     }

//     return (
//         <Box sx={{ pt: "80px", pb: "20px" }}>
//             <Breadcrumb />
//             <Typography variant="h4" sx={{ mb: 2 }}>
//                 Role Permissions
//             </Typography>
//             <Paper elevation={3} sx={{ p: 3, borderRadius: "12px", mb: 3 }}>
//                 <Typography variant="h6" sx={{ mb: 2 }}>
//                     Permissions for Role ID: {roleId}
//                 </Typography>
//                 {links.map((menu) => (
//                     <Box key={menu.name} sx={{ mb: 3 }}>
//                         {/* Menu-Level Permissions */}
//                         <FormControlLabel
//                             control={
//                                 <Checkbox
//                                     checked={permissions[menu.name]?.canView || false}
//                                     onChange={(e) =>
//                                         handleMenuChange(menu.name, e.target.checked)
//                                     }
//                                 />
//                             }
//                             label={menu.name}
//                         />
//                         {/* Submenu-Level Permissions */}
//                         <Grid container spacing={2} sx={{ ml: 3 }}>
//                             {menu.subLinks.map((subMenu) => {
//                                 const subPermission = permissions[menu.name]?.subMenus.find(
//                                     (sub) => sub.name === subMenu.name
//                                 );

//                                 return (
//                                     <Grid item xs={12} md={6} key={subMenu.name}>
//                                         <Typography variant="body2" sx={{ mb: 1 }}>
//                                             {subMenu.name}
//                                         </Typography>
//                                         <FormControlLabel
//                                             control={
//                                                 <Checkbox
//                                                     checked={subPermission?.canView || false}
//                                                     onChange={(e) =>
//                                                         handleSubMenuChange(
//                                                             menu.name,
//                                                             subMenu.name,
//                                                             "canView",
//                                                             e.target.checked
//                                                         )
//                                                     }
//                                                 />
//                                             }
//                                             label="View"
//                                         />
//                                         <FormControlLabel
//                                             control={
//                                                 <Checkbox
//                                                     checked={subPermission?.canEdit || false}
//                                                     onChange={(e) =>
//                                                         handleSubMenuChange(
//                                                             menu.name,
//                                                             subMenu.name,
//                                                             "canEdit",
//                                                             e.target.checked
//                                                         )
//                                                     }
//                                                 />
//                                             }
//                                             label="Edit"
//                                         />
//                                         <FormControlLabel
//                                             control={
//                                                 <Checkbox
//                                                     checked={subPermission?.canDelete || false}
//                                                     onChange={(e) =>
//                                                         handleSubMenuChange(
//                                                             menu.name,
//                                                             subMenu.name,
//                                                             "canDelete",
//                                                             e.target.checked
//                                                         )
//                                                     }
//                                                 />
//                                             }
//                                             label="Delete"
//                                         />
//                                         <FormControlLabel
//                                             control={
//                                                 <Checkbox
//                                                     checked={subPermission?.canAdd || false}
//                                                     onChange={(e) =>
//                                                         handleSubMenuChange(
//                                                             menu.name,
//                                                             subMenu.name,
//                                                             "canAdd",
//                                                             e.target.checked
//                                                         )
//                                                     }
//                                                 />
//                                             }
//                                             label="Add"
//                                         />
//                                     </Grid>
//                                 );
//                             })}
//                         </Grid>
//                     </Box>
//                 ))}
//             </Paper>
//             <Dialog open={isEditDialogOpen} onClose={handleDialogClose} fullWidth maxWidth="md">
//                 <DialogTitle>Edit Permissions</DialogTitle>
//                 <DialogContent>
//                     <Typography variant="body1" color="warning.main" sx={{ mb: 2 }}>
//                         Are you sure you want to update the permissions for this role? This action
//                         will override all existing permissions and cannot be undone.
//                     </Typography>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={handleDialogClose} color="secondary">
//                         Cancel
//                     </Button>
//                     <Button onClick={handleSavePermissions} color="primary">
//                         Save Changes
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//             <Button
//                 variant="contained"
//                 color="primary"
//                 sx={{ mt: 3 }}
//                 onClick={handleEditClick}
//                 disabled={loading}
//             >
//                 Edit Permissions
//             </Button>
//         </Box>
//     );
// };

// export default SinglePermission;
