import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Divider,
    Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { fetchFoodAndBeverageDetails } from "../api/foodAndBeverage";
import { PUBLIC_API_URI } from "../api/config";
import { showToast } from "../api/toast";
import Breadcrumb from "../components/common/Breadcrumb";
import EditFoodAndBeverage from "./EditFoodAndBeverage";

const SingleFoodAndBeverage = () => {
    const { id } = useParams();
    const [foodAndBeverage, setFoodAndBeverage] = useState({});
    const [isEditDialogOpen, setEditDialogOpen] = useState(false);

    useEffect(() => {
        getFoodAndBeverageById(id);
    }, [id]);

    const getFoodAndBeverageById = async (categoryId) => {
        try {
            const response = await fetchFoodAndBeverageDetails(categoryId);
            setFoodAndBeverage(response.data.foodAndBeverage);
        } catch (error) {
            console.error("Failed to fetch food and beverage details:", error);
            showToast("Failed to fetch food and beverage details. Please try again.", "error");
        }
    };

    const handleSave = () => {
        getFoodAndBeverageById(id);
        setEditDialogOpen(false);
    };

    return (
        <Box sx={{ pt: "80px", pb: "20px" }}>
            <Breadcrumb />
            <Typography variant="h4" sx={{ mb: 2, textAlign: "center" }}>
                Food & Beverage Details
            </Typography>
            <Card sx={{ display: "flex", flexDirection: "column", p: 3, gap: 3 }}>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    {foodAndBeverage?.bannerImage?.map((image, index) => (
                        <CardMedia
                            key={index}
                            component="img"
                            height="200"
                            image={`${PUBLIC_API_URI}${image}`}
                            alt={`Banner ${index + 1}`}
                            sx={{ borderRadius: "12px", width: 200 }}
                        />
                    ))}
                </Box>
                <CardContent>
                    <Typography variant="h5">{foodAndBeverage.name || "N/A"}</Typography>
                    <Typography variant="body1">
                        <strong>Description:</strong>
                        <div
                            dangerouslySetInnerHTML={{ __html: foodAndBeverage.description || "N/A" }}
                        />
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        <strong>Location:</strong> {foodAndBeverage.location || "N/A"}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        <strong>Extension No:</strong> {foodAndBeverage.extansion_no || "N/A"}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        <strong>Timings:</strong>
                        {foodAndBeverage.timings?.map((timing, i) => (
                            <div key={i}>
                                {timing.menu} - {timing.menuType}:- {timing.startDay} - {timing.endDay}, {timing.startTime} - {timing.endTime}
                            </div>
                        ))}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        <strong>Status:</strong> {foodAndBeverage.status || "N/A"}
                    </Typography>
                    {foodAndBeverage.mainmenu && (
                        <Button
                            variant="outlined"
                            color="primary"
                            href={`${PUBLIC_API_URI}${foodAndBeverage.mainmenu}`}
                            target="_blank"
                            sx={{ mt: 2 }}
                        >
                            View Menu
                        </Button>
                    )}
                </CardContent>
                <Box sx={{ textAlign: "right" }}>
                    <Button
                        variant="contained"
                        sx={{ mt: 2, width: '30%' }}
                        onClick={() => setEditDialogOpen(true)}
                    >
                        Edit Food & Beverage
                    </Button>
                </Box>
            </Card>

            <EditFoodAndBeverage
                categoryId={foodAndBeverage._id}
                isOpen={isEditDialogOpen}
                onClose={() => setEditDialogOpen(false)}
                onSave={handleSave}
            />
        </Box>
    );
};

export default SingleFoodAndBeverage;
