import { PUBLIC_API_URI } from "../../api/config";
import { links } from "../../data/links";
import axios from "axios";

// export const fetchUserRole = async () => {
//     const token = localStorage.getItem("token");
//     console.log(token, "token")
//     if (!token) return null;

//     try {
//         const response = await axios.get(`${PUBLIC_API_URI}/admin-deails`, {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//         });
//         if (response.status === 200 && response.data.admin) {
//             return response.data.admin.role; // e.g., "admin", "user"
//         }
//     } catch (error) {
//         console.error("Error fetching user role", error);
//     }
//     return null;
// };

// export const filterLinksByRole = (role) => {
//     if (!role) return [];

//     return links.filter((link) => {
//         const isAuthorized = !link.roles || link.roles.includes(role);
//         if (link.subLinks) {
//             link.subLinks = link.subLinks.filter(
//                 (subLink) => !subLink.roles || subLink.roles.includes(role)
//             );
//         }
//         return isAuthorized;
//     });
// };


export const fetchUserRole = async () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        const response = await axios.get(`${PUBLIC_API_URI}/admin-deails`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.status === 200 && response.data.admin) {
            return response.data.admin.role; // e.g., "admin", "user"
        }
    } catch (error) {
        console.error("Error fetching user role", error);
    }
    return null;
};

// export const filterLinksByRole = (role) => {
//     if (!role) return [];

//     return links
//         .filter((link) => {
//             // Filter top-level links based on roles
//             console.log(link, "lin")
//             const isAuthorizedLink = !link.roles || link.roles.includes(role);

//             console.log(isAuthorizedLink, link.roles, "isAuth")
//             // If subLinks exist, filter them based on roles
//             if (link.subLinks && !isAuthorizedLink) {
//                 link.subLinks = link.subLinks.filter(
//                     (subLink) => !subLink.roles || subLink.roles.includes(role)
//                 );
//             }
//             console.log(isAuthorizedLink, link.roles, link.subLinks, "isAuth")
//             // Include the link if it's authorized or has any authorized subLinks
//             return !isAuthorizedLink || (link.subLinks && link.subLinks.length > 0);
//         });
// };

export const filterLinksByRole = (role) => {
    if (!role) return []; // Return empty if no role is provided

    return links
        .filter((link) => {
            const isAuthorizedLink = !link.roles || link.roles.includes(role);
            console.log(`Link: ${link.name}, Authorized: ${isAuthorizedLink}`);

            if (link.subLinks) {
                link.subLinks = link.subLinks.filter((subLink) => {
                    const isSubLinkAuthorized = !subLink.roles || subLink.roles.includes(role);
                    console.log(`  SubLink: ${subLink.name}, Authorized: ${isSubLinkAuthorized}`);
                    return isSubLinkAuthorized;
                });
            }

            return isAuthorizedLink || (link.subLinks && link.subLinks.length > 0);
        });
};
