import styled from "@emotion/styled";
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
    CircularProgress,
    Alert,
    Avatar,
} from "@mui/material";
import React, { useRef, useState } from "react";
import { BiImageAdd } from "react-icons/bi";
import { addMember } from "../api/member";
import { useNavigate } from "react-router-dom";
import { showToast } from "../api/toast";
import { CrisisAlert, Email, FamilyRestroom, LocationCity, People, Phone } from "@mui/icons-material";
import LocationSelector from "../components/common/LocationSelector";
import Breadcrumb from "../components/common/Breadcrumb";

const UploadBox = styled(Box)(({ theme }) => ({
    marginTop: 20,
    height: 160,
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    border: `2px dashed ${theme.palette.divider}`,
    cursor: "pointer",
    backgroundColor: theme.palette.background.paper,
    transition: "0.3s",
    "&:hover": {
        backgroundColor: theme.palette.action.hover,
    },
}));

const StyledButton = styled(Button)({
    borderRadius: 10,
    padding: "12px",
    fontWeight: 600,
    textTransform: "none",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
});

const AddMember = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [relation, setRelation] = useState("Primary");
    const [address, setAddress] = useState("");
    const [address1, setAddress1] = useState("");
    const [address2, setAddress2] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [country, setCountry] = useState("");
    const [pin, setPin] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [maritalStatus, setMaritalStatus] = useState("Single");
    const [marriageDate, setMarriageDate] = useState("");
    const [title, setTitle] = useState("Mr.");
    const [image, setImage] = useState(null);
    // const [age, setAge] = useState("");
    const [parentUserId, setParentUserId] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [validationErrors, setValidationErrors] = useState({});
    const imageInput = useRef(null);
    const navigate = useNavigate();
    const [location, setLocation] = useState({ country: "India", state: null, city: null }); // Location state

    // Validation functions
    const validateName = (name) => name.trim() !== "";
    const validateEmail = (email) =>
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email);
    const validateMobileNumber = (mobile) => /^[0-9]{10}$/.test(mobile);
    // const validateAge = (age) => age && age > 0 && age <= 120;
    const validateAddress = (address) => address.trim() !== "";
    const validateRelation = (relation) => relation.trim() !== "";
    // Validation functions
    const validatePin = (pin) => /^[0-9]{5,10}$/.test(pin);
    // Real-time validation handlers
    const handleNameChange = (e) => {
        const value = e.target.value;
        setName(value);
        setValidationErrors((prev) => ({
            ...prev,
            name: validateName(value) ? "" : "Name is required.",
        }));
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        setValidationErrors((prev) => ({
            ...prev,
            email: validateEmail(value) ? "" : "Invalid email address.",
        }));
    };

    const handleMobileChange = (e) => {
        const value = e.target.value;
        setMobileNumber(value);
        setValidationErrors((prev) => ({
            ...prev,
            mobileNumber: validateMobileNumber(value)
                ? ""
                : "Mobile number must be 10 digits.",
        }));
    };

    // const handleAgeChange = (e) => {
    //     const value = e.target.value;
    //     setAge(value);
    //     setValidationErrors((prev) => ({
    //         ...prev,
    //         age: validateAge(value) ? "" : "Age must be between 1 and 120.",
    //     }));
    // };
    const handlePinChange = (e) => {
        const value = e.target.value;
        setPin(value);
        setValidationErrors((prev) => ({
            ...prev,
            pin: validatePin(value) ? "" : "Pin Must Be 6 to 10 digit",
        }));
    };

    const handleAddressChange = (e) => {
        const value = e.target.value;
        setAddress(value);
        setValidationErrors((prev) => ({
            ...prev,
            address: validateAddress(value) ? "" : "Address is required.",
        }));
    };

    const handleRelationChange = (e) => {
        const value = e.target.value;
        setRelation(value);
        setValidationErrors((prev) => ({
            ...prev,
            relation: validateRelation(value) ? "" : "Relation is required.",
        }));
    };

    // Form-level validation
    const validateForm = () => {
        const errors = {};

        if (!validateName(name)) errors.name = "Name is required.";
        if (!validateEmail(email)) errors.email = "Invalid email address.";
        if (!validateMobileNumber(mobileNumber))
            errors.mobileNumber = "Mobile number must be 10 digits.";
        // if (!validateAge(age)) errors.age = "Age must be between 1 and 120.";
        if (!validateAddress(address)) errors.address = "Address is required.";
        if (!validateRelation(relation)) errors.relation = "Relation is required.";
        if (!validatePin(pin)) errors.pin = "Invalid PIN code.";

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleLocationChange = (updatedLocation) => {
        setLocation(updatedLocation);
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");

        // Validate form before submission
        if (!validateForm()) {
            setLoading(false);
            showToast("Please fix the validation errors.", "error");
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("mobileNumber", mobileNumber);
        formData.append("address", address);
        formData.append("address1", address1);
        formData.append("address2", address2);
        formData.append("city", city);
        formData.append("state", state);
        formData.append("country", country);
        formData.append("pin", pin);
        formData.append("dateOfBirth", dateOfBirth);
        formData.append("maritalStatus", maritalStatus);
        formData.append("marriageDate", marriageDate);
        formData.append("title", title);
        formData.append("relation", relation);
        // formData.append("age", age);
        formData.append("parentUserId", parentUserId);
        if (image) {
            formData.append("profilePicture", image);
        }

        try {
            const response = await addMember(formData);
            if (response.status === 201) {
                showToast("Member added successfully!", "success");
                navigate("/customers");
            } else {
                showToast(response.message || "Failed to add member. Please try again.", "error");
            }
        } catch (error) {
            showToast("An error occurred. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (event) => {
        setImage(event.target.files[0]);
    };

    return (
        <Box sx={{ pt: "70px", pb: "20px", px: "10px" }}>
            <Breadcrumb />
            <Typography variant="h5" sx={{ textAlign: "center", fontWeight: 600 }}>
                Add Member
            </Typography>
            <Box sx={{ pb: 5, display: "flex", justifyContent: "center" }}>
                <Card sx={{ maxWidth: 500, width: "100%", borderRadius: "16px", boxShadow: 4, marginTop: "10px" }}>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                {/* Existing fields */}
                                <Grid item xs={12}>
                                    <InputLabel sx={{ fontWeight: "bold" }}>Title</InputLabel>
                                    <Select
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        fullWidth
                                        size="small"
                                    >
                                        <MenuItem value="Mr.">Mr.</MenuItem>
                                        <MenuItem value="Mrs.">Mrs.</MenuItem>
                                        <MenuItem value="Ms.">Ms.</MenuItem>
                                        <MenuItem value="Dr.">Dr.</MenuItem>
                                    </Select>
                                </Grid>
                                <Grid item xs={12}>
                                    <InputLabel sx={{ fontWeight: "bold" }} >Member Name</InputLabel>
                                    <TextField
                                        placeholder="Enter full name"
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        value={name}
                                        onChange={handleNameChange}
                                        error={!!validationErrors.name}
                                        helperText={validationErrors.name}

                                        // required
                                        sx={{ marginTop: "4px" }}
                                        InputProps={{ startAdornment: <People sx={{ color: "gray", mr: 1 }} /> }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <InputLabel sx={{ fontWeight: "bold" }}>Email Address</InputLabel>
                                    <TextField
                                        placeholder="Enter email address"
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        value={email}
                                        onChange={handleEmailChange}
                                        error={!!validationErrors.email}
                                        helperText={validationErrors.email}
                                        // required
                                        sx={{ marginTop: "4px" }}
                                        InputProps={{ startAdornment: <Email sx={{ color: "gray", mr: 1 }} /> }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <InputLabel sx={{ fontWeight: "bold" }}>Phone Number</InputLabel>
                                    <TextField
                                        placeholder="Enter phone number"
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        value={mobileNumber}
                                        onChange={handleMobileChange}
                                        error={!!validationErrors.mobileNumber}
                                        helperText={validationErrors.mobileNumber}
                                        // required
                                        sx={{ marginTop: "4px" }}
                                        InputProps={{ startAdornment: <Phone sx={{ color: "gray", mr: 1 }} /> }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <InputLabel sx={{ fontWeight: "bold" }}>Address</InputLabel>
                                    <TextField
                                        placeholder="Enter address"
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        value={address}
                                        onChange={handleAddressChange}
                                        sx={{ marginTop: "4px" }}
                                        error={!!validationErrors.address}
                                        helperText={validationErrors.address}
                                        InputProps={{ startAdornment: <LocationCity sx={{ color: "gray", mr: 1 }} /> }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <InputLabel sx={{ fontWeight: "bold" }}>Address Line 1</InputLabel>
                                    <TextField
                                        placeholder="Enter Your Adrress Line 1"
                                        size="small"
                                        variant="outlined"
                                        value={address1}
                                        onChange={(e) => setAddress1(e.target.value)}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <InputLabel sx={{ fontWeight: "bold" }}>Address Line 2</InputLabel>
                                    <TextField
                                        placeholder="Enter Your Address Line 2"
                                        size="small"
                                        variant="outlined"
                                        value={address2}
                                        onChange={(e) => setAddress2(e.target.value)}
                                        fullWidth
                                    />
                                </Grid>
                                {/* <Grid item xs={6}>
                                    <InputLabel sx={{ fontWeight: "bold" }}>City</InputLabel>
                                    <TextField
                                        placeholder="Enter Your City"
                                        size="small"
                                        variant="outlined"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <InputLabel sx={{ fontWeight: "bold" }}>State</InputLabel>
                                    <TextField
                                        placeholder="Enter Your State"
                                        size="small"
                                        variant="outlined"
                                        value={state}
                                        onChange={(e) => setState(e.target.value)}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <InputLabel sx={{ fontWeight: "bold" }}>Country</InputLabel>
                                    <TextField
                                        placeholder="Enter Your Country"
                                        size="small"
                                        variant="outlined"
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                        fullWidth
                                    />
                                </Grid> */}
                                <Grid item xs={12}>
                                    <InputLabel sx={{ fontWeight: "bold" }}>Location</InputLabel>
                                    <LocationSelector
                                        onLocationChange={handleLocationChange}
                                        defaultLocation={{
                                            country: "India", // Default country
                                            state: location.state, // Retain state if editing
                                            city: location.city, // Retain city if editing
                                        }}
                                    />
                                </Grid>


                                <Grid item xs={6}>
                                    <InputLabel sx={{ fontWeight: "bold" }}>PIN</InputLabel>
                                    <TextField
                                        placeholder="Enter Your Area Pin"
                                        size="small"
                                        variant="outlined"
                                        value={pin}
                                        onChange={handlePinChange}
                                        fullWidth
                                        error={!!validationErrors.pin}
                                        helperText={validationErrors.pin}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <InputLabel sx={{ fontWeight: "bold" }}>Date of Birth</InputLabel>
                                    <TextField
                                        placeholder="Enter Your DOB"
                                        size="small"
                                        variant="outlined"
                                        type="date"
                                        value={dateOfBirth}
                                        onChange={(e) => setDateOfBirth(e.target.value)}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <InputLabel sx={{ fontWeight: "bold" }}>Marital Status</InputLabel>
                                    <Select
                                        value={maritalStatus}
                                        onChange={(e) => setMaritalStatus(e.target.value)}
                                        fullWidth
                                        size="small"
                                    >
                                        <MenuItem value="Single">Single</MenuItem>
                                        <MenuItem value="Married">Married</MenuItem>
                                        <MenuItem value="Divorced">Divorced</MenuItem>
                                        <MenuItem value="Widowed">Widowed</MenuItem>
                                    </Select>
                                </Grid>
                                <Grid item xs={6}>
                                    <InputLabel sx={{ fontWeight: "bold" }}>Marriage Date</InputLabel>
                                    <TextField
                                        placeholder="Enter Your Marrige Date"
                                        size="small"
                                        variant="outlined"
                                        type="date"
                                        value={marriageDate}
                                        onChange={(e) => setMarriageDate(e.target.value)}
                                        fullWidth
                                    />
                                </Grid>
                                {/* <Grid item xs={6}>
                                    <InputLabel sx={{ fontWeight: "bold" }}>Age</InputLabel>
                                    <TextField
                                        placeholder="Enter age"
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        type="number"
                                        value={age}
                                        onChange={handleAgeChange}
                                        error={!!validationErrors.age}
                                        helperText={validationErrors.age}
                                        sx={{ marginTop: "4px" }}
                                        InputProps={{ startAdornment: <CrisisAlert sx={{ color: "gray", mr: 1 }} /> }}
                                    />
                                </Grid> */}
                                <Grid item xs={6}>
                                    <InputLabel sx={{ fontWeight: "bold" }}>Relation</InputLabel>
                                    <FormControl fullWidth size="small" sx={{ marginTop: "4px" }}>
                                        <Select
                                            value={relation}
                                            onChange={(e) => setRelation(e.target.value)}
                                            startAdornment={<FamilyRestroom sx={{ color: "gray", mr: 1 }} />}
                                        >
                                            <MenuItem value="Primary">Primary</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Profile Image</InputLabel>
                                    <UploadBox onClick={() => imageInput.current.click()}>
                                        {image ? (
                                            <Avatar
                                                src={URL.createObjectURL(image)}
                                                alt="Profile"
                                                sx={{ width: 100, height: 100 }}
                                            />
                                        ) : (
                                            <Box sx={{ textAlign: "center" }}>
                                                <BiImageAdd style={{ fontSize: "40px", color: "#027edd" }} />
                                                <Typography variant="body2" color="textSecondary">
                                                    Click to upload profile image
                                                </Typography>
                                                <Typography variant="caption" color="textSecondary">
                                                    (JPG, PNG, GIF)
                                                </Typography>
                                            </Box>
                                        )}
                                    </UploadBox>
                                    <input
                                        type="file"
                                        hidden
                                        ref={imageInput}
                                        onChange={handleImageChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <StyledButton
                                        type="submit"
                                        variant="contained"
                                        fullWidth
                                        color="primary"
                                        disabled={loading}
                                    >
                                        {loading ? <CircularProgress size={20} color="inherit" /> : "Add Member"}
                                    </StyledButton>
                                </Grid>
                            </Grid>
                        </form>
                    </CardContent>
                </Card>
            </Box>
        </Box>

    );
};

export default AddMember;