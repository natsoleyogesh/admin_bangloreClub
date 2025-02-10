// import styled from "@emotion/styled";
// import { Box, Grid, Paper, Typography } from "@mui/material";
// import React from "react";
// import BarChart from "../components/home/charts/BarChart";
// import Stats from "../components/home/stats/Stats";
// import TopCountries from "../components/home/TopCountries";
// import TransactionCustomer from "../components/home/TransactionCustomer";
// import Table from "../components/Table";
// import { orders, ordersColumns } from "../data/orders";
// import Transactions from "./Transaction/Transactions";
// import AllRequests from "./Requests/AllRequests";

// const Dashboard = () => {
//   const ComponentWrapper = styled(Box)({
//     marginTop: "10px",
//     paddingBottom: "10px",
//   });

//   return (
//     <Box sx={{ pt: "80px", pb: "20px" }}>
//       <Typography variant="h6" sx={{ marginBottom: "14px" }}>
//         Dashboard
//       </Typography>
//       <ComponentWrapper>
//         <Stats />
//       </ComponentWrapper>

//       <ComponentWrapper>
//         <Grid container spacing={3}>
//           <Grid item xs={12} md={6} lg={8}>
//             {/* <BarChart /> */}
//           </Grid>
//           <Grid item xs={12} md={6} lg={4}>
//             <Paper
//               sx={{
//                 boxShadow: "none !important",
//                 borderRadius: "12px",
//                 borderStyle: "solid",
//                 borderWidth: "1px",
//                 borderColor: "divider",
//                 height: "100%",
//               }}
//             >
//               {/* <TopCountries /> */}
//             </Paper>
//           </Grid>
//         </Grid>
//       </ComponentWrapper>
//       <ComponentWrapper>
//         {/* <TransactionCustomer /> */}
//         {/* <Transactions /> */}
//       </ComponentWrapper>

//       <ComponentWrapper>
//         {/* <Typography variant="h5" sx={{ my: 3 }}>
//           Latest Orders
//         </Typography>
//         <Table
//           data={orders}
//           fields={ordersColumns}
//           numberOfRows={5}
//           enableTopToolBar={false}
//           enableBottomToolBar={false}
//           enablePagination={false}
//           enableRowSelection={false}
//           enableColumnFilters={false}
//           enableEditing={false}
//           enableColumnDragging={false}
//         /> */}
//         <AllRequests />
//       </ComponentWrapper>
//     </Box>
//   );
// };

// export default Dashboard;


import styled from "@emotion/styled";
import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Stats from "../components/home/stats/Stats";

import AllRequests from "./Requests/AllRequests";
import { fetchDashBoardSales } from "../api/masterData/dashboard";

const Dashboard = () => {
  const ComponentWrapper = styled(Box)({
    marginTop: "10px",
    paddingBottom: "10px",
  });

  const [totalSales, setTotalSales] = useState({ Room: 0, Banquet: 0, Event: 0 });

  // Fetch total sales data
  const fetchTotalSales = async () => {
    try {
      const response = await fetchDashBoardSales();
      setTotalSales(response.data.data);
    } catch (error) {
      console.error("Failed to fetch total sales data:", error);
    }
  };

  useEffect(() => {
    fetchTotalSales();
  }, []);

  return (
    <Box sx={{ pt: "80px", pb: "20px" }}>
      <Typography variant="h6" sx={{ marginBottom: "14px" }}>
        Dashboard
      </Typography>
      <ComponentWrapper>
        <Stats totalSales={totalSales} />
      </ComponentWrapper>

      <ComponentWrapper>
        <AllRequests />
      </ComponentWrapper>
    </Box>
  );
};

export default Dashboard;



