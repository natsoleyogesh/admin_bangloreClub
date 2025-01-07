import React, { useState } from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
    CircularProgress,
    Typography,
    IconButton,
    Box,
} from "@mui/material";
import { WarningAmber as WarningIcon } from "@mui/icons-material";
import Slide from "@mui/material/Slide";

const Transition = React.forwardRef((props, ref) => (
    <Slide direction="up" ref={ref} {...props} />
));

const ConfirmationDialog = ({
    open,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = "Yes, Delete",
    cancelText = "Cancel",
    loadingText = "Processing...",
}) => {
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        setLoading(true);
        try {
            await onConfirm();
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onCancel}
            TransitionComponent={Transition}
            aria-labelledby="confirmation-dialog-title"
            aria-describedby="confirmation-dialog-description"
        >
            <DialogTitle id="confirmation-dialog-title">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <WarningIcon color="error" />
                    <Typography variant="h6">{title || "Are you sure?"}</Typography>
                </Box>
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="confirmation-dialog-description">
                    {message || "This action cannot be undone. Please confirm your choice."}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel} color="primary" disabled={loading}>
                    {cancelText}
                </Button>
                <Button
                    onClick={handleConfirm}
                    color="error"
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                    disabled={loading}
                >
                    {loading ? loadingText : confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmationDialog;
