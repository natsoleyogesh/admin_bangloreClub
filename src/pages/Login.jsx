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
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { styled } from "@mui/system";
import { PUBLIC_API_URI } from "../api/config";

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

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Check localStorage for saved email and password on component mount
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

  // Handle login form submission
  // const handleLogin = async (event) => {
  //   event.preventDefault();
  //   setLoading(true);
  //   setError("");

  //   try {
  //     const response = await axios.post(`${PUBLIC_API_URI}/admin/login`, {
  //       email,
  //       password,
  //     });

  //     if (response.data && response.data.token) {
  //       const token = response.data.token;

  //       // Save login status and credentials if "Remember Me" is checked
  //       if (rememberMe) {
  //         localStorage.setItem("token", token);
  //         localStorage.setItem("rememberedEmail", email);
  //         localStorage.setItem("rememberedPassword", password);
  //         localStorage.setItem("rememberMe", "true");
  //       } else {
  //         sessionStorage.setItem("token", token);
  //         localStorage.removeItem("rememberedEmail");
  //         localStorage.removeItem("rememberedPassword");
  //         localStorage.removeItem("rememberMe");
  //       }

  //       // Navigate to the dashboard
  //       navigate("/");
  //     } else {
  //       setError("Login failed. Please check your email and password.");
  //     }
  //   } catch (error) {
  //     setError(error.response?.data?.message || "An error occurred. Please try again later.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${PUBLIC_API_URI}/admin/login`, {
        email,
        password,
      });

      if (response.data && response.data.token) {
        const { token, user } = response.data;

        // Save token and role in both localStorage and sessionStorage
        localStorage.setItem("token", token);
        localStorage.setItem("role", user.role);
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("role", user.role);

        // Handle "Remember Me" option
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email);
          localStorage.setItem("rememberedPassword", password);
          localStorage.setItem("rememberMe", "true");
        } else {
          localStorage.removeItem("rememberedEmail");
          localStorage.removeItem("rememberedPassword");
          localStorage.removeItem("rememberMe");
        }

        // Navigate based on role
        if (user.role === "gatekeeper") {
          // navigate("/gatekeeper/qrScanner");
          navigate("/gatekeeper/events");

        } 
        else {
          navigate("/");
        }
      } else {
        setError("Login failed. Please check your email and password.");
      }
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };



  // Toggle password visibility
  const handleClickShowPassword = () => setShowPassword(!showPassword);

  // Handle "Remember Me" checkbox change
  const handleRememberMeChange = (event) => {
    setRememberMe(event.target.checked);
  };

  return (
    <LoginContainer>
      <LoginBox elevation={5}>
        <Logo src="/assets/logo.png" alt="Bangalore Club Logo" />
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
                  <IconButton
                    onClick={handleClickShowPassword}
                    edge="end"
                    style={{ color: "#fff" }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={rememberMe}
                onChange={handleRememberMeChange}
                style={{ color: "#fff" }}
              />
            }
            label="Remember Me"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
          </Button>
        </form>
        <Typography
          variant="body2"
          sx={{ mt: 2, color: "#fff", cursor: "pointer" }}
          onClick={() => alert("Forgot password? Please contact support.")}
        >
          Forgot Password?
        </Typography>
      </LoginBox>
    </LoginContainer>
  );
};

export default Login;
