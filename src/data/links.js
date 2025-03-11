// import { AddCircle, Download, Gavel, Group, ListAlt, LocalOffer, NotificationsActive, QuestionAnswer, RestaurantMenu, School } from "@mui/icons-material";
// import { BsCurrencyDollar } from "react-icons/bs";
// import { FaHandshake, FaShare } from "react-icons/fa";
// import {
//   FiHome,
//   FiLayers,
//   FiMail,
//   FiMessageCircle,
//   FiSettings,
//   FiShoppingBag,
//   FiShoppingCart,
//   FiUser,
//   FiUsers,
// } from "react-icons/fi";
// import { MdEmojiEvents, MdBed, MdCategory, MdReceipt, MdAccountBalanceWallet, MdEvent, MdHotel, MdRoomService, MdLocalOffer, MdRestaurantMenu, MdNotificationsActive, MdGroup, MdGavel, MdSchool, MdDownload } from "react-icons/md";
// import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';

// // import NoteIcon from "../note.svg"

// export const links = [
//   {
//     name: "Dashboard",
//     icon: <FiHome />,
//     url: "/",
//   },
//   // MASTER DATA 
//   {
//     name: "Masters",
//     icon: <MdEmojiEvents />,
//     subLinks: [
//       {
//         name: "Members",
//         url: "/members",
//         icon: <MdEmojiEvents />,
//       },
//       {
//         name: "Departments",
//         url: "/departments",
//       },
//       {
//         name: "Designations",
//         url: "/designations",
//       },
//       {
//         name: "Restaurants",
//         url: "/restaurants",
//       },
//       {
//         name: "Amenities",
//         url: "/amenities",
//       },
//       {
//         name: "Tax Types",
//         url: "/taxTypes",
//       },
//       {
//         name: "Banquet Categories",
//         url: "/banquet-categories",
//       },
//       // {
//       //   name: "Banquets",
//       //   url: "/banquets",
//       // },
//       // {
//       //   name: "Banquet Bookings",
//       //   url: "/banquet-bookings",
//       // },
//       {
//         name: "Room Categories",
//         url: "/categories",
//       },
//       // {
//       //   name: "Rooms",
//       //   url: "/roomwith-categories",
//       // },
//       // {
//       //   name: "Room Bookings",
//       //   url: "/room-bookings",
//       // },
//       // {
//       //   name: "Billing",
//       //   url: "/billings",
//       // },
//       // {
//       //   name: "Transacation",
//       //   url: "/transactions",
//       // },
//       // {
//       //   name: "Booking Requests",
//       //   url: "/requests",
//       // },
//     ],
//   },
//   {
//     name: "Affiliated Clubs",
//     icon: <SportsSoccerIcon />,
//     subLinks: [
//       {
//         name: "All Affiliated Clubs",
//         url: "/affiliated-clubs",
//       },
//     ],
//   },
//   {
//     name: "Billings",
//     icon: <MdReceipt />,
//     subLinks: [
//       {
//         name: "Invoices",
//         url: "/billings",
//       },
//       {
//         name: "Transactions",
//         url: "/transactions",
//       },
//     ],
//   },
//   {
//     name: "Offline Billings",
//     icon: <MdAccountBalanceWallet />,
//     subLinks: [
//       {
//         name: "Monthly Bills",
//         url: "/monthly-billings",
//       },
//       {
//         name: "Monthly Bill Transactions",
//         url: "/monthly-bill-transactions",
//       },
//     ],
//   },
//   {
//     name: "Club Events",
//     icon: <MdEvent />,
//     subLinks: [
//       {
//         name: "All Events",
//         url: "/events",
//         icon: <MdEmojiEvents />,
//       },
//       {
//         name: "Event Bookings",
//         url: "bookings",
//       },
//     ],
//   },
//   {
//     name: "Room",
//     icon: <MdHotel />,
//     subLinks: [
//       {
//         name: "Rooms",
//         url: "/roomwith-categories",
//       },
//       {
//         name: "Room Bookings",
//         url: "/room-bookings",
//       },
//     ],
//   },
//   {
//     name: "Banquets",
//     icon: <MdRoomService />,
//     subLinks: [
//       {
//         name: "Banquets",
//         url: "/banquets",
//       },
//       {
//         name: "Banquet Bookings",
//         url: "/banquet-bookings",
//       },
//     ],
//   },
//   // {
//   //   name: "Room With Category",
//   //   icon: <MdBed />,
//   //   subLinks: [
//   //     {
//   //       name: "All Rooms",
//   //       url: "/roomwith-categories",
//   //     },
//   //     {
//   //       name: "Add Room",
//   //       url: "/roomwith-category/add",
//   //     },
//   //   ],
//   // },

//   // {
//   //   name: "Club Members",
//   //   icon: <FiUsers />,
//   //   subLinks: [
//   //     {
//   //       name: "All Members",
//   //       url: "/customers",
//   //     },
//   //     {
//   //       name: "Add Member",
//   //       url: "/member/add",
//   //     },
//   //   ],
//   // },

//   {
//     name: "Offers",
//     icon: <MdLocalOffer />,
//     subLinks: [
//       {
//         name: "All Offers",
//         url: "/offers",
//       },
//       // {
//       //   name: "Add Offer",
//       //   url: "/offer/add",
//       // },
//     ],
//   },
//   {
//     name: "Food & Beverages",
//     icon: <MdRestaurantMenu />, // Changed to a download-related icon
//     subLinks: [
//       {
//         name: "All Food & Beverages",
//         url: "/foodAndBeverages",
//       },
//       // {
//       //   name: "Add Food & Beverages",
//       //   url: "/foodAndBeverage/add",
//       // },
//     ],
//   },
//   {
//     name: "Club Notices",
//     icon: <MdNotificationsActive />, // Changed to a notifications-related icon
//     subLinks: [
//       {
//         name: "All Club Notice",
//         url: "/notices",
//       },
//       // {
//       //   name: "Add Club Notice",
//       //   url: "/notice/add",
//       // },
//     ],
//   },
//   // {
//   //   name: "Billing",
//   //   icon: <NotificationsActive />, // Changed to a notifications-related icon
//   //   subLinks: [
//   //     {
//   //       name: "All Bills",
//   //       url: "/bills",
//   //     },
//   //     {
//   //       name: "Add Bill",
//   //       url: "/bill/add",
//   //     },
//   //   ],
//   // },
//   {
//     name: "Consideration Of Membership's",
//     icon: <MdGroup />, // Changed to a download-related icon
//     subLinks: [
//       {
//         name: "All COM's",
//         url: "/coms",
//       },
//       // {
//       //   name: "Add COM",
//       //   url: "/com/add",
//       // },
//     ],
//   },

//   {
//     name: "Membership Waiting List",
//     icon: <MdGroup />, // Changed to a download-related icon
//     subLinks: [
//       {
//         name: "All Application List",
//         url: "/applications",
//       },
//       // {
//       //   name: "Add Member Application",
//       //   url: "/application/add",
//       // },
//     ],
//   },

//   {
//     name: "Club Rules & ByeLaws",
//     icon: <MdGavel />, // Icon for rules and byelaws
//     subLinks: [
//       {
//         name: "All Club Rules/ByeLaw",
//         url: "/allrulebyelaws",
//       },
//       // {
//       //   name: "All FAQs",
//       //   url: "/faqs",
//       // },
//       // {
//       //   name: "Add Club Rule & ByeLaw",
//       //   url: "/ruleByeLaw/add",
//       // },
//     ],
//   },
//   {
//     name: "General Committee",
//     icon: <MdGroup />, // Changed to a notifications-related icon
//     subLinks: [
//       {
//         name: "All General Committee Member",
//         url: "/gcms",
//       },
//       // {
//       //   name: "Add Committee Member",
//       //   url: "/gcm/add",
//       // },
//     ],
//   },

//   {
//     name: "Club HOD's",
//     icon: <MdSchool />, // Changed to a school-related icon
//     subLinks: [
//       {
//         name: "All HOD's",
//         url: "/hods",
//       },
//       // {
//       //   name: "Add HOD",
//       //   url: "/hod/add",
//       // },
//     ],
//   },
//   {
//     name: "Downloads",
//     icon: <MdDownload />, // Changed to a download-related icon
//     subLinks: [
//       {
//         name: "All Downloads",
//         url: "/downloads",
//       },
//       // {
//       //   name: "Add Download",
//       //   url: "/download/add",
//       // },
//     ],
//   },

//   // {
//   //   name: "FAQs",
//   //   icon: <QuestionAnswer />, // Icon for FAQs
//   //   subLinks: [
//   //     {
//   //       name: "All FAQs",
//   //       url: "/faqs",
//   //     },
//   //     {
//   //       name: "Add Club FAQs",
//   //       url: "/faq/add",
//   //     },
//   //   ],
//   // },

// {
//   name: "Settings",
//   icon: <FiSettings />,
//   url: "/settings",
// },
// // {
//   //   name: "Inbox",
//   //   icon: <FiMail />,
//   //   url: "/inbox",
//   // },
// ];


import {
  MdEmojiEvents,
  MdReceipt,
  MdAccountBalanceWallet,
  MdEvent,
  MdHotel,
  MdRoomService,
  MdLocalOffer,
  MdRestaurantMenu,
  MdNotificationsActive,
  MdGavel,
  MdSchool,
  MdDownload,
  MdCategory,
  MdBed,
  MdPeopleAlt,
  MdPending,
  MdNotificationAdd,
} from "react-icons/md";
import { FiHome, FiSettings } from "react-icons/fi";
import { FaHandshake } from "react-icons/fa";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";

const iconProps = { fontSize: "1.5rem" }; // Standardized icon size

export const links = [
  {
    name: "Dashboard",
    icon: <FiHome style={iconProps} />,
    subLinks: [
      {
        name: "Dashboard",
        url: "/",
        icon: <FiHome style={iconProps} />,
      },
    ]
  },
  // MASTER DATA
  {
    name: "Masters",
    icon: <MdEmojiEvents style={iconProps} />,
    subLinks: [
      {
        name: "Members",
        url: "/members",
        icon: <MdEmojiEvents style={iconProps} />,
      },
      {
        name: "Departments",
        url: "/departments",
        icon: <MdCategory style={iconProps} />,
      },
      {
        name: "Designations",
        url: "/designations",
        icon: <MdCategory style={iconProps} />,
      },
      {
        name: "Restaurants",
        url: "/restaurants",
        icon: <MdRestaurantMenu style={iconProps} />,
      },
      {
        name: "Amenities",
        url: "/amenities",
        icon: <MdRoomService style={iconProps} />,
      },
      {
        name: "Tax Types",
        url: "/taxTypes",
        icon: <MdReceipt style={iconProps} />,
      },
      {
        name: "Banquet Categories",
        url: "/banquet-categories",
        icon: <MdRoomService style={iconProps} />,
      },
      {
        name: "Room Categories",
        url: "/categories",
        icon: <MdBed style={iconProps} />,
      },
      {
        name: "Upload Data",
        url: "/upload-data",
        icon: <MdBed style={iconProps} />,
      },
      {
        name: "Update QR Data",
        url: "/update-qr-code",
        icon: <MdBed style={iconProps} />,
      },
    ],
  },
  {
    name: "Affiliated Clubs",
    icon: <SportsSoccerIcon style={iconProps} />,
    subLinks: [
      {
        name: "All Affiliated Clubs",
        url: "/affiliated-clubs",
        icon: <SportsSoccerIcon style={iconProps} />,
      },
    ],
  },
  {
    name: "Billings",
    icon: <MdReceipt style={iconProps} />,
    subLinks: [
      {
        name: "Invoices",
        url: "/billings",
        icon: <MdReceipt style={iconProps} />,
      },
      {
        name: "Transactions",
        url: "/transactions",
        icon: <MdAccountBalanceWallet style={iconProps} />,
      },
    ],
  },
  {
    name: "Monthly Billings",
    icon: <MdAccountBalanceWallet style={iconProps} />,
    subLinks: [
      {
        name: "Monthly Bills",
        url: "/monthly-billings",
        icon: <MdReceipt style={iconProps} />,
      },
      {
        name: "Monthly Bill Transactions",
        url: "/monthly-bill-transactions",
        icon: <MdAccountBalanceWallet style={iconProps} />,
      },
    ],
  },
  {
    name: "Club Events",
    icon: <MdEvent style={iconProps} />,
    subLinks: [
      {
        name: "All Events",
        url: "/events",
        icon: <MdEvent style={iconProps} />,
      },
      {
        name: "Event Bookings",
        url: "/bookings",
        icon: <MdReceipt style={iconProps} />,
      },
    ],
  },
  {
    name: "Room",
    icon: <MdHotel style={iconProps} />,
    subLinks: [
      {
        name: "Rooms",
        url: "/roomwith-categories",
        icon: <MdBed style={iconProps} />,
      },
      {
        name: "Room Bookings",
        url: "/room-bookings",
        icon: <MdReceipt style={iconProps} />,
      },
      {
        name: "Room Guidelines & Conditions",
        url: "/room-guidline-condition",
        icon: <MdReceipt style={iconProps} />,
      },
    ],
  },
  {
    name: "Banquets",
    icon: <MdRoomService style={iconProps} />,
    subLinks: [
      {
        name: "Banquets",
        url: "/banquets",
        icon: <MdRoomService style={iconProps} />,
      },
      {
        name: "Banquet Bookings",
        url: "/banquet-bookings",
        icon: <MdReceipt style={iconProps} />,
      },
    ],
  },
  {
    name: "Offers",
    icon: <MdLocalOffer style={iconProps} />,
    subLinks: [
      {
        name: "All Offers",
        url: "/offers",
        icon: <MdLocalOffer style={iconProps} />,
      },
    ],
  },
  {
    name: "Food & Beverages",
    icon: <MdRestaurantMenu style={iconProps} />,
    subLinks: [
      {
        name: "All Food & Beverages",
        url: "/foodAndBeverages",
        icon: <MdRestaurantMenu style={iconProps} />,
      },
    ],
  },
  {
    name: "Upcoming Events",
    icon: <MdNotificationsActive style={iconProps} />,
    subLinks: [
      {
        name: "All Upcoming Events",
        url: "/notices",
        icon: <MdNotificationsActive style={iconProps} />,
      },
    ],
  },
  {
    name: "Consideration Of Membership's",
    icon: <FaHandshake style={iconProps} />, // Represents agreement or decision-making
    subLinks: [
      {
        name: "All COM's",
        url: "/coms",
        icon: <FaHandshake style={iconProps} />,
      },
    ],
  },
  {
    name: "Membership Waiting List",
    icon: <MdPending style={iconProps} />, // Represents items in progress or waiting
    subLinks: [
      {
        name: "All Application List",
        url: "/applications",
        icon: <MdPending style={iconProps} />,
      },
    ],
  },
  {
    name: "Club Rules & ByeLaws",
    icon: <MdGavel style={iconProps} />,
    subLinks: [
      {
        name: "All Club Rules/ByeLaws",
        url: "/allrulebyelaws",
        icon: <MdGavel style={iconProps} />,
      },
    ],
  },
  {
    name: "General Committee",
    icon: <MdPeopleAlt style={iconProps} />, // Represents a team or committee
    subLinks: [
      {
        name: "All General Committee Members",
        url: "/gcms",
        icon: <MdPeopleAlt style={iconProps} />,
      },
    ],
  },
  {
    name: "Club HOD's",
    icon: <MdSchool style={iconProps} />,
    subLinks: [
      {
        name: "All HOD's",
        url: "/hods",
        icon: <MdSchool style={iconProps} />,
      },
    ],
  },
  {
    name: "Club Notice / Downloads",
    icon: <MdDownload style={iconProps} />,
    subLinks: [
      {
        name: "All Club Notice / Downloads",
        url: "/downloads",
        icon: <MdDownload style={iconProps} />,
      },
    ],
  },
  {
    name: "Notifications",
    icon: <MdNotificationAdd style={iconProps} />,
    subLinks: [
      {
        name: "All Notifications",
        url: "/notifications",
        icon: <MdNotificationAdd style={iconProps} />,
      },
    ],
  },
  {
    name: "Events Scanner",
    icon: <MdSchool style={iconProps} />,
    subLinks: [
      {
        name: "GateKeeper Events",
        url: "/gatekeeper/events",
        icon: <MdSchool style={iconProps} />,
      },
    ],
  },
  {
    name: "Settings",
    icon: <FiSettings style={iconProps} />,
    subLinks: [
      {
        name: "Admins & GateKeepers",
        url: "/admins",
        icon: <FiSettings style={iconProps} />,
      },
      {
        name: "Roles & Permissions",
        url: "/roles",
        icon: <FiSettings style={iconProps} />,
      },
      {
        name: "SMTP Setting",
        url: "/smtpSecret",
        icon: <FiSettings style={iconProps} />,
      },
      {
        name: "User Action Logs",
        url: "/user-action-logs",
        icon: <FiSettings style={iconProps} />,
      },
      {
        name: "Admin Action Logs",
        url: "/admin-action-logs",
        icon: <FiSettings style={iconProps} />,
      },
      {
        name: "Admin API Logs",
        url: "/admin-api-logs",
        icon: <FiSettings style={iconProps} />,
      },
      {
        name: "About Us",
        url: "/aboutUs",
        icon: <FiSettings style={iconProps} />,
      },
      {
        name: "Contact Us",
        url: "/contactUs",
        icon: <FiSettings style={iconProps} />,
      },
      {
        name: "Booking Date Setting",
        url: "/admin-bookingDates-configure",
        icon: <FiSettings style={iconProps} />,
      },
    ],
  },
];

