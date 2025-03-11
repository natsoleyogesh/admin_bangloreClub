import { Box, Typography } from "@mui/material";

const StatusNotes = () => {
    return (
        <Box
            sx={{
                backgroundColor: "#f5f5f5",
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: 2,
                marginBottom: 2,
            }}
        >
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                Note:- Status
            </Typography>
            <Typography variant="body2">
                <strong>200</strong> - Operation Successful,&nbsp;
                <strong>201</strong> - Operation Create,&nbsp;
                <strong>400</strong> - Bad Request,&nbsp;
                <strong>401</strong> - Unauthorized,&nbsp;
                {/* <strong>403</strong> - Forbidden,&nbsp; */}
                <strong>404</strong> - Not Found,&nbsp;
                <strong>500</strong> - Internal Server Error
            </Typography>
        </Box>
    );
};

export default StatusNotes;
