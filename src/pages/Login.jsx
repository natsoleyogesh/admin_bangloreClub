// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Button,
//   Checkbox,
//   FormControlLabel,
//   TextField,
//   Typography,
//   Paper,
//   CircularProgress,
//   IconButton,
//   InputAdornment,
//   Alert,
// } from "@mui/material";
// import Visibility from "@mui/icons-material/Visibility";
// import VisibilityOff from "@mui/icons-material/VisibilityOff";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { styled } from "@mui/system";
// import { PUBLIC_API_URI } from "../api/config";

// const LoginContainer = styled(Box)({
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
//   height: "100vh",
//   backgroundImage: "url('/backgroundImage.png')",
//   backgroundSize: "cover",
//   backgroundPosition: "center",
//   color: "#fff",
// });

// const LoginBox = styled(Paper)({
//   padding: "40px",
//   maxWidth: "400px",
//   width: "100%",
//   textAlign: "center",
//   borderRadius: "12px",
//   backgroundColor: "rgba(0, 0, 0, 0.6)",
//   color: "#fff",
// });

// const Logo = styled("img")({
//   width: "150px",
//   marginBottom: "20px",
// });

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [rememberMe, setRememberMe] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const navigate = useNavigate();

//   // Check localStorage for saved email and password on component mount
//   useEffect(() => {
//     const savedEmail = localStorage.getItem("rememberedEmail");
//     const savedPassword = localStorage.getItem("rememberedPassword");
//     const isRemembered = localStorage.getItem("rememberMe") === "true";

//     if (isRemembered) {
//       setEmail(savedEmail || "");
//       setPassword(savedPassword || "");
//       setRememberMe(true);
//     }
//   }, []);

//   // Handle login form submission
//   // const handleLogin = async (event) => {
//   //   event.preventDefault();
//   //   setLoading(true);
//   //   setError("");

//   //   try {
//   //     const response = await axios.post(`${PUBLIC_API_URI}/admin/login`, {
//   //       email,
//   //       password,
//   //     });

//   //     if (response.data && response.data.token) {
//   //       const token = response.data.token;

//   //       // Save login status and credentials if "Remember Me" is checked
//   //       if (rememberMe) {
//   //         localStorage.setItem("token", token);
//   //         localStorage.setItem("rememberedEmail", email);
//   //         localStorage.setItem("rememberedPassword", password);
//   //         localStorage.setItem("rememberMe", "true");
//   //       } else {
//   //         sessionStorage.setItem("token", token);
//   //         localStorage.removeItem("rememberedEmail");
//   //         localStorage.removeItem("rememberedPassword");
//   //         localStorage.removeItem("rememberMe");
//   //       }

//   //       // Navigate to the dashboard
//   //       navigate("/");
//   //     } else {
//   //       setError("Login failed. Please check your email and password.");
//   //     }
//   //   } catch (error) {
//   //     setError(error.response?.data?.message || "An error occurred. Please try again later.");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };
//   const handleLogin = async (event) => {
//     event.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const response = await axios.post(`${PUBLIC_API_URI}/admin/login`, {
//         email,
//         password,
//       });

//       if (response.data && response.data.token) {
//         const { token, user } = response.data;

//         // Save token and role in both localStorage and sessionStorage
//         localStorage.setItem("token", token);
//         localStorage.setItem("role", user.role);
//         localStorage.setItem("roleId", user.roleId);
//         sessionStorage.setItem("token", token);
//         sessionStorage.setItem("role", user.role);
//         sessionStorage.setItem("roleId", user.roleId);

//         // Handle "Remember Me" option
//         if (rememberMe) {
//           localStorage.setItem("rememberedEmail", email);
//           localStorage.setItem("rememberedPassword", password);
//           localStorage.setItem("rememberMe", "true");
//         } else {
//           localStorage.removeItem("rememberedEmail");
//           localStorage.removeItem("rememberedPassword");
//           localStorage.removeItem("rememberMe");
//         }

//         // Navigate based on role
//         if (user.role === "gatekeeper") {
//           // navigate("/gatekeeper/qrScanner");
//           navigate("/gatekeeper/events");

//         }
//         else {
//           navigate("/");
//         }
//       } else {
//         setError("Login failed. Please check your email and password.");
//       }
//     } catch (error) {
//       setError(error.response?.data?.message || "An error occurred. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };



//   // Toggle password visibility
//   const handleClickShowPassword = () => setShowPassword(!showPassword);

//   // Handle "Remember Me" checkbox change
//   const handleRememberMeChange = (event) => {
//     setRememberMe(event.target.checked);
//   };

//   return (
//     <LoginContainer>
//       <LoginBox elevation={5}>
//         <Logo src="/ClubLogo.png" alt="Bangalore Club Logo" />
//         <Typography variant="h5" sx={{ mb: 3 }}>
//           Welcome to Bangalore Club
//         </Typography>
//         {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
//         <form onSubmit={handleLogin}>
//           <TextField
//             label="Email"
//             type="email"
//             fullWidth
//             required
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             sx={{ mb: 2, input: { color: "#fff" }, label: { color: "#fff" } }}
//           />
//           <TextField
//             label="Password"
//             type={showPassword ? "text" : "password"}
//             fullWidth
//             required
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             sx={{ mb: 2, input: { color: "#fff" }, label: { color: "#fff" } }}
//             InputProps={{
//               endAdornment: (
//                 <InputAdornment position="end">
//                   <IconButton
//                     onClick={handleClickShowPassword}
//                     edge="end"
//                     style={{ color: "#fff" }}
//                   >
//                     {showPassword ? <VisibilityOff /> : <Visibility />}
//                   </IconButton>
//                 </InputAdornment>
//               ),
//             }}
//           />
//           <FormControlLabel
//             control={
//               <Checkbox
//                 checked={rememberMe}
//                 onChange={handleRememberMeChange}
//                 style={{ color: "#fff" }}
//               />
//             }
//             label="Remember Me"
//           />
//           <Button
//             type="submit"
//             variant="contained"
//             color="primary"
//             fullWidth
//             disabled={loading}
//             sx={{ mt: 2 }}
//           >
//             {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
//           </Button>
//         </form>
//         <Typography
//           variant="body2"
//           sx={{ mt: 2, color: "#fff", cursor: "pointer" }}
//           onClick={() => alert("Forgot password? Please contact support.")}
//         >
//           Forgot Password?
//         </Typography>
//       </LoginBox>
//     </LoginContainer>
//   );
// };

// export default Login;

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  IconButton,
  InputAdornment,
  Alert,
  Modal,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { styled } from "@mui/system";
import { PUBLIC_API_URI } from "../api/config";
import CloseIcon from "@mui/icons-material/Close";
import { showToast } from "../api/toast";

const LoginContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  backgroundImage: "url('/backgroundImage.png')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  color: "#fff",
});

const LoginBox = styled(Paper)({
  padding: "40px",
  maxWidth: "400px",
  width: "100%",
  textAlign: "center",
  borderRadius: "12px",
  backgroundColor: "rgba(0, 0, 0, 0.6)",
  color: "#fff",
});

const Logo = styled("img")({
  width: "150px",
  marginBottom: "20px",
});

// const ModalContent = styled(Box)({
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: 350,
//   backgroundColor: "#fff",
//   boxShadow: 24,
//   padding: "24px",
//   borderRadius: "10px",
//   textAlign: "center",
// });




// ModalContent with full-screen overlay styling
const ModalContent = styled(Box)({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 350,
  backgroundColor: "#fff",
  boxShadow: 24,
  padding: "24px",
  borderRadius: "10px",
  textAlign: "center",
  outline: "none",
});

const OtpModalBackdrop = styled(Box)({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  zIndex: 1300,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(""); // OTP State
  const [showOtpModal, setShowOtpModal] = useState(false); // OTP Modal State
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [timer, setTimer] = useState(60);
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    const savedPassword = localStorage.getItem("rememberedPassword");
    const isRemembered = localStorage.getItem("rememberMe") === "true";

    if (isRemembered) {
      setEmail(savedEmail || "");
      setPassword(savedPassword || "");
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${PUBLIC_API_URI}/admin/login`, {
        email,
        password,
      });

      if (response.data && response.data.success) {
        showToast(response.data.message, "success")
        setShowOtpModal(true);
        setResendDisabled(true);
        setTimer(60);
        startResendTimer();
      } else {
        setError("Login failed. Please check your email and password.");
      }
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setOtpLoading(true);
    try {
      const response = await axios.post(`${PUBLIC_API_URI}/admin-verify-otp`, {
        email,
        otp,
      });

      if (response.data && response.data.token) {
        const { token, user, message } = response.data;

        localStorage.setItem("token", token);
        localStorage.setItem("role", user.role);
        localStorage.setItem("roleId", user.roleId);
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("role", user.role);
        sessionStorage.setItem("roleId", user.roleId);

        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email);
          localStorage.setItem("rememberedPassword", password);
          localStorage.setItem("rememberMe", "true");
        } else {
          localStorage.removeItem("rememberedEmail");
          localStorage.removeItem("rememberedPassword");
          localStorage.removeItem("rememberMe");
        }

        if (user.role === "gatekeeper") {
          setError("")
          showToast(message, "success");
          navigate("/gatekeeper/events");
        } else {
          setError("")
          showToast(message, "success");
          navigate("/");
        }
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (error) {
      setError(error.response?.data?.message || "OTP verification failed.");
    } finally {
      setOtpLoading(false);
      setOtp("")
    }
  };

  const handleResendOtp = async () => {
    setResendDisabled(true);
    setTimer(60);
    startResendTimer();

    try {
      await axios.post(`${PUBLIC_API_URI}/admin-resend-otp`, { email });
      setError("")
      showToast("OTP sent to email. Please verify within 60 seconds.", "success");
    } catch (error) {
      setError(error.response.data.message || "Failed to resend OTP. Please try again.");
      setOtp("")
    }
  };

  const startResendTimer = () => {
    let countdown = 60;
    const interval = setInterval(() => {
      countdown -= 1;
      setTimer(countdown);
      if (countdown === 0) {
        setResendDisabled(false);
        clearInterval(interval);
      }
    }, 1000);
  };

  return (
    <LoginContainer>
      <LoginBox elevation={5}>
        <Logo src="/ClubLogo.png" alt="Bangalore Club Logo" />
        <Typography variant="h5" sx={{ mb: 3 }}>
          Welcome to Bangalore Club
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleLogin}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2, input: { color: "#fff" }, label: { color: "#fff" } }}
          />
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2, input: { color: "#fff" }, label: { color: "#fff" } }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" style={{ color: "#fff" }}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <FormControlLabel control={<Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />} label="Remember Me" />
          <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading} sx={{ mt: 2 }}>
            {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
          </Button>
        </form>
      </LoginBox>

      {/* OTP Modal (Centered on Screen) */}
      {/* <Modal open={showOtpModal} onClose={() => setShowOtpModal(false)}>
        <ModalContent>
          <Typography variant="h6" sx={{ mb: 2 }}>Enter OTP</Typography>
          <TextField fullWidth label="6-Digit OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
          <Button sx={{ mt: 2 }} variant="contained" onClick={handleVerifyOtp} disabled={otpLoading}>
            {otpLoading ? <CircularProgress size={24} /> : "Verify OTP"}
          </Button>
          <Button sx={{ mt: 2 }} onClick={handleResendOtp} disabled={resendDisabled}>
            {resendDisabled ? `Resend OTP (${timer}s)` : "Resend OTP"}
          </Button>
        </ModalContent>
      </Modal> */}

      {/* OTP Modal (Blocks entire screen + Cancel + Resend as Link) */}
      <Modal open={showOtpModal} onClose={() => setShowOtpModal(false)}>
        <OtpModalBackdrop>
          <ModalContent>
            {/* Close / Cancel Icon (Top Right) */}
            <IconButton
              onClick={() => setShowOtpModal(false)}
              sx={{ position: "absolute", top: 8, right: 8 }}
            >
              <CloseIcon />
            </IconButton>

            {/* OTP Heading */}
            <Typography variant="h6" sx={{ mb: 2 }}>
              Enter OTP
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {/* OTP Input */}
            <TextField
              fullWidth
              label="6-Digit OTP"
              variant="outlined"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            {/* Verify OTP Button */}
            <Button
              sx={{ mt: 3 }}
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleVerifyOtp}
              disabled={otpLoading}
            >
              {otpLoading ? <CircularProgress size={24} /> : "Verify OTP"}
            </Button>

            {/* Resend OTP Link */}
            <Typography
              variant="body2"
              sx={{
                mt: 2,
                cursor: resendDisabled ? "not-allowed" : "pointer",
                color: resendDisabled ? "grey.500" : "primary.main",
                textDecoration: resendDisabled ? "none" : "underline",
                pointerEvents: resendDisabled ? "none" : "auto",
              }}
              onClick={!resendDisabled ? handleResendOtp : undefined}
            >
              {resendDisabled ? `Resend OTP in ${timer}s` : "Resend OTP"}
            </Typography>

            {/* Cancel Button (Bottom) */}
            {/* <Button
              sx={{ mt: 3 }}
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={() => setShowOtpModal(false)}
            >
              Cancel
            </Button> */}
          </ModalContent>
        </OtpModalBackdrop>
      </Modal>

    </LoginContainer>
  );
};

export default Login;


// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Button,
//   Checkbox,
//   FormControlLabel,
//   TextField,
//   Typography,
//   Paper,
//   CircularProgress,
//   IconButton,
//   InputAdornment,
//   Alert,
//   Modal,
// } from "@mui/material";
// import Visibility from "@mui/icons-material/Visibility";
// import VisibilityOff from "@mui/icons-material/VisibilityOff";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { styled } from "@mui/system";
// import { PUBLIC_API_URI } from "../api/config";

// const LoginContainer = styled(Box)({
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
//   height: "100vh",
//   backgroundImage: "url('/backgroundImage.png')",
//   backgroundSize: "cover",
//   backgroundPosition: "center",
//   color: "#fff",
// });

// const LoginBox = styled(Paper)({
//   padding: "40px",
//   maxWidth: "400px",
//   width: "100%",
//   textAlign: "center",
//   borderRadius: "12px",
//   backgroundColor: "rgba(0, 0, 0, 0.6)",
//   color: "#fff",
// });

// const Logo = styled("img")({
//   width: "150px",
//   marginBottom: "20px",
// });

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [rememberMe, setRememberMe] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [otp, setOtp] = useState(""); // OTP State
//   const [showOtpModal, setShowOtpModal] = useState(false); // OTP Modal State
//   const [otpLoading, setOtpLoading] = useState(false);
//   const [resendDisabled, setResendDisabled] = useState(true);
//   const [timer, setTimer] = useState(60);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const savedEmail = localStorage.getItem("rememberedEmail");
//     const savedPassword = localStorage.getItem("rememberedPassword");
//     const isRemembered = localStorage.getItem("rememberMe") === "true";

//     if (isRemembered) {
//       setEmail(savedEmail || "");
//       setPassword(savedPassword || "");
//       setRememberMe(true);
//     }
//   }, []);

//   const handleLogin = async (event) => {
//     event.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const response = await axios.post(`${PUBLIC_API_URI}/admin/login`, {
//         email,
//         password,
//       });

//       if (response.data && response.data.success) {
//         setShowOtpModal(true);
//         setResendDisabled(true);
//         setTimer(60);
//         startResendTimer();
//       } else {
//         setError("Login failed. Please check your email and password.");
//       }
//     } catch (error) {
//       setError(error.response?.data?.message || "An error occurred. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVerifyOtp = async () => {
//     setOtpLoading(true);
//     try {
//       const response = await axios.post(`${PUBLIC_API_URI}/admin/verify-otp`, {
//         email,
//         otp,
//       });

//       if (response.data && response.data.token) {
//         const { token, user } = response.data;

//         localStorage.setItem("token", token);
//         localStorage.setItem("role", user.role);
//         localStorage.setItem("roleId", user.roleId);
//         sessionStorage.setItem("token", token);
//         sessionStorage.setItem("role", user.role);
//         sessionStorage.setItem("roleId", user.roleId);

//         if (rememberMe) {
//           localStorage.setItem("rememberedEmail", email);
//           localStorage.setItem("rememberedPassword", password);
//           localStorage.setItem("rememberMe", "true");
//         } else {
//           localStorage.removeItem("rememberedEmail");
//           localStorage.removeItem("rememberedPassword");
//           localStorage.removeItem("rememberMe");
//         }

//         if (user.role === "gatekeeper") {
//           navigate("/gatekeeper/events");
//         } else {
//           navigate("/");
//         }
//       } else {
//         setError("Invalid OTP. Please try again.");
//       }
//     } catch (error) {
//       setError(error.response?.data?.message || "OTP verification failed.");
//     } finally {
//       setOtpLoading(false);
//     }
//   };

//   const handleResendOtp = async () => {
//     setResendDisabled(true);
//     setTimer(60);
//     startResendTimer();

//     try {
//       await axios.post(`${PUBLIC_API_URI}/admin/resend-otp`, { email });
//     } catch (error) {
//       setError("Failed to resend OTP. Please try again.");
//     }
//   };

//   const startResendTimer = () => {
//     let countdown = 60;
//     const interval = setInterval(() => {
//       countdown -= 1;
//       setTimer(countdown);
//       if (countdown === 0) {
//         setResendDisabled(false);
//         clearInterval(interval);
//       }
//     }, 1000);
//   };

//   return (
//     <LoginContainer>
//       <LoginBox elevation={5}>
//         <Logo src="/ClubLogo.png" alt="Bangalore Club Logo" />
//         <Typography variant="h5" sx={{ mb: 3 }}>
//           Welcome to Bangalore Club
//         </Typography>
//         {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
//         <form onSubmit={handleLogin}>
//           <TextField
//             label="Email"
//             type="email"
//             fullWidth
//             required
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             sx={{ mb: 2, input: { color: "#fff" }, label: { color: "#fff" } }}
//           />
//           <TextField
//             label="Password"
//             type={showPassword ? "text" : "password"}
//             fullWidth
//             required
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             sx={{ mb: 2, input: { color: "#fff" }, label: { color: "#fff" } }}
//             InputProps={{
//               endAdornment: (
//                 <InputAdornment position="end">
//                   <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" style={{ color: "#fff" }}>
//                     {showPassword ? <VisibilityOff /> : <Visibility />}
//                   </IconButton>
//                 </InputAdornment>
//               ),
//             }}
//           />
//           <FormControlLabel control={<Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />} label="Remember Me" />
//           <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading} sx={{ mt: 2 }}>
//             {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
//           </Button>
//         </form>
//       </LoginBox>

//       {/* OTP Modal */}
//       <Modal open={showOtpModal} onClose={() => setShowOtpModal(false)}>
//         <Box sx={{ p: 3, bgcolor: "white", textAlign: "center", borderRadius: 2 }}>
//           <Typography variant="h6">Enter OTP</Typography>
//           <TextField fullWidth sx={{ mt: 2 }} label="6-Digit OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
//           <Button sx={{ mt: 2 }} variant="contained" onClick={handleVerifyOtp} disabled={otpLoading}>{otpLoading ? <CircularProgress size={24} /> : "Verify OTP"}</Button>
//           <Button sx={{ mt: 2 }} onClick={handleResendOtp} disabled={resendDisabled}>{resendDisabled ? `Resend OTP (${timer}s)` : "Resend OTP"}</Button>
//         </Box>
//       </Modal>
//     </LoginContainer>
//   );
// };

// export default Login;
