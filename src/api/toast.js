// src/utils/toast.js

import { toast } from "react-toastify";

export const showToast = (message, type = "success") => {
  toast(message, {
    type,
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "colored",
  });
};
