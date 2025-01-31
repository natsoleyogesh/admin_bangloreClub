import React, { useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { FiPlus } from "react-icons/fi";
import axios from "axios";
import { showToast } from "../../../api/toast";
import { postFormDataRequest, postRequest } from "../../../api/commonAPI";
import { useNavigate } from "react-router-dom";
import Customers from "../../Customers";


const UploadData = () => {
    const [openFileDialog, setOpenFileDialog] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [buttonType, setButtonType] = useState(""); // Track which button was clicked
    const navigate = useNavigate();

    const [uploadData, setUploadData] = useState(true)

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleButtonClick = (type) => {
        setButtonType(type);
        setOpenFileDialog(true)
        document.getElementById("file-input").click(); // Open file input dialog
    };

    const handleUploadFile = async () => {
        if (!selectedFile) {
            showToast("Please select a file first.", "error");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            let apiUrl = "";
            if (buttonType === "MemberData") {
                apiUrl = "/upload-members"; // Replace with your MemberData upload API endpoint
            } else if (buttonType === "MemberAddress") {
                apiUrl = "/upload-members-address"; // Replace with your MemberAddress upload API endpoint
            }
            console.log(apiUrl, "url")
            // Call the corresponding API
            // const response = await axios.post(`${PUBLIC}${apiUrl}`, formData, {
            const response = await postFormDataRequest(apiUrl, formData)
            //     headers: {
            //         "Content-Type": "multipart/form-data",
            //     },
            // });
            if (response.status === 200) {
                navigate("/members")
            }

            showToast(response.data.message, "success");
            setSelectedFile(null); // Reset file input after upload
        } catch (error) {
            console.error("Failed to upload file:", error);
            showToast(error.message || "Failed to upload file.", "error");
        } finally {
            setOpenFileDialog(false);
        }
    };

    return (
        <Box sx={{ pt: "80px", pb: "20px" }}>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                }}
            >
                <Typography variant="h6">Upload Data</Typography>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                }}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<FiPlus />}
                    onClick={() => handleButtonClick("MemberData")}
                    sx={{ marginBottom: 2 }}
                >
                    Upload Member Data
                </Button>

                {/* <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<FiPlus />}
                    onClick={() => handleButtonClick("MemberAddress")}
                >
                    Upload Member Address
                </Button> */}

                {/* Hidden file input */}
                {/* <input
                    id="file-input"
                    type="file"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                    accept=".xlsx, .xls"
                /> */}
            </Box>
            <Customers uploadData={uploadData} />
            {/* Dialog for File Upload */}
            <Dialog open={openFileDialog} onClose={() => setOpenFileDialog(false)}>
                <DialogTitle>Upload File</DialogTitle>
                <DialogContent>
                    <input
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={handleFileChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenFileDialog(false)}>Cancel</Button>
                    <Button onClick={handleUploadFile} variant="contained" color="primary">
                        Upload
                    </Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
};

export default UploadData;
