import * as React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Sidebar from "./components/common/Sidebar";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/common/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Footer from "./components/common/Footer";
import {
  AddProduct,
  Customers,
  Products,
  SingleCustomer,
  SingleProduct,
} from "./pages";
import AddMember from "./pages/AddMember";
import AddFamilyMember from "./pages/AddFamilyMember";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import "react-quill/dist/quill.snow.css";

import Events from "./pages/Events";
import AddEvent from "./pages/AddEvent";
import SingleEvent from "./pages/SingleEvent";
import AddCategory from "./pages/AddCategory";
import Categories from "./pages/Categories";
import SingleCategory from "./pages/SingleCategory";
import Rooms from "./pages/Rooms";
import AddRoom from "./pages/AddRoom";
import SingleRoom from "./pages/SingleRoom";
import EditRoom from "./pages/EditRoom";
import Offers from "./pages/Offers";
import SingleOffer from "./pages/SingleOffer";
import AddOffer from "./pages/AddOffer";
import GetKeeparScanner from "./pages/GetKeeparScanner";
import ClubHods from "./pages/ClubHods";
import SingleHod from "./pages/SingleHod";
import AddHod from "./pages/AddHod";
import Downloads from "./pages/Downloads";
import AddDownload from "./pages/AddDownload";
import SingleDownload from "./pages/SingleDownload";
import ClubNotices from "./pages/ClubNotices";
import SingleNotice from "./pages/SingleNotice";
import AddNotice from "./pages/AddNotice";
import AddGCM from "./pages/AddGCM";
import SingleGCM from "./pages/SingleGCM";
import GCMs from "./pages/GCMs";
import Rules from "./pages/Rules";
import SingleRuleByeLaw from "./pages/SingleRuleByeLaw";
import AddRuleByeLaw from "./pages/AddRuleByeLaw";
import FAQs from "./pages/FAQs";
import SingleFAQ from "./pages/SingleFAQ";
import AddFAQ from "./pages/AddFAQ";
import COMs from "./pages/COMs";
import SingleCOM from "./pages/SingleCOM";
import AddCOM from "./pages/AddCOM";
import FoodAndBeverages from "./pages/FoodAndBeverages";
import SingleFoodAndBeverage from "./pages/SingleFoodAndBeverage";
import AddFoodAndBeverage from "./pages/AddFoodAndBeverage";
import AddMemberApplication from "./pages/AddMemberApplication";
import MemberApplications from "./pages/MemberApplications";
import SingleApplication from "./pages/SingleApplication";
import Bookings from "./pages/eventBooking/Bookings";
import SingleBooking from "./pages/eventBooking/SingleBooking";
import Departments from "./pages/masterData/Department/Departments";
import SingleDepartment from "./pages/masterData/Department/SingleDepartment";
import AddDepartment from "./pages/masterData/Department/AddDepartment";
import Restaurants from "./pages/masterData/Restaurant/Restaurant";
import SingleRestaurant from "./pages/masterData/Restaurant/SingleRestaurant";
import AddRestaurant from "./pages/masterData/Restaurant/AddRestaurant";
import TaxTypes from "./pages/masterData/TaxType/TaxTypes";
import SingleTaxType from "./pages/masterData/TaxType/SingleTaxType";
import AddTaxType from "./pages/masterData/TaxType/AddTaxType";
import Amenities from "./pages/masterData/Amenitie/Amenities";
import SingleAmenitie from "./pages/masterData/Amenitie/SingleAmenities";
import AddAmenitie from "./pages/masterData/Amenitie/AddAmenitie";

// Banquets
import BanquetCategory from "./pages/banquet/category/Categories";
import SingleBanquetCategory from "./pages/banquet/category/SingleCategory";
import AddBanquetCategory from "./pages/banquet/category/AddCategory";
import Banquets from "./pages/banquet/banquet-creatation/Banquets";
import SingleBanquet from "./pages/banquet/banquet-creatation/SingleBanquet";
import AddBanquet from "./pages/banquet/banquet-creatation/AddBanquet";
import EditBanquet from "./pages/banquet/banquet-creatation/EditBanquet";
import BanquetBookings from "./pages/banquet/booking/Bookings";
import SingleBanquetBooking from "./pages/banquet/booking/SingleBooking";
import RoomBookings from "./pages/room/booking/RoomBookings";
import SingleRoomBooking from "./pages/room/booking/SingleBooking";
import Billings from "./pages/Billings/Billings";
import SingleBilling from "./pages/Billings/SingleBilling";
import Transactions from "./pages/Transaction/Transactions";
import NotificationPopup from "./components/NotificationPopup";
import AllRequests from "./pages/Requests/AllRequests";
import SingleRequest from "./pages/Requests/SingleRequest";
import Notifications from "./pages/notification/Notifications";
import SendNotification from "./pages/notification/SendNotification";
import GetKeeparEvents from "./pages/GetKeeparEvents";
import AffiliatedClubs from "./pages/AffiliatedClubs/AffiliatedClubs";
import SingleAffiliatedClub from "./pages/AffiliatedClubs/SingleAffiliatedClubs";
import MonthlyBillings from "./pages/monthlyBilling/MonthlyBillings";
import SingleMonthlyBilling from "./pages/monthlyBilling/SingleMonthlyBilling";
import MonthlyBillTransactions from "./pages/MonthlyBillTransaction/MonthlyBillTransactions";
import Designations from "./pages/masterData/Designation/Designations";
import SingleDesignation from "./pages/masterData/Designation/SingleDesignation";
import AddDesignation from "./pages/masterData/Designation/AddDesignation";
import SmtpSecret from "./pages/settings/smtpSecret/SmtpSecret";
import UserLoginActions from "./pages/settings/logActions/UserLoginActions";
import AdminLoginActions from "./pages/settings/logActions/AdminLoginActions";
import Roles from "./pages/settings/role/Roles";
import SingleRole from "./pages/settings/role/SingleRole";
import AddRole from "./pages/settings/role/AddRole";
import AddPermission from "./pages/settings/permission/AddPermission";
import SinglePermission from "./pages/settings/permission/SinglePermission";
import AboutUs from "./pages/settings/aboutUs/Abouts";
import SingleAboutUs from "./pages/settings/aboutUs/SingleAbout";
import AddAboutUs from "./pages/settings/aboutUs/AddAbout";
import Contacts from "./pages/settings/contactUs/Contacts";
import SingleContact from "./pages/settings/contactUs/SingleContact";
import AddContact from "./pages/settings/contactUs/AddContact";
import UploadData from "./pages/settings/uploadData/UploadData";
import RoomGuidlineOrCondition from "./pages/RoomGuidlineOrCondition";
import UpdateQrData from "./pages/settings/uploadData/UpdateQRCode";


import Admins from "./pages/masterData/admins/Admins";
import SingleAdmin from "./pages/masterData/admins/SingleAdmin";
import AddAdmin from "./pages/masterData/admins/AddAdmin";
import DashboardHome from "./pages/DashboardHome";
import AdminApiLogs from "./pages/settings/apiLogs/AdminApiLogs";
import AddOrUpdateBookingDate from "./pages/settings/AddOrUpdateBookingDate/AddOrUpdateBookingDate";
import TermsAndConditions from "./pages/TermsAndConditions";


const sideBarWidth = 250;

function App() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // // Check if the current route is the login page
  // const isLoginPage = location.pathname === "/login";

  // Define routes where you don't want Navbar, Sidebar, and Footer to appear
  const excludedRoutes = ["/login", "/Terms-and-Conditions"];

  // Check if the current route is one of the excluded routes
  const isExcludedPage = excludedRoutes.includes(location.pathname);

  // Retrieve the user role from localStorage or sessionStorage
  const userRole = localStorage.getItem("role") || sessionStorage.getItem("role");
  return (
    <Box sx={{ display: "flex" }}>
      <ToastContainer />
      {/* Conditionally render Navbar and Sidebar */}
      {/* {!isLoginPage && (
        <>
          <Navbar
            sideBarWidth={sideBarWidth}
            handleDrawerToggle={handleDrawerToggle}
          />
          {userRole !== "gatekeeper" && (
            <Sidebar
              sideBarWidth={sideBarWidth}
              mobileOpen={mobileOpen}
              handleDrawerToggle={handleDrawerToggle}
            />
          )}
        </>
      )} */}

      {/* Conditionally render Navbar and Sidebar */}
      {!isExcludedPage && (
        <>
          <Navbar
            sideBarWidth={sideBarWidth}
            handleDrawerToggle={handleDrawerToggle}
          />

          {userRole !== "gatekeeper" && (
            <Sidebar
              sideBarWidth={sideBarWidth}
              mobileOpen={mobileOpen}
              handleDrawerToggle={handleDrawerToggle}
            />
          )}
        </>
      )}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          px: { xs: 1, md: 2 },
          width: { xs: "100%", md: `calc(100% - ${sideBarWidth}px)` },
        }}
      >
        <NotificationPopup />
        {/* Routes */}
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />
          <Route path="/Terms-and-Conditions" element={<TermsAndConditions />} />


          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gatekeeper/events"
            element={
              <ProtectedRoute>
                <GetKeeparEvents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gatekeeper/qrScanner/:eventId"
            element={
              <ProtectedRoute>
                <GetKeeparScanner />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/add"
            element={
              <ProtectedRoute>
                <AddProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/:id"
            element={
              <ProtectedRoute>
                <SingleProduct />
              </ProtectedRoute>
            }
          />

          <Route
            path="/members"
            element={
              <ProtectedRoute>
                <Customers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/members/:id"
            element={
              <ProtectedRoute>
                <SingleCustomer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/member/add"
            element={
              <ProtectedRoute>
                <AddMember />
              </ProtectedRoute>
            }
          />
          <Route
            path="/member/:parentUserId/add-family-member"
            element={
              <ProtectedRoute>
                <AddFamilyMember />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events"
            element={
              <ProtectedRoute>
                <Events />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events/add"
            element={
              <ProtectedRoute>
                <AddEvent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events/:id"
            element={
              <ProtectedRoute>
                <SingleEvent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/categories"
            element={
              <ProtectedRoute>
                <Categories />
              </ProtectedRoute>
            }
          />
          <Route
            path="/categories/:id"
            element={
              <ProtectedRoute>
                <SingleCategory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/category/add"
            element={
              <ProtectedRoute>
                <AddCategory />
              </ProtectedRoute>
            }
          />

          <Route
            path="/roomwith-categories"
            element={
              <ProtectedRoute>
                <Rooms />
              </ProtectedRoute>
            }
          />
          <Route
            path="/roomwith-category/:id"
            element={
              <ProtectedRoute>
                < SingleRoom />
              </ProtectedRoute>
            }
          />
          <Route
            path="/roomwith-category/add"
            element={
              <ProtectedRoute>
                <AddRoom />
              </ProtectedRoute>
            }
          />

          <Route
            path="/room/edit/:id"
            element={
              <ProtectedRoute>
                <EditRoom />
              </ProtectedRoute>
            }
          />

          <Route
            path="/room-bookings"
            element={
              <ProtectedRoute>
                <RoomBookings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/room-booking/:id"
            element={
              <ProtectedRoute>
                <SingleRoomBooking />
              </ProtectedRoute>
            }
          />

          {/* Banquet Routes */}

          <Route
            path="/banquet-categories"
            element={
              <ProtectedRoute>
                <BanquetCategory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/banquet-category/:id"
            element={
              <ProtectedRoute>
                < SingleBanquetCategory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/banquet-category/add"
            element={
              <ProtectedRoute>
                <AddBanquetCategory />
              </ProtectedRoute>
            }
          />

          <Route
            path="/banquets"
            element={
              <ProtectedRoute>
                <Banquets />
              </ProtectedRoute>
            }
          />
          <Route
            path="/banquet/:id"
            element={
              <ProtectedRoute>
                < SingleBanquet />
              </ProtectedRoute>
            }
          />
          <Route
            path="/banquet/add"
            element={
              <ProtectedRoute>
                <AddBanquet />
              </ProtectedRoute>
            }
          />
          <Route
            path="/banquet/edit/:id"
            element={
              <ProtectedRoute>
                <EditBanquet />
              </ProtectedRoute>
            }
          />


          <Route
            path="/banquet-bookings"
            element={
              <ProtectedRoute>
                <BanquetBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/banquet-booking/:id"
            element={
              <ProtectedRoute>
                < SingleBanquetBooking />
              </ProtectedRoute>
            }
          />

          {/* Offers Route */}
          <Route
            path="/offers"
            element={
              <ProtectedRoute>
                <Offers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/offer/:id"
            element={
              <ProtectedRoute>
                < SingleOffer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/offer/add"
            element={
              <ProtectedRoute>
                <AddOffer />
              </ProtectedRoute>
            }
          />

          {/* HOD Route */}
          <Route
            path="/hods"
            element={
              <ProtectedRoute>
                <ClubHods />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hod/:id"
            element={
              <ProtectedRoute>
                < SingleHod />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hod/add"
            element={
              <ProtectedRoute>
                <AddHod />
              </ProtectedRoute>
            }
          />

          {/* Downloads Route */}
          <Route
            path="/downloads"
            element={
              <ProtectedRoute>
                <Downloads />
              </ProtectedRoute>
            }
          />
          <Route
            path="/download/:id"
            element={
              <ProtectedRoute>
                < SingleDownload />
              </ProtectedRoute>
            }
          />
          <Route
            path="/download/add"
            element={
              <ProtectedRoute>
                <AddDownload />
              </ProtectedRoute>
            }
          />

          {/* Notice Route */}
          <Route
            path="/notices"
            element={
              <ProtectedRoute>
                <ClubNotices />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notice/:id"
            element={
              <ProtectedRoute>
                < SingleNotice />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notice/add"
            element={
              <ProtectedRoute>
                <AddNotice />
              </ProtectedRoute>
            }
          />

          {/* GCM Route */}
          <Route
            path="/gcms"
            element={
              <ProtectedRoute>
                <GCMs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gcm/:id"
            element={
              <ProtectedRoute>
                < SingleGCM />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gcm/add"
            element={
              <ProtectedRoute>
                <AddGCM />
              </ProtectedRoute>
            }
          />

          {/* RULE BYE LAWS Route */}
          <Route
            path="/allrulebyelaws"
            element={
              <ProtectedRoute>
                <Rules />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rulebyelaw/:id"
            element={
              <ProtectedRoute>
                < SingleRuleByeLaw />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rulebyelaw/add"
            element={
              <ProtectedRoute>
                <AddRuleByeLaw />
              </ProtectedRoute>
            }
          />

          {/* FAQ Route */}
          <Route
            path="/faqs"
            element={
              <ProtectedRoute>
                <FAQs />
              </ProtectedRoute>
            }
          />

          <Route
            path="/faq/:id"
            element={
              <ProtectedRoute>
                < SingleFAQ />
              </ProtectedRoute>
            }
          />
          <Route
            path="/faq/add"
            element={
              <ProtectedRoute>
                <AddFAQ />
              </ProtectedRoute>
            }
          />

          {/* Consideration Of Membership Route */}
          <Route
            path="/coms"
            element={
              <ProtectedRoute>
                <COMs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/com/:id"
            element={
              <ProtectedRoute>
                < SingleCOM />
              </ProtectedRoute>
            }
          />
          <Route
            path="/com/add"
            element={
              <ProtectedRoute>
                <AddCOM />
              </ProtectedRoute>
            }
          />

          {/*FoodAndBeverages Route */}
          <Route
            path="/foodAndBeverages"
            element={
              <ProtectedRoute>
                <FoodAndBeverages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/foodAndBeverage/:id"
            element={
              <ProtectedRoute>
                < SingleFoodAndBeverage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/foodAndBeverage/add"
            element={
              <ProtectedRoute>
                <AddFoodAndBeverage />
              </ProtectedRoute>
            }
          />


          {/*Member Waiting List Application Route */}
          <Route
            path="/applications"
            element={
              <ProtectedRoute>
                <MemberApplications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/application/:id"
            element={
              <ProtectedRoute>
                < SingleApplication />
              </ProtectedRoute>
            }
          />
          <Route
            path="/application/add"
            element={
              <ProtectedRoute>
                <AddMemberApplication />
              </ProtectedRoute>
            }
          />

          {/*Member Event Booking Route */}
          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <Bookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/booking/:id"
            element={
              <ProtectedRoute>
                < SingleBooking />
              </ProtectedRoute>
            }
          />
          {/* <Route
            path="/application/add"
            element={
              <ProtectedRoute>
                <AddMemberApplication />
              </ProtectedRoute>
            }
          /> */}
          {/* MAster DATA ROUTES */}
          {/* department routes */}
          <Route
            path="/departments"
            element={
              <ProtectedRoute>
                <Departments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/department/:id"
            element={
              <ProtectedRoute>
                < SingleDepartment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/department/add"
            element={
              <ProtectedRoute>
                <AddDepartment />
              </ProtectedRoute>
            }
          />

          {/* designation routes */}
          <Route
            path="/designations"
            element={
              <ProtectedRoute>
                <Designations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/designation/:id"
            element={
              <ProtectedRoute>
                < SingleDesignation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/designation/add"
            element={
              <ProtectedRoute>
                <AddDesignation />
              </ProtectedRoute>
            }
          />

          {/* RESTAURANT routes */}
          <Route
            path="/restaurants"
            element={
              <ProtectedRoute>
                <Restaurants />
              </ProtectedRoute>
            }
          />
          <Route
            path="/restaurant/:id"
            element={
              <ProtectedRoute>
                < SingleRestaurant />
              </ProtectedRoute>
            }
          />
          <Route
            path="/restaurant/add"
            element={
              <ProtectedRoute>
                <AddRestaurant />
              </ProtectedRoute>
            }
          />

          {/* TAXTYPE routes */}
          <Route
            path="/taxTypes"
            element={
              <ProtectedRoute>
                <TaxTypes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/taxType/:id"
            element={
              <ProtectedRoute>
                < SingleTaxType />
              </ProtectedRoute>
            }
          />
          <Route
            path="/taxType/add"
            element={
              <ProtectedRoute>
                <AddTaxType />
              </ProtectedRoute>
            }
          />

          {/* Amenitie routes */}
          <Route
            path="/amenities"
            element={
              <ProtectedRoute>
                <Amenities />
              </ProtectedRoute>
            }
          />
          <Route
            path="/amenitie/:id"
            element={
              <ProtectedRoute>
                < SingleAmenitie />
              </ProtectedRoute>
            }
          />
          <Route
            path="/amenitie/add"
            element={
              <ProtectedRoute>
                <AddAmenitie />
              </ProtectedRoute>
            }
          />

          {/* Billing routes */}
          <Route
            path="/billings"
            element={
              <ProtectedRoute>
                <Billings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/billings/:id"
            element={
              <ProtectedRoute>
                <Billings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/billing/:id"
            element={
              <ProtectedRoute>
                < SingleBilling />
              </ProtectedRoute>
            }
          />
          {/* <Route
            path="/amenitie/add"
            element={
              <ProtectedRoute>
                <AddAmenitie />
              </ProtectedRoute>
            }
          /> */}


          {/*Monthly Offline Billing routes */}
          <Route
            path="/monthly-billings"
            element={
              <ProtectedRoute>
                <MonthlyBillings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/monthly-billing/:id"
            element={
              <ProtectedRoute>
                <SingleMonthlyBilling />
              </ProtectedRoute>
            }
          />


          {/* Transaction routes */}
          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <Transactions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions/:id"
            element={
              <ProtectedRoute>
                <Transactions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transaction/:id"
            element={
              <ProtectedRoute>
                < SingleBilling />
              </ProtectedRoute>
            }
          />


          {/* Transaction routes */}
          <Route
            path="/monthly-bill-transactions"
            element={
              <ProtectedRoute>
                <MonthlyBillTransactions />
              </ProtectedRoute>
            }
          />


          {/* All Requests */}
          <Route
            path="/requests"
            element={
              <ProtectedRoute>
                <AllRequests />
              </ProtectedRoute>
            }
          />

          <Route
            path="/request/:id"
            element={
              <ProtectedRoute>
                <SingleRequest />
              </ProtectedRoute>
            }
          />

          {/* All Notifications */}
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />

          <Route
            path="/notification/send"
            element={
              <ProtectedRoute>
                <SendNotification />
              </ProtectedRoute>
            }
          />

          {/* All Affiliated Clubs */}
          <Route
            path="/affiliated-clubs"
            element={
              <ProtectedRoute>
                <AffiliatedClubs />
              </ProtectedRoute>
            }
          />

          <Route
            path="affiliated-club/:id"
            element={
              <ProtectedRoute>
                <SingleAffiliatedClub />
              </ProtectedRoute>
            }
          />



          <Route
            path="/smtpSecret"
            element={
              <ProtectedRoute>
                <SmtpSecret />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-action-logs"
            element={
              <ProtectedRoute>
                <UserLoginActions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-action-logs"
            element={
              <ProtectedRoute>
                <AdminLoginActions />
              </ProtectedRoute>
            }
          />


          {/* Role routes */}
          <Route
            path="/roles"
            element={
              <ProtectedRoute>
                <Roles />
              </ProtectedRoute>
            }
          />
          <Route
            path="/role/:id"
            element={
              <ProtectedRoute>
                < SingleRole />
              </ProtectedRoute>
            }
          />
          <Route
            path="/role/add"
            element={
              <ProtectedRoute>
                <AddRole />
              </ProtectedRoute>
            }
          />

          {/* Role routes */}
          {/* <Route
            path="/permissions"
            element={
              <ProtectedRoute>
                <Roles />
              </ProtectedRoute>
            }
          /> */}
          <Route
            path="/permission/:roleId"
            element={
              <ProtectedRoute>
                < SinglePermission />
              </ProtectedRoute>
            }
          />
          <Route
            path="/permission/add"
            element={
              <ProtectedRoute>
                <AddPermission />
              </ProtectedRoute>
            }
          />


          {/* About Us routes */}
          <Route
            path="/aboutUs"
            element={
              <ProtectedRoute>
                <AboutUs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/aboutUs/:id"
            element={
              <ProtectedRoute>
                < SingleAboutUs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/aboutUs/add"
            element={
              <ProtectedRoute>
                <AddAboutUs />
              </ProtectedRoute>
            }
          />

          {/* Contact Us routes */}
          <Route
            path="/contactUs"
            element={
              <ProtectedRoute>
                <Contacts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contactUs/:id"
            element={
              <ProtectedRoute>
                < SingleContact />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contactUs/add"
            element={
              <ProtectedRoute>
                <AddContact />
              </ProtectedRoute>
            }
          />


          {/* Contact Us routes */}
          <Route
            path="/upload-data"
            element={
              <ProtectedRoute>
                <UploadData />
              </ProtectedRoute>
            }
          />

          <Route
            path="/room-guidline-condition"
            element={
              <ProtectedRoute>
                <RoomGuidlineOrCondition />
              </ProtectedRoute>
            }
          />

          <Route
            path="/update-qr-code"
            element={
              <ProtectedRoute>
                <UpdateQrData />
              </ProtectedRoute>
            }
          />

          {/* Admins */}
          <Route
            path="/admins"
            element={
              <ProtectedRoute>
                <Admins />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/:id"
            element={
              <ProtectedRoute>
                <SingleAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/add"
            element={
              <ProtectedRoute>
                <AddAdmin />
              </ProtectedRoute>
            }
          />

          {/* Admins */}
          <Route
            path="/admin-api-logs"
            element={
              <ProtectedRoute>
                <AdminApiLogs />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin-bookingDates-configure"
            element={
              <ProtectedRoute>
                <AddOrUpdateBookingDate />
              </ProtectedRoute>
            }
          />

          {/* <Route
            path="/inbox"
            element={
              <ProtectedRoute>
                <Inbox />
              </ProtectedRoute>
            }
          /> */}
        </Routes>
        {/* Conditionally render Footer */}
        {/* {!isLoginPage && <Footer />} */}
        {!isExcludedPage && <Footer />}

      </Box>
    </Box>
  );
}

export default App;

