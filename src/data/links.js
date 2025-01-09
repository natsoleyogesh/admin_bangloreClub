import { AddCircle, Download, Gavel, Group, ListAlt, LocalOffer, NotificationsActive, QuestionAnswer, RestaurantMenu, School } from "@mui/icons-material";
import { BsCurrencyDollar } from "react-icons/bs";
import { FaHandshake, FaShare } from "react-icons/fa";
import {
  FiHome,
  FiLayers,
  FiMail,
  FiMessageCircle,
  FiSettings,
  FiShoppingBag,
  FiShoppingCart,
  FiUser,
  FiUsers,
} from "react-icons/fi";
import { MdEmojiEvents, MdBed, MdCategory } from "react-icons/md";

// import NoteIcon from "../note.svg"

export const links = [
  {
    name: "Dashboard",
    icon: <FiHome />,
    url: "/",
  },
  // MASTER DATA 
  {
    name: "Masters",
    icon: <MdEmojiEvents />,
    subLinks: [
      {
        name: "Members",
        url: "/members",
        icon: <MdEmojiEvents />,
      },
      {
        name: "Departments",
        url: "/departments",
      },
      {
        name: "Restaurants",
        url: "/restaurants",
      },
      {
        name: "Amenities",
        url: "/amenities",
      },
      {
        name: "Tax Types",
        url: "/taxTypes",
      },
      {
        name: "Banquet Categories",
        url: "/banquet-categories",
      },
      // {
      //   name: "Banquets",
      //   url: "/banquets",
      // },
      // {
      //   name: "Banquet Bookings",
      //   url: "/banquet-bookings",
      // },
      {
        name: "Room Categories",
        url: "/categories",
      },
      // {
      //   name: "Rooms",
      //   url: "/roomwith-categories",
      // },
      // {
      //   name: "Room Bookings",
      //   url: "/room-bookings",
      // },
      // {
      //   name: "Billing",
      //   url: "/billings",
      // },
      // {
      //   name: "Transacation",
      //   url: "/transactions",
      // },
      // {
      //   name: "Booking Requests",
      //   url: "/requests",
      // },
    ],
  },
  {
    name: "Billings",
    icon: <MdEmojiEvents />,
    subLinks: [
      {
        name: "Invoices",
        url: "/billings",
      },
      {
        name: "Transactions",
        url: "/transactions",
      },
    ],
  },
  {
    name: "Club Events",
    icon: <MdEmojiEvents />,
    subLinks: [
      {
        name: "All Events",
        url: "/events",
        icon: <MdEmojiEvents />,
      },
      // {
      //   name: "Add Event",
      //   url: "/events/add",
      // },
      {
        name: "Event Bookings",
        url: "bookings",
      },
    ],
  },
  {
    name: "Room",
    icon: <MdCategory />,
    subLinks: [
      {
        name: "Rooms",
        url: "/roomwith-categories",
      },
      {
        name: "Room Bookings",
        url: "/room-bookings",
      },
    ],
  },
  {
    name: "Banquets",
    icon: <MdEmojiEvents />,
    subLinks: [
      {
        name: "Banquets",
        url: "/banquets",
      },
      {
        name: "Banquet Bookings",
        url: "/banquet-bookings",
      },
    ],
  },
  // {
  //   name: "Room With Category",
  //   icon: <MdBed />,
  //   subLinks: [
  //     {
  //       name: "All Rooms",
  //       url: "/roomwith-categories",
  //     },
  //     {
  //       name: "Add Room",
  //       url: "/roomwith-category/add",
  //     },
  //   ],
  // },

  // {
  //   name: "Club Members",
  //   icon: <FiUsers />,
  //   subLinks: [
  //     {
  //       name: "All Members",
  //       url: "/customers",
  //     },
  //     {
  //       name: "Add Member",
  //       url: "/member/add",
  //     },
  //   ],
  // },

  {
    name: "Offers",
    icon: <LocalOffer />,
    subLinks: [
      {
        name: "All Offers",
        url: "/offers",
      },
      // {
      //   name: "Add Offer",
      //   url: "/offer/add",
      // },
    ],
  },
  {
    name: "Food & Beverages",
    icon: <RestaurantMenu />, // Changed to a download-related icon
    subLinks: [
      {
        name: "All Food & Beverages",
        url: "/foodAndBeverages",
      },
      // {
      //   name: "Add Food & Beverages",
      //   url: "/foodAndBeverage/add",
      // },
    ],
  },
  {
    name: "Club Notices",
    icon: <NotificationsActive />, // Changed to a notifications-related icon
    subLinks: [
      {
        name: "All Club Notice",
        url: "/notices",
      },
      // {
      //   name: "Add Club Notice",
      //   url: "/notice/add",
      // },
    ],
  },
  // {
  //   name: "Billing",
  //   icon: <NotificationsActive />, // Changed to a notifications-related icon
  //   subLinks: [
  //     {
  //       name: "All Bills",
  //       url: "/bills",
  //     },
  //     {
  //       name: "Add Bill",
  //       url: "/bill/add",
  //     },
  //   ],
  // },
  {
    name: "Consideration Of Membership's",
    icon: <Group />, // Changed to a download-related icon
    subLinks: [
      {
        name: "All COM's",
        url: "/coms",
      },
      // {
      //   name: "Add COM",
      //   url: "/com/add",
      // },
    ],
  },

  {
    name: "MemberShip Waiting List",
    icon: <Group />, // Changed to a download-related icon
    subLinks: [
      {
        name: "All Application List",
        url: "/applications",
      },
      // {
      //   name: "Add Member Application",
      //   url: "/application/add",
      // },
    ],
  },

  {
    name: "Club Rules & ByeLaws",
    icon: <Gavel />, // Icon for rules and byelaws
    subLinks: [
      {
        name: "All Club Rules/ByeLaw",
        url: "/allrulebyelaws",
      },
      // {
      //   name: "All FAQs",
      //   url: "/faqs",
      // },
      // {
      //   name: "Add Club Rule & ByeLaw",
      //   url: "/ruleByeLaw/add",
      // },
    ],
  },
  {
    name: "General Committee",
    icon: <Group />, // Changed to a notifications-related icon
    subLinks: [
      {
        name: "All General Committee Member",
        url: "/gcms",
      },
      // {
      //   name: "Add Committee Member",
      //   url: "/gcm/add",
      // },
    ],
  },

  {
    name: "Club HOD's",
    icon: <School />, // Changed to a school-related icon
    subLinks: [
      {
        name: "All HOD's",
        url: "/hods",
      },
      // {
      //   name: "Add HOD",
      //   url: "/hod/add",
      // },
    ],
  },
  {
    name: "Downloads",
    icon: <Download />, // Changed to a download-related icon
    subLinks: [
      {
        name: "All Downloads",
        url: "/downloads",
      },
      // {
      //   name: "Add Download",
      //   url: "/download/add",
      // },
    ],
  },

  // {
  //   name: "FAQs",
  //   icon: <QuestionAnswer />, // Icon for FAQs
  //   subLinks: [
  //     {
  //       name: "All FAQs",
  //       url: "/faqs",
  //     },
  //     {
  //       name: "Add Club FAQs",
  //       url: "/faq/add",
  //     },
  //   ],
  // },

  // {
  //   name: "Settings",
  //   icon: <FiSettings />,
  //   url: "/settings",
  // },
  // {
  //   name: "Inbox",
  //   icon: <FiMail />,
  //   url: "/inbox",
  // },
];
