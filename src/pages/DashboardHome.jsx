

import styled from "@emotion/styled";
import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Stats from "../components/home/stats/Stats";

import AllRequests from "./Requests/AllRequests";
import { fetchDashBoardSales } from "../api/masterData/dashboard";

const DashboardHome = () => {
    const ComponentWrapper = styled(Box)({
        marginTop: "10px",
        paddingBottom: "10px",
    });

    const [totalSales, setTotalSales] = useState({ Room: 0, Banquet: 0, Event: 0 });

    // Fetch total sales data
    const fetchTotalSales = async () => {
        try {
            const response = await fetchDashBoardSales();
            setTotalSales(response.data.data);
        } catch (error) {
            console.error("Failed to fetch total sales data:", error);
        }
    };

    useEffect(() => {
        fetchTotalSales();
    }, []);

    return (
        <Box sx={{ pt: "80px", pb: "20px" }}>
            <Typography variant="h6" sx={{ marginBottom: "14px" }}>
                Dashboard
            </Typography>
            <ComponentWrapper>
                <Stats totalSales={totalSales} />
            </ComponentWrapper>

            {/* <ComponentWrapper>
                <AllRequests />
            </ComponentWrapper> */}
        </Box>
    );
};

export default DashboardHome;



