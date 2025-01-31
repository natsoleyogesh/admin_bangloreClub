import { Paper, Typography } from "@mui/material";
import React from "react";
import BuildVersion from "./BuildVersion";

const Footer = () => {
  return (
    <Paper
      sx={{
        boxShadow: "none !important",
        borderRadius: "12px",
        borderStyle: "solid",
        borderWidth: "1px",
        borderColor: "divider",
        py: "10px",
        mb: "20px",
        textAlign: "center",
      }}
    >
      <Typography>
        Created by <span style={{ color: "#027edd" }}>Bangalore Club</span> | All
        Rights Reserved &copy;
        {/* {new Date().getFullYear()} */}
        2025 {" "}
        <BuildVersion />
      </Typography>
    </Paper>
  );
};

export default Footer;
