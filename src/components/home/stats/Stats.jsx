// import styled from "@emotion/styled";
// import { Box, Grid, IconButton, Paper, Typography } from "@mui/material";
// import React from "react";
// import { lineChartData, lineChartOptions } from "../../../data/chartData";
// import { stats } from "../../../data/stats";
// import LineChart from "../charts/LineChart";

// const Stats = () => {
//   const Item = styled(Paper)({
//     padding: "5px 10px",
//     borderRadius: "12px",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//   });

//   return (
//     <Grid container spacing={2}>
//       {stats.map(
//         ({ id, title, amount, icon, iconBg, iconColor, isMoney }, i) => (
//           <Grid
//             item
//             xs={12}
//             sm={i === stats.length - 1 ? 12 : 6}
//             lg={4}
//             key={id}
//           >
//             <Item
//               sx={{
//                 borderStyle: "solid",
//                 borderWidth: "1px",
//                 borderColor: "divider",
//               }}
//             >
//               <Box sx={{ flex: 1 }}>
//                 <IconButton
//                   sx={{ background: `${iconBg} !important`, color: iconColor }}
//                 >
//                   {icon}
//                 </IconButton>
//                 <Typography variant="h4" sx={{ my: 2 }}>
//                   {`${isMoney ? "$" + amount : amount}`}
//                 </Typography>
//                 <Typography sx={{ opacity: 0.7 }}>{title}</Typography>
//               </Box>
//               <Box sx={{ flex: 1 }}>
//                 <LineChart
//                   chartOptions={lineChartOptions}
//                   chartData={lineChartData}
//                 />
//               </Box>
//             </Item>
//           </Grid>
//         )
//       )}
//     </Grid>
//   );
// };

// export default Stats;

import styled from "@emotion/styled";
import { Box, Grid, IconButton, Paper, Typography } from "@mui/material";
import React from "react";
import LineChart from "../charts/LineChart";

const Stats = ({ totalSales }) => {
  const Item = styled(Paper)({
    padding: "5px 10px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  });

  const statsData = [
    {
      id: "room",
      title: "Room Sales",
      amount: totalSales.Room,
      icon: "🏨", // Replace with a proper icon
      iconBg: "#3f51b5",
      iconColor: "#ffffff",
      isMoney: true,
      chartData: [{ name: "Sales", data: [totalSales.Room] }],
      chartOptions: {
        chart: { id: "room-sales" },
        xaxis: { categories: ["Room"] },
      },
    },
    {
      id: "banquet",
      title: "Banquet Sales",
      amount: totalSales.Banquet,
      icon: "🍴", // Replace with a proper icon
      iconBg: "#ff9800",
      iconColor: "#ffffff",
      isMoney: true,
      chartData: [{ name: "Sales", data: [totalSales.Banquet] }],
      chartOptions: {
        chart: { id: "banquet-sales" },
        xaxis: { categories: ["Banquet"] },
      },
    },
    {
      id: "event",
      title: "Event Sales",
      amount: totalSales.Event,
      icon: "🎉", // Replace with a proper icon
      iconBg: "#4caf50",
      iconColor: "#ffffff",
      isMoney: true,
      chartData: [{ name: "Sales", data: [totalSales.Event] }],
      chartOptions: {
        chart: { id: "event-sales" },
        xaxis: { categories: ["Event"] },
      },
    },
  ];

  return (
    <Grid container spacing={2}>
      {statsData.map(
        ({ id, title, amount, icon, iconBg, iconColor, isMoney, chartData, chartOptions }, i) => (
          <Grid
            item
            xs={12}
            sm={i === statsData.length - 1 ? 12 : 6}
            lg={4}
            key={id}
          >
            <Item
              sx={{
                borderStyle: "solid",
                borderWidth: "1px",
                borderColor: "divider",
              }}
            >
              <Box sx={{ flex: 1 }}>
                <IconButton
                  sx={{ background: `${iconBg} !important`, color: iconColor }}
                >
                  {icon}
                </IconButton>
                <Typography variant="h4" sx={{ my: 2 }}>
                  {`${isMoney ? "₹" + amount : amount}`}
                </Typography>
                <Typography sx={{ opacity: 0.7 }}>{title}</Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                {/* <LineChart
                  chartOptions={chartOptions}
                  chartData={chartData}
                /> */}
              </Box>
            </Item>
          </Grid>
        )
      )}
    </Grid>
  );
};

export default Stats;

