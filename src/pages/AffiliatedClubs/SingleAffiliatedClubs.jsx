import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, CircularProgress } from "@mui/material";
import { getRequest, putRequest } from "../../api/commonAPI";
import { showToast } from "../../api/toast";
import dayjs from "dayjs";
import Breadcrumb from "../../components/common/Breadcrumb";

const SingleAffiliatedClub = () => {
    const { id } = useParams(); // Retrieve the club ID from the URL
    const navigate = useNavigate();

    const [clubDetails, setClubDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [buttonDisable, setButtonDisable] = useState(true);

    // Fetch club details by ID
    const fetchClubDetails = async () => {
        setLoading(true);
        try {
            const response = await getRequest(`/affiliated-club/${id}`);
            setClubDetails({
                ...response.data.club,
                affiliateDate: response.data.club.affiliateDate ? dayjs(response.data.club.affiliateDate).format("YYYY-MM-DD") : "",
                deaffiliateDate: response.data.club.deaffiliateDate ? dayjs(response.data.club.deaffiliateDate).format("YYYY-MM-DDTHH:mm") : "",

            });
        } catch (error) {
            console.error("Failed to fetch club details:", error);
            showToast("Failed to load club details.", "error");
        } finally {
            setLoading(false);
        }
    };

    // Handle input changes
    const handleInputChange = (field, value) => {
        setClubDetails((prevDetails) => ({
            ...prevDetails,
            [field]: value,
        }));
        setButtonDisable(false)
    };

    // Save updated club details
    const handleSaveChanges = async () => {
        setSaving(true);
        try {

            const updatedDetails = {
                ...clubDetails,
                affiliateDate: clubDetails.affiliateDate ? new Date(clubDetails.affiliateDate).toISOString() : null,
                deaffiliateDate: clubDetails.deaffiliateDate ? new Date(clubDetails.deaffiliateDate).toISOString() : null,
            };
            await putRequest(`/update-affiliated-club/${id}`, updatedDetails);
            showToast("Club details updated successfully.", "success");
            fetchClubDetails();
            setButtonDisable(true)
            // navigate("/affiliated-clubs"); // Redirect back to clubs list
        } catch (error) {
            console.error("Failed to update club details:", error);
            showToast("Failed to update club details.", "error");
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        fetchClubDetails();
    }, []);

    const cancleButtonClick = () => {
        fetchClubDetails()
        setButtonDisable(true)
    }

    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (!clubDetails) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                <Typography variant="h6">Club not found.</Typography>
            </Box>
        );
    }


    return (
        <Box sx={{ pt: "80px", pb: "20px", px: "20px" }}>
            <Breadcrumb />
            <Typography variant="h6" mb={2}>
                Edit Affiliated Club
            </Typography>

            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2 }}>
                <TextField
                    label="Affiliate Club No"
                    value={clubDetails.affiliateClubNo || ""}
                    onChange={(e) => handleInputChange("affiliateClubNo", e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Club Name"
                    value={clubDetails.name || ""}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Email"
                    value={clubDetails.email || ""}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Fax Number"
                    value={clubDetails.faxNumber || ""}
                    onChange={(e) => handleInputChange("faxNumber", e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Phone Number 1"
                    value={clubDetails.phoneNumber1 || ""}
                    onChange={(e) => handleInputChange("phoneNumber1", e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Phone Number 2"
                    value={clubDetails.phoneNumber2 || ""}
                    onChange={(e) => handleInputChange("phoneNumber2", e.target.value)}
                    fullWidth
                />
                <TextField
                    label="City"
                    value={clubDetails.cityOther || ""}
                    onChange={(e) => handleInputChange("cityOther", e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Address 1"
                    value={clubDetails.addr1 || ""}
                    onChange={(e) => handleInputChange("addr1", e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Address 2"
                    value={clubDetails.addr2 || ""}
                    onChange={(e) => handleInputChange("addr2", e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Address 3"
                    value={clubDetails.addr3 || ""}
                    onChange={(e) => handleInputChange("addr3", e.target.value)}
                    fullWidth
                />
                <TextField
                    label="City Description"
                    value={clubDetails.cityDescription || ""}
                    onChange={(e) => handleInputChange("cityDescription", e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Pin"
                    value={clubDetails.pin || ""}
                    onChange={(e) => handleInputChange("pin", e.target.value)}
                    fullWidth
                />
                <TextField
                    label="State Description"
                    value={clubDetails.stateDescription || ""}
                    onChange={(e) => handleInputChange("stateDescription", e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Country Description"
                    value={clubDetails.countryDescription || ""}
                    onChange={(e) => handleInputChange("countryDescription", e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Affiliate Date"
                    type="date" // Enables the date picker
                    value={clubDetails.affiliateDate || ""}
                    onChange={(e) => handleInputChange("affiliateDate", e.target.value)}
                    InputLabelProps={{ shrink: true }} // Ensures the label stays above the input when a value is present
                    fullWidth
                />
                <TextField
                    label="Deaffiliate Date"
                    type="datetime-local" // Enables the datetime picker
                    value={clubDetails.deaffiliateDate || ""}
                    onChange={(e) => handleInputChange("deaffiliateDate", e.target.value)}
                    InputLabelProps={{ shrink: true }} // Ensures the label stays above the input when a value is present
                    fullWidth
                />
            </Box>

            <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
                {buttonDisable ? (
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => navigate("/affiliated-clubs")}
                    >
                        Back
                    </Button>
                ) : (
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={cancleButtonClick}
                    >
                        Cancel
                    </Button>
                )}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSaveChanges}
                    disabled={buttonDisable}
                >
                    {saving ? "Saving..." : "Save Changes"}
                </Button>
            </Box>

        </Box>
    );
};

export default SingleAffiliatedClub;
