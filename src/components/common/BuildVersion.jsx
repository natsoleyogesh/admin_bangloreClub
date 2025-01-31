// import React from "react";

// const BuildVersion = () => {
//     // Function to get current build version
//     const getBuildVersion = () => {
//         const now = new Date();
//         const day = String(now.getDate()).padStart(2, "0");
//         const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-based
//         const year = now.getFullYear();
//         const hours = String(now.getHours()).padStart(2, "0");
//         const minutes = String(now.getMinutes()).padStart(2, "0");
//         const seconds = String(now.getSeconds()).padStart(2, "0");

//         return `Ver. 2.0 Build: ${day}${month}${year}.${hours}${minutes}${seconds}`;
//     };

//     return (
//         <span style={{ fontSize: "9px" }}>
//             {getBuildVersion()}
//         </span>
//     );
// };

// export default BuildVersion;

import React from "react";
import { REACT_APP_BUILD_DATE, REACT_APP_BUILD_VERSION } from "../../api/config";

const BuildVersion = () => {
    const buildVersion = REACT_APP_BUILD_VERSION || "2.0";
    const buildDate = REACT_APP_BUILD_DATE || "Unknown";

    return (
        <span style={{ fontSize: "9px" }}>
            {`Ver. ${buildVersion} Build: ${buildDate}`}
        </span>
    );
};

export default BuildVersion;
