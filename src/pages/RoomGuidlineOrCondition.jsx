import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    CircularProgress,
    Typography,
    Paper,
    InputLabel,
} from "@mui/material";
import ReactQuill from "react-quill";
import { showToast } from "../api/toast";
import { getRequest, postRequest } from "../api/commonAPI";

const RoomGuidelineOrCondition = () => {
    const [roomData, setRoomData] = useState({
        guidlineDescription: "",
        roomConditionDescription: "",
    });
    const [loading, setLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        fetchRoomGuidelineConfig();
    }, []);

    const fetchRoomGuidelineConfig = async () => {
        try {
            setLoading(true);
            const response = await getRequest("/room-guidlineOrCondition");

            if (response.status === 200 && response.data.data) {
                setRoomData(response.data.data);
                setIsUpdating(true);
            }
        } catch (error) {
            showToast(error.response?.data?.message || "Failed to fetch room guidelines.", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const response = await postRequest("/room-guidline", roomData);

            if (response.status === 200 || response.status === 201) {
                showToast(`Guideline configuration ${isUpdating ? "updated" : "added"} successfully!`, "success");
                fetchRoomGuidelineConfig();
            } else {
                showToast(response.message || "Failed to save configuration. Please try again.", "error");
            }
        } catch (error) {
            showToast(error.response?.data?.message || "Failed to save room configuration.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ pt: "80px", px: 4, pb: 4, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
            <Typography variant="h4" sx={{ mb: 4, textAlign: "center", fontWeight: "bold", color: "#1976d2" }}>
                {isUpdating ? "Update Room Guidelines & Conditions" : "Add Room Guidelines & Conditions"}
            </Typography>

            <Paper elevation={3} sx={{ p: 4, maxWidth: "600px", margin: "0 auto", borderRadius: "16px" }}>
                {loading ? (
                    <Box sx={{ textAlign: "center" }}>
                        <CircularProgress color="primary" />
                    </Box>
                ) : (
                    <>
                        {/* Room Guidelines */}
                        <Box sx={{ mb: 3 }}>
                            <InputLabel sx={{ fontWeight: "bold", mb: 1 }}>Room Guidelines</InputLabel>
                            <ReactQuill
                                value={roomData.guidlineDescription}
                                onChange={(value) => setRoomData({ ...roomData, guidlineDescription: value })}
                                placeholder="Describe the guideline"
                                style={{ height: "120px", borderRadius: "8px", marginBottom: "80px" }}
                            />
                        </Box>

                        {/* Room Conditions */}
                        <Box sx={{ mb: 3 }}>
                            <InputLabel sx={{ fontWeight: "bold", mb: 1 }}>Room Conditions</InputLabel>
                            <ReactQuill
                                value={roomData.roomConditionDescription}
                                onChange={(value) => setRoomData({ ...roomData, roomConditionDescription: value })}
                                placeholder="Describe the condition"
                                style={{ height: "120px", borderRadius: "8px", marginBottom: "80px" }}
                            />
                        </Box>

                        {/* Submit Button */}
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
                    </>
                )}
            </Paper>
        </Box>
    );
};

export default RoomGuidelineOrCondition;
