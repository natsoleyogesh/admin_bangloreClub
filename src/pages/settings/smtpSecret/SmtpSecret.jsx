// import React, { useEffect, useState } from "react";
// import {
//     Box,
//     Button,
//     CircularProgress,
//     TextField,
//     Typography,
//     Paper,
//     FormControl,
//     InputLabel,
//     Select,
//     MenuItem,
//     IconButton,
//     InputAdornment,
// } from "@mui/material";
// import { Visibility, VisibilityOff } from "@mui/icons-material";

// import { getRequest, postRequest } from "../../../api/commonAPI";
// import { showToast } from "../../../api/toast";

// const SmtpSecret = () => {
//     const [smtpDetails, setSmtpDetails] = useState({
//         host: "",
//         port: "",
//         username: "",
//         password: "",
//         encryption: "TLS",
//         smtpFrom: ""
//     });
//     const [loading, setLoading] = useState(false);
//     const [isUpdating, setIsUpdating] = useState(false);
//     const [showPassword, setShowPassword] = useState(false);

//     const encryptionOptions = ["none", "SSL", "TLS"];

//     // Fetch existing SMTP configuration
//     useEffect(() => {

//         fetchSmtpConfig();
//     }, []);

//     const fetchSmtpConfig = async () => {
//         try {
//             setLoading(true);
//             // const response = await axios.get("/api/smtp/config"); // API endpoint to fetch SMTP details
//             const response = await getRequest(`/smtp/config`);
//             if (response.status === 200 && response.data.smtp) {
//                 setSmtpDetails(response.data.smtp);
//                 setIsUpdating(true);
//             }
//             setLoading(false);
//         } catch (error) {
//             setLoading(false);
//             // showToast(error.response?.data?.message || "Failed to fetch SMTP details.", "error");
//         }
//     };


//     // Handle input changes
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setSmtpDetails((prev) => ({ ...prev, [name]: value }));
//     };

//     // Toggle password visibility
//     const togglePasswordVisibility = () => {
//         setShowPassword((prev) => !prev);
//     };

//     // Submit SMTP configuration
//     const handleSubmit = async () => {
//         try {
//             setLoading(true);

//             const response = await postRequest(`/smtp/configure`, smtpDetails);



//             if (response.status === 201 || response.status === 200) {
//                 showToast(
//                     `SMTP configuration ${isUpdating ? "updated" : "added"} successfully!`,
//                     "success"
//                 );
//                 fetchSmtpConfig();
//                 setLoading(false);

//             } else {
//                 showToast(response.message || "Failed to add designation. Please try again.", "error");
//                 setLoading(false);

//             }
//         } catch (error) {
//             setLoading(false);
//             showToast(error.response?.data?.message || "Failed to save SMTP configuration.", "error");
//         }
//     };

//     return (
//         <Box sx={{ pt: "80px", px: 4, pb: 4 }}>
//             <Typography variant="h4" sx={{ mb: 4, textAlign: "center" }}>
//                 {isUpdating ? "Update SMTP Configuration" : "Add SMTP Configuration"}
//             </Typography>
//             <Paper elevation={3} sx={{ p: 4, maxWidth: "600px", margin: "0 auto" }}>
//                 {loading ? (
//                     <Box sx={{ textAlign: "center" }}>
//                         <CircularProgress />
//                     </Box>
//                 ) : (
//                     <>
//                         <TextField
//                             label="SMTP Host"
//                             name="host"
//                             fullWidth
//                             value={smtpDetails.host}
//                             onChange={handleInputChange}
//                             margin="normal"
//                             required
//                         />
//                         <TextField
//                             label="SMTP Port"
//                             name="port"
//                             type="number"
//                             fullWidth
//                             value={smtpDetails.port}
//                             onChange={handleInputChange}
//                             margin="normal"
//                             required
//                         />
//                         <TextField
//                             label="SMTP Username"
//                             name="username"
//                             fullWidth
//                             value={smtpDetails.username}
//                             onChange={handleInputChange}
//                             margin="normal"
//                             required
//                         />
//                         <TextField
//                             label="SMTP Password"
//                             name="password"
//                             type={showPassword ? "text" : "password"}
//                             fullWidth
//                             value={smtpDetails.password}
//                             onChange={handleInputChange}
//                             margin="normal"
//                             required
//                             InputProps={{
//                                 endAdornment: (
//                                     <InputAdornment position="end">
//                                         <IconButton onClick={togglePasswordVisibility} edge="end">
//                                             {showPassword ? <Visibility /> : <VisibilityOff />}
//                                         </IconButton>
//                                     </InputAdornment>
//                                 ),
//                             }}
//                         />
//                         <FormControl fullWidth margin="normal">
//                             <InputLabel>Encryption</InputLabel>
//                             <Select
//                                 name="encryption"
//                                 value={smtpDetails.encryption}
//                                 onChange={handleInputChange}
//                             >
//                                 {encryptionOptions.map((option) => (
//                                     <MenuItem key={option} value={option}>
//                                         {option}
//                                     </MenuItem>
//                                 ))}
//                             </Select>
//                         </FormControl>
//                         <TextField
//                             label="SMTP FROM"
//                             name="smtpFrom"
//                             fullWidth
//                             value={smtpDetails.smtpFrom}
//                             onChange={handleInputChange}
//                             margin="normal"
//                             required
//                         />

//                         <Button
//                             variant="contained"
//                             color="primary"
//                             fullWidth
//                             onClick={handleSubmit}
//                             disabled={loading}
//                             sx={{ mt: 3 }}
//                         >
//                             {isUpdating ? "Update Configuration" : "Add Configuration"}
//                         </Button>
//                     </>
//                 )}
//             </Paper>
//         </Box>
//     );
// };

// export default SmtpSecret;


import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    CircularProgress,
    TextField,
    Typography,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    InputAdornment,
    Grid,
    Tooltip,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { getRequest, postRequest } from "../../../api/commonAPI";
import { showToast } from "../../../api/toast";

const SmtpSecret = () => {
    const [smtpDetails, setSmtpDetails] = useState({
        host: "",
        port: "",
        username: "",
        password: "",
        encryption: "TLS",
        smtpFrom: ""
    });
    const [loading, setLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const encryptionOptions = ["none", "SSL", "TLS"];

    useEffect(() => {
        fetchSmtpConfig();
    }, []);

    const fetchSmtpConfig = async () => {
        try {
            setLoading(true);
            const response = await getRequest(`/smtp/config`);
            if (response.status === 200 && response.data.smtp) {
                setSmtpDetails(response.data.smtp);
                setIsUpdating(true);
            }
        } catch (error) {
            showToast(error.response?.data?.message || "Failed to fetch SMTP details.", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSmtpDetails((prev) => ({ ...prev, [name]: value }));
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const response = await postRequest(`/smtp/configure`, smtpDetails);
            if (response.status === 201 || response.status === 200) {
                showToast(
                    `SMTP configuration ${isUpdating ? "updated" : "added"} successfully!`,
                    "success"
                );
                fetchSmtpConfig();
            } else {
                showToast(response.message || "Failed to save configuration. Please try again.", "error");
            }
        } catch (error) {
            showToast(error.response?.data?.message || "Failed to save SMTP configuration.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ pt: "80px", px: 4, pb: 4, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
            <Typography variant="h4" sx={{ mb: 4, textAlign: "center", fontWeight: "bold", color: "#1976d2" }}>
                {isUpdating ? "Update SMTP Configuration" : "Add SMTP Configuration"}
            </Typography>

            <Paper elevation={3} sx={{ p: 4, maxWidth: "600px", margin: "0 auto", borderRadius: "16px" }}>
                {loading ? (
                    <Box sx={{ textAlign: "center" }}>
                        <CircularProgress color="primary" />
                    </Box>
                ) : (
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <InputLabel>SMTP Host</InputLabel>
                            <TextField
                                // label="SMTP Host"
                                name="host"
                                fullWidth
                                value={smtpDetails.host}
                                onChange={handleInputChange}
                                margin="normal"
                                required
                                helperText="Enter the SMTP server address (e.g., smtp.gmail.com)"
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <InputLabel>SMTP Port</InputLabel>
                            <TextField
                                // label="SMTP Port"
                                name="port"
                                type="number"
                                fullWidth
                                value={smtpDetails.port}
                                onChange={handleInputChange}
                                margin="normal"
                                required
                                helperText="Typically 587 for TLS or 465 for SSL"
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <InputLabel>Encryption</InputLabel>
                            <FormControl fullWidth margin="normal">
                                <Select
                                    name="encryption"
                                    value={smtpDetails.encryption}
                                    onChange={handleInputChange}
                                >
                                    {encryptionOptions.map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <InputLabel>SMTP Username</InputLabel>
                            <TextField
                                // label="SMTP Username"
                                name="username"
                                fullWidth
                                value={smtpDetails.username}
                                onChange={handleInputChange}
                                margin="normal"
                                required
                                helperText="Enter the email address used for authentication"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <InputLabel>SMTP Password</InputLabel>
                            <TextField
                                // label="SMTP Password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                fullWidth
                                value={smtpDetails.password}
                                onChange={handleInputChange}
                                margin="normal"
                                required
                                helperText="Enter the password for SMTP authentication"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Tooltip title={showPassword ? "Hide Password" : "Show Password"}>
                                                <IconButton onClick={togglePasswordVisibility} edge="end">
                                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </Tooltip>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <InputLabel>SMTP FROM</InputLabel>
                            <TextField
                                // label="SMTP FROM"
                                name="smtpFrom"
                                fullWidth
                                value={smtpDetails.smtpFrom}
                                onChange={handleInputChange}
                                margin="normal"
                                required
                                helperText="Enter the default sender email address"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                onClick={handleSubmit}
                                disabled={loading}
                                sx={{ mt: 2, py: 1.5, fontSize: "16px" }}
                            >
                                {isUpdating ? "Update Configuration" : "Add Configuration"}
                            </Button>
                        </Grid>
                    </Grid>
                )}
            </Paper>
        </Box>
    );
};

export default SmtpSecret;