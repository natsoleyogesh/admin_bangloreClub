import styled from "@emotion/styled";
import { Box, Typography } from "@mui/material";
import React from "react";


const OrderTemplate = () => {
  // const ComponentWrapper = styled(Box)({
  //   marginTop: "10px",
  //   paddingBottom: "10px",
  // });

  return (
    <Box sx={{ pt: "80px", pb: "20px" }}>
      <Typography variant="h6" sx={{ marginBottom: "14px" }}>
        Order Template
      </Typography>
    </Box>
  );
};

export default OrderTemplate;
