// import React, { useState, useEffect } from "react";
// import {
//     Box,
//     Button,
//     Checkbox,
//     FormControlLabel,
//     Grid,
//     Paper,
//     Typography,
//     Select,
//     MenuItem,
//     FormControl,
//     InputLabel,
// } from "@mui/material";

// import { getRequest, postRequest } from "../../../api/commonAPI";
// import { links } from "../../../data/links";
// import Breadcrumb from "../../../components/common/Breadcrumb";
// import { showToast } from "../../../api/toast";

// const AddPermission = () => {
//     const [roles, setRoles] = useState([]);
//     const [selectedRole, setSelectedRole] = useState("");
//     const [permissions, setPermissions] = useState({});
//     const [loading, setLoading] = useState(false);

//     // Fetch roles on component mount
//     useEffect(() => {
//         fetchRoles();
//     }, []);

//     const fetchRoles = async () => {
//         try {
//             const response = await getRequest("/roles"); // Replace with correct API endpoint
//             setRoles(response?.data?.roles || []);
//         } catch (error) {
//             console.error("Failed to fetch roles:", error);
//             showToast("Failed to fetch roles. Please try again.", "error");
//         }
//     };

//     // Initialize permissions structure from links
//     useEffect(() => {
//         const initialPermissions = links.reduce((acc, menu) => {
//             acc[menu.name] = {
//                 canView: false,
//                 subMenus: menu.subLinks.map((subMenu) => ({
//                     name: subMenu.name,
//                     canView: false,
//                     canEdit: false,
//                     canDelete: false,
//                     canAdd: false,
//                 })),
//             };
//             return acc;
//         }, {});
//         setPermissions(initialPermissions);
//     }, []);

//     // Handle role selection
//     const handleRoleChange = (event) => {
//         setSelectedRole(event.target.value);
//     };

//     // Handle menu-level checkbox change
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

//     // Handle submenu-level checkbox change
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
//             const data = { roleId: selectedRole, permissions: formattedPermissions }
//             console.log("permission Data :-", data)
//             await postRequest("/permissions", data);
//             showToast("Permissions assigned successfully!", "success");
//         } catch (error) {
//             console.error("Failed to assign permissions:", error);
//             showToast("Failed to assign permissions. Please try again.", "error");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <Box sx={{ pt: "80px", pb: "20px" }}>
//             <Breadcrumb />
//             <Typography variant="h4" sx={{ mb: 2 }}>
//                 Assign Permissions
//             </Typography>

//             {/* Role Selection */}
//             <FormControl fullWidth margin="normal">
//                 <InputLabel>Select Role</InputLabel>
//                 <Select value={selectedRole} onChange={handleRoleChange}>
//                     {roles.map((role) => (
//                         <MenuItem key={role._id} value={role._id}>
//                             {role.name}
//                         </MenuItem>
//                     ))}
//                 </Select>
//             </FormControl>

//             {/* Permissions Table */}
//             <Paper elevation={3} sx={{ p: 3, mt: 3, borderRadius: "12px" }}>
//                 <Typography variant="h6" sx={{ mb: 2 }}>
//                     Permissions
//                 </Typography>
//                 {links.map((menu) => (
//                     <Box key={menu.name} sx={{ mb: 3 }}>
//                         {/* Menu Level */}
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
//                         {/* Submenus */}
//                         <Grid container spacing={2} sx={{ ml: 3 }}>
//                             {menu.subLinks.map((subMenu) => (
//                                 <Grid item xs={12} md={6} key={subMenu.name}>
//                                     <Typography variant="body2" sx={{ mb: 1 }}>
//                                         {subMenu.name}
//                                     </Typography>
//                                     <FormControlLabel
//                                         control={
//                                             <Checkbox
//                                                 checked={
//                                                     permissions[menu.name]?.subMenus.find(
//                                                         (sub) => sub.name === subMenu.name
//                                                     )?.canView || false
//                                                 }
//                                                 onChange={(e) =>
//                                                     handleSubMenuChange(
//                                                         menu.name,
//                                                         subMenu.name,
//                                                         "canView",
//                                                         e.target.checked
//                                                     )
//                                                 }
//                                             />
//                                         }
//                                         label="View"
//                                     />
//                                     <FormControlLabel
//                                         control={
//                                             <Checkbox
//                                                 checked={
//                                                     permissions[menu.name]?.subMenus.find(
//                                                         (sub) => sub.name === subMenu.name
//                                                     )?.canEdit || false
//                                                 }
//                                                 onChange={(e) =>
//                                                     handleSubMenuChange(
//                                                         menu.name,
//                                                         subMenu.name,
//                                                         "canEdit",
//                                                         e.target.checked
//                                                     )
//                                                 }
//                                             />
//                                         }
//                                         label="Edit"
//                                     />
//                                     <FormControlLabel
//                                         control={
//                                             <Checkbox
//                                                 checked={
//                                                     permissions[menu.name]?.subMenus.find(
//                                                         (sub) => sub.name === subMenu.name
//                                                     )?.canDelete || false
//                                                 }
//                                                 onChange={(e) =>
//                                                     handleSubMenuChange(
//                                                         menu.name,
//                                                         subMenu.name,
//                                                         "canDelete",
//                                                         e.target.checked
//                                                     )
//                                                 }
//                                             />
//                                         }
//                                         label="Delete"
//                                     />
//                                     <FormControlLabel
//                                         control={
//                                             <Checkbox
//                                                 checked={
//                                                     permissions[menu.name]?.subMenus.find(
//                                                         (sub) => sub.name === subMenu.name
//                                                     )?.canAdd || false
//                                                 }
//                                                 onChange={(e) =>
//                                                     handleSubMenuChange(
//                                                         menu.name,
//                                                         subMenu.name,
//                                                         "canAdd",
//                                                         e.target.checked
//                                                     )
//                                                 }
//                                             />
//                                         }
//                                         label="Add"
//                                     />
//                                 </Grid>
//                             ))}
//                         </Grid>
//                     </Box>
//                 ))}
//             </Paper>

//             {/* Save Button */}
//             <Button
//                 variant="contained"
//                 color="primary"
//                 sx={{ mt: 3 }}
//                 onClick={handleSavePermissions}
//                 disabled={loading || !selectedRole}
//             >
//                 {loading ? "Saving..." : "Save Permissions"}
//             </Button>
//         </Box>
//     );
// };

// export default AddPermission;


// import React, { useState, useEffect } from "react";
// import {
//     Box,
//     Button,
//     Checkbox,
//     FormControlLabel,
//     Grid,
//     Paper,
//     Typography,
//     Select,
//     MenuItem,
//     FormControl,
//     InputLabel,
// } from "@mui/material";
// import { getRequest, postRequest } from "../../../api/commonAPI";
// import { links } from "../../../data/links";
// import Breadcrumb from "../../../components/common/Breadcrumb";
// import { showToast } from "../../../api/toast";

// const AddPermission = () => {
//     const [roles, setRoles] = useState([]);
//     const [selectedRole, setSelectedRole] = useState("");
//     const [permissions, setPermissions] = useState({});
//     const [loading, setLoading] = useState(false);

//     // Fetch roles on component mount
//     useEffect(() => {
//         fetchRoles();
//     }, []);

//     const fetchRoles = async () => {
//         try {
//             const response = await getRequest("/roles");
//             setRoles(response?.data?.roles || []);
//         } catch (error) {
//             console.error("Failed to fetch roles:", error);
//             showToast("Failed to fetch roles. Please try again.", "error");
//         }
//     };

//     // Initialize permissions structure from links
//     useEffect(() => {
//         const initialPermissions = links.reduce((acc, menu) => {
//             acc[menu.name] = {
//                 isChecked: false, // Main menu checkbox
//                 subMenus: menu.subLinks.map((subMenu) => ({
//                     name: subMenu.name,
//                     isChecked: false, // Submenu checkbox
//                     canView: false,
//                     canEdit: false,
//                     canDelete: false,
//                     canAdd: false,
//                 })),
//             };
//             return acc;
//         }, {});
//         setPermissions(initialPermissions);
//     }, []);

//     // Handle role selection
//     const handleRoleChange = (event) => {
//         setSelectedRole(event.target.value);
//     };

//     // Handle main menu checkbox change
//     const handleMenuChange = (menuName, checked) => {
//         setPermissions((prev) => ({
//             ...prev,
//             [menuName]: {
//                 ...prev[menuName],
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

//     // Handle submenu checkbox change
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

//     // Handle CRUD checkbox change
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
//             const formattedPermissions = Object.entries(permissions).map(
//                 ([menuName, menuPermissions]) => ({
//                     menuName,
//                     isChecked: menuPermissions.isChecked,
//                     subMenus: menuPermissions.subMenus.map((subMenu) => ({
//                         name: subMenu.name,
//                         isChecked: subMenu.isChecked,
//                         canView: subMenu.canView,
//                         canEdit: subMenu.canEdit,
//                         canDelete: subMenu.canDelete,
//                         canAdd: subMenu.canAdd,
//                     })),
//                 })
//             );
//             const data = { roleId: selectedRole, permissions: formattedPermissions };
//             console.log("Permission Data:", data);
//             await postRequest("/permissions", data);
//             showToast("Permissions assigned successfully!", "success");
//         } catch (error) {
//             console.error("Failed to assign permissions:", error);
//             showToast("Failed to assign permissions. Please try again.", "error");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <Box sx={{ pt: "80px", pb: "20px" }}>
//             <Breadcrumb />
//             <Typography variant="h4" sx={{ mb: 2 }}>
//                 Assign Permissions
//             </Typography>

//             {/* Role Selection */}
//             <FormControl fullWidth margin="normal">
//                 <InputLabel>Select Role</InputLabel>
//                 <Select value={selectedRole} onChange={handleRoleChange}>
//                     {roles.map((role) => (
//                         <MenuItem key={role._id} value={role._id}>
//                             {role.name}
//                         </MenuItem>
//                     ))}
//                 </Select>
//             </FormControl>

//             {/* Permissions Table */}
//             <Paper elevation={3} sx={{ p: 3, mt: 3, borderRadius: "12px" }}>
//                 <Typography variant="h6" sx={{ mb: 2 }}>
//                     Permissions
//                 </Typography>
//                 {links.map((menu) => (
//                     <Box key={menu.name} sx={{ mb: 3 }}>
//                         {/* Main Menu Level */}
//                         <FormControlLabel
//                             control={
//                                 <Checkbox
//                                     checked={permissions[menu.name]?.isChecked || false}
//                                     onChange={(e) => handleMenuChange(menu.name, e.target.checked)}
//                                 />
//                             }
//                             label={menu.name}
//                         />

//                         {/* Submenus */}
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

//                                     {/* CRUD Checkboxes */}
//                                     <Box sx={{ ml: 3 }}>
//                                         {["canView", "canEdit", "canDelete", "canAdd"].map(
//                                             (crudType) => (
//                                                 <FormControlLabel
//                                                     key={crudType}
//                                                     control={
//                                                         <Checkbox
//                                                             checked={
//                                                                 permissions[menu.name]?.subMenus.find(
//                                                                     (sub) => sub.name === subMenu.name
//                                                                 )?.[crudType] || false
//                                                             }
//                                                             onChange={(e) =>
//                                                                 handleCrudChange(
//                                                                     menu.name,
//                                                                     subMenu.name,
//                                                                     crudType,
//                                                                     e.target.checked
//                                                                 )
//                                                             }
//                                                         />
//                                                     }
//                                                     label={crudType.replace("can", "")} // Display "View", "Edit", etc.
//                                                 />
//                                             )
//                                         )}
//                                     </Box>
//                                 </Grid>
//                             ))}
//                         </Grid>
//                     </Box>
//                 ))}
//             </Paper>

//             {/* Save Button */}
//             <Button
//                 variant="contained"
//                 color="primary"
//                 sx={{ mt: 3 }}
//                 onClick={handleSavePermissions}
//                 disabled={loading || !selectedRole}
//             >
//                 {loading ? "Saving..." : "Save Permissions"}
//             </Button>
//         </Box>
//     );
// };

// export default AddPermission;


import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    Grid,
    Paper,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from "@mui/material";
import { getRequest, postRequest } from "../../../api/commonAPI";
import { links } from "../../../data/links";
import Breadcrumb from "../../../components/common/Breadcrumb";
import { showToast } from "../../../api/toast";

const AddPermission = () => {
    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState("");
    const [permissions, setPermissions] = useState({});
    const [loading, setLoading] = useState(false);

    // Fetch roles on component mount
    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        try {
            const response = await getRequest("/roles");
            setRoles(response?.data?.roles || []);
        } catch (error) {
            console.error("Failed to fetch roles:", error);
            showToast("Failed to fetch roles. Please try again.", "error");
        }
    };

    // Initialize permissions structure from links
    useEffect(() => {
        const initialPermissions = links.reduce((acc, menu) => {
            acc[menu.name] = {
                isChecked: false, // Main menu checkbox
                subMenus: menu.subLinks.map((subMenu) => ({
                    name: subMenu.name,
                    isChecked: false, // Submenu checkbox
                    canView: false,
                    canEdit: false,
                    canDelete: false,
                    canAdd: false,
                })),
            };
            return acc;
        }, {});
        setPermissions(initialPermissions);
    }, []);

    // Handle role selection
    const handleRoleChange = (event) => {
        setSelectedRole(event.target.value);
    };

    // Handle main menu checkbox change
    const handleMenuChange = (menuName, checked) => {
        setPermissions((prev) => ({
            ...prev,
            [menuName]: {
                ...prev[menuName],
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

    // Handle submenu checkbox change
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

    // Handle CRUD checkbox change
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
            const formattedPermissions = Object.entries(permissions).map(
                ([menuName, menuPermissions]) => ({
                    menuName,
                    isChecked: menuPermissions.isChecked,
                    subMenus: menuPermissions.subMenus.map((subMenu) => ({
                        name: subMenu.name,
                        isChecked: subMenu.isChecked,
                        canView: subMenu.canView,
                        canEdit: subMenu.canEdit,
                        canDelete: subMenu.canDelete,
                        canAdd: subMenu.canAdd,
                    })),
                })
            );
            const data = { roleId: selectedRole, permissions: formattedPermissions };
            console.log("Permission Data:", data);
            await postRequest("/permissions", data);
            showToast("Permissions assigned successfully!", "success");
        } catch (error) {
            console.error("Failed to assign permissions:", error);
            showToast("Failed to assign permissions. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ pt: "80px", pb: "20px" }}>
            <Breadcrumb />
            <Typography variant="h4" sx={{ mb: 2 }}>
                Assign Permissions
            </Typography>

            {/* Role Selection */}
            <FormControl fullWidth margin="normal">
                <InputLabel>Select Role</InputLabel>
                <Select value={selectedRole} onChange={handleRoleChange}>
                    {roles.map((role) => (
                        <MenuItem key={role._id} value={role._id}>
                            {role.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Permissions Table */}
            <Paper elevation={3} sx={{ p: 3, mt: 3, borderRadius: "12px" }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Permissions
                </Typography>
                {links.map((menu) => (
                    <Box key={menu.name} sx={{ mb: 3 }}>
                        {/* Main Menu Level */}
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={permissions[menu.name]?.isChecked || false}
                                    onChange={(e) => handleMenuChange(menu.name, e.target.checked)}
                                />
                            }
                            label={menu.name}
                        />

                        {/* Submenus */}
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
                                                disabled={!permissions[menu.name]?.isChecked} // Disable if main link is not checked
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

                                    {/* CRUD Checkboxes */}
                                    <Box sx={{ ml: 3 }}>
                                        {["canView", "canEdit", "canDelete", "canAdd"].map(
                                            (crudType) => (
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
                                                                !permissions[menu.name]?.isChecked || // Disable if main link is not checked
                                                                !permissions[menu.name]?.subMenus.find(
                                                                    (sub) => sub.name === subMenu.name
                                                                )?.isChecked // Disable if sub-link is not checked
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
                                                    label={crudType.replace("can", "")} // Display "View", "Edit", etc.
                                                />
                                            )
                                        )}
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                ))}
            </Paper>

            {/* Save Button */}
            <Button
                variant="contained"
                color="primary"
                sx={{ mt: 3 }}
                onClick={handleSavePermissions}
                disabled={loading || !selectedRole}
            >
                {loading ? "Saving..." : "Save Permissions"}
            </Button>
        </Box>
    );
};

export default AddPermission;
