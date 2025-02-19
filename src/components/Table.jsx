/* eslint-disable no-restricted-globals */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useMemo, useState } from "react";
import MaterialReactTable from "material-react-table";
import { IconButton, Tooltip } from "@mui/material";
import { FiEye, FiTrash } from "react-icons/fi";
import { Box } from "@mui/system";
import { Link } from "react-router-dom";

export const Table = ({
  data,
  fields,
  numberOfRows,
  enableTopToolBar,
  enableBottomToolBar,
  enablePagination,
  enableRowSelection,
  enableColumnFilters,
  enableEditing,
  enableColumnDragging,
  showPreview,
  routeLink,
  handleDelete, // New prop for delete handler
  isLoading,
  pagination = { page: 1, pageSize: 10, totalPages: 1, totalRecords: 0, onPageChange: () => { }, onPageSizeChange: () => { } }
}) => {
  console.log(fields, "fields")
  const columns = useMemo(() => fields, []);
  console.log(data, "data")
  const [tableData, setTableData] = useState(() => data);
  console.log(tableData, "tabledat")

  // const handleDeleteRow = useCallback(
  //   (row) => {
  //     if (!confirm("Are you sure you want to delete")) {
  //       return;
  //     }
  //     data.splice(row.index, 1);
  //     setTableData([...tableData]);
  //   },
  //   [tableData]
  // );

  return (
    <MaterialReactTable
      columns={columns}
      data={data.slice(0, numberOfRows)}
      getRowId={(row) => row._id}
      enableEditing={enableEditing}
      enableColumnDragging={enableColumnDragging}
      enableColumnOrdering
      // enableRowSelection={enableRowSelection}
      enableColumnFilters={enableColumnFilters}
      enablePagination={enablePagination}
      enableBottomToolbar={enableBottomToolBar}
      enableTopToolbar={enableTopToolBar}
      // state={{ isLoading }} // Pass the loading state here
      // renderTopToolbarCustomActions={() =>
      //   isLoading && (
      //     <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
      //       <CircularProgress />
      //     </Box>
      //   )
      // }
      state={{
        isLoading,
        pagination: {
          pageIndex: !isNaN(pagination.page) && pagination.page > 0 ? pagination.page - 1 : 0, // Ensure page is always valid
          pageSize: !isNaN(pagination.pageSize) && pagination.pageSize > 0 ? pagination.pageSize : 10, // Default page size to 10
        },
      }}

      manualPagination
      rowCount={pagination.totalRecords}
      onPaginationChange={(paginationData) => {
        console.log("Pagination Data Received:", paginationData);

        // If paginationData is a function, execute it with a dummy state to get the actual data
        if (typeof paginationData === "function") {
          console.warn("onPaginationChange received a function instead of an object!");
          paginationData = paginationData({ pageIndex: pagination.page - 1, pageSize: pagination.pageSize });
        }

        if (!paginationData || typeof paginationData !== "object") {
          console.error("Invalid pagination data received:", paginationData);
          return;
        }

        let { pageIndex, pageSize } = paginationData;

        if (typeof pageIndex === "undefined") {
          console.warn("pageIndex is undefined! Using default 0");
          pageIndex = 0;
        }

        if (typeof pageSize === "undefined") {
          console.warn("pageSize is undefined! Using default 10");
          pageSize = 10;
        }

        console.log("Final Page Index:", pageIndex);
        console.log("Final Page Size:", pageSize);

        if (!isNaN(pageIndex) && pageIndex >= 0) {
          pagination.onPageChange(pageIndex + 1);
        } else {
          console.warn("Invalid page index received:", pageIndex);
        }

        if (!isNaN(pageSize) && pageSize > 0) {
          pagination.onPageSizeChange(pageSize);
        } else {
          console.warn("Invalid page size received:", pageSize);
        }
      }}
      renderRowActions={({ row }) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>

          {(routeLink && handleDelete) && (< Tooltip arrow placement="right" title="Delete">
            <IconButton color="error" onClick={() => handleDelete(row.original)}>
              <FiTrash />
            </IconButton>
          </Tooltip>)}
          {showPreview && routeLink && (
            <Tooltip arrow placement="right" title="View">
              <Link to={`/${routeLink}/${row.id}`}>
                <IconButton>
                  <FiEye />
                </IconButton>
              </Link>
            </Tooltip>
          )}
        </Box >
      )}
      muiTableBodyRowProps={{ hover: false }}
      muiTablePaperProps={{
        sx: {
          padding: "20px",
          borderRadius: "15px",
          borderStyle: "solid",
          borderWidth: "1px",
          borderColor: "divider",
        },
      }}
      muiTableContainerProps={{
        sx: { borderRadius: "15px" },
      }}
      muiTableHeadCellProps={{
        sx: {
          fontSize: "14px",
          fontWeight: "bold",
        },
      }}
      muiTableHeadProps={{
        sx: {
          "& tr th": {
            borderWidth: "1px",
            borderColor: "divider",
            borderStyle: "solid",
          },
        },
      }}
      muiTableBodyProps={{
        sx: {
          "& tr td": {
            borderWidth: "1px",
            borderColor: "divider",
            borderStyle: "solid",
          },
        },
      }}
    />
  );
};

export default Table;




// import React, { useMemo } from "react";
// import MaterialReactTable from "material-react-table";
// import { IconButton, Tooltip, Box } from "@mui/material";
// import { FiEye, FiTrash } from "react-icons/fi";
// import { Link } from "react-router-dom";

// const Table = ({
//   data = [],
//   fields = [],
//   enableTopToolBar = true,
//   enableBottomToolBar = true,
//   enablePagination = true,
//   enableColumnFilters = true,
//   enableColumnDragging = true,
//   enableEditing = false,
//   isLoading = false,
//   routeLink = "",
//   handleDelete = null,
//   pagination = { page: 1, pageSize: 10, totalPages: 1, totalRecords: 0, onPageChange: () => { }, onPageSizeChange: () => { } }
// }) => {
//   const columns = useMemo(() => fields, [fields]);
//   console.log(pagination, "pagination")
//   return (
//     <MaterialReactTable
//       columns={columns}
//       data={data}
//       enableEditing={enableEditing}
//       enableColumnDragging={enableColumnDragging}
//       enableColumnFilters={enableColumnFilters}
//       enablePagination={enablePagination}
//       enableBottomToolbar={enableBottomToolBar}
//       enableTopToolbar={enableTopToolBar}
//       // state={{ isLoading, pagination: { pageIndex: pagination.page - 1, pageSize: pagination.pageSize } }}
//       state={{
//         isLoading,
//         pagination: {
//           pageIndex: !isNaN(pagination.page) && pagination.page > 0 ? pagination.page - 1 : 0, // Ensure page is always valid
//           pageSize: !isNaN(pagination.pageSize) && pagination.pageSize > 0 ? pagination.pageSize : 10, // Default page size to 10
//         },
//       }}

//       manualPagination
//       rowCount={pagination.totalRecords}
//       onPaginationChange={(paginationData) => {
//         console.log("Pagination Data Received:", paginationData);

//         // If paginationData is a function, execute it with a dummy state to get the actual data
//         if (typeof paginationData === "function") {
//           console.warn("onPaginationChange received a function instead of an object!");
//           paginationData = paginationData({ pageIndex: pagination.page - 1, pageSize: pagination.pageSize });
//         }

//         if (!paginationData || typeof paginationData !== "object") {
//           console.error("Invalid pagination data received:", paginationData);
//           return;
//         }

//         let { pageIndex, pageSize } = paginationData;

//         if (typeof pageIndex === "undefined") {
//           console.warn("pageIndex is undefined! Using default 0");
//           pageIndex = 0;
//         }

//         if (typeof pageSize === "undefined") {
//           console.warn("pageSize is undefined! Using default 10");
//           pageSize = 10;
//         }

//         console.log("Final Page Index:", pageIndex);
//         console.log("Final Page Size:", pageSize);

//         if (!isNaN(pageIndex) && pageIndex >= 0) {
//           pagination.onPageChange(pageIndex + 1);
//         } else {
//           console.warn("Invalid page index received:", pageIndex);
//         }

//         if (!isNaN(pageSize) && pageSize > 0) {
//           pagination.onPageSizeChange(pageSize);
//         } else {
//           console.warn("Invalid page size received:", pageSize);
//         }
//       }}



//       muiTableBodyRowProps={{ hover: false }}
//       muiTablePaperProps={{
//         sx: {
//           padding: "20px",
//           borderRadius: "15px",
//           borderStyle: "solid",
//           borderWidth: "1px",
//           borderColor: "divider",
//         },
//       }}
//       muiTableContainerProps={{
//         sx: { borderRadius: "15px" },
//       }}
//       muiTableHeadCellProps={{
//         sx: {
//           fontSize: "14px",
//           fontWeight: "bold",
//         },
//       }}
//       muiTableHeadProps={{
//         sx: {
//           "& tr th": {
//             borderWidth: "1px",
//             borderColor: "divider",
//             borderStyle: "solid",
//           },
//         },
//       }}
//       muiTableBodyProps={{
//         sx: {
//           "& tr td": {
//             borderWidth: "1px",
//             borderColor: "divider",
//             borderStyle: "solid",
//           },
//         },
//       }}
//       renderRowActions={({ row }) => (
//         <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//           {handleDelete && (
//             <Tooltip arrow placement="right" title="Delete">
//               <IconButton color="error" onClick={() => handleDelete(row.original)}>
//                 <FiTrash />
//               </IconButton>
//             </Tooltip>
//           )}
//           {routeLink && (
//             <Tooltip arrow placement="right" title="View">
//               <Link to={`/${routeLink}/${row._id}`}>
//                 <IconButton>
//                   <FiEye />
//                 </IconButton>
//               </Link>
//             </Tooltip>
//           )}
//         </Box>
//       )}
//     />
//   );
// };

// export default Table;

// import React, { useMemo } from "react";
// import MaterialReactTable from "material-react-table";
// import { IconButton, Tooltip, Box } from "@mui/material";
// import { FiEye, FiTrash } from "react-icons/fi";
// import { Link } from "react-router-dom";

// const Table = ({
//   data = [],
//   fields = [],
//   enableTopToolBar = true,
//   enableBottomToolBar = true,
//   enablePagination = true,
//   enableColumnFilters = true,
//   enableColumnDragging = true,
//   enableEditing = false,
//   isLoading = false,
//   routeLink = "",
//   handleDelete = null,
//   pagination = { page: 1, pageSize: 10, totalPages: 1, totalRecords: 0, onPageChange: () => { }, onPageSizeChange: () => { } }
// }) => {
//   const columns = useMemo(() => fields, [fields]);
//   console.log(pagination, "pagination")
//   return (
//     <MaterialReactTable
//       columns={columns}
//       data={data}
//       enableEditing={enableEditing}
//       enableColumnDragging={enableColumnDragging}
//       enableColumnFilters={enableColumnFilters}
//       enablePagination={enablePagination}
//       enableBottomToolbar={enableBottomToolBar}
//       enableTopToolbar={enableTopToolBar}
//       state={{ isLoading, pagination: { pageIndex: pagination.page - 1 || 0, pageSize: pagination.pageSize || 10 } }}
//       manualPagination
//       rowCount={pagination.totalRecords || 0}
//       onPaginationChange={(paginationState) => {
//         const { pageIndex, pageSize } = paginationState;
//         if (pageIndex !== undefined && pageSize !== undefined) {
//           pagination.onPageChange(pageIndex + 1);
//           pagination.onPageSizeChange(pageSize);
//         }
//       }}
//       muiTableBodyRowProps={{ hover: false }}
//       muiTablePaperProps={{
//         sx: {
//           padding: "20px",
//           borderRadius: "15px",
//           borderStyle: "solid",
//           borderWidth: "1px",
//           borderColor: "divider",
//         },
//       }}
//       muiTableContainerProps={{
//         sx: { borderRadius: "15px" },
//       }}
//       muiTableHeadCellProps={{
//         sx: {
//           fontSize: "14px",
//           fontWeight: "bold",
//         },
//       }}
//       muiTableHeadProps={{
//         sx: {
//           "& tr th": {
//             borderWidth: "1px",
//             borderColor: "divider",
//             borderStyle: "solid",
//           },
//         },
//       }}
//       muiTableBodyProps={{
//         sx: {
//           "& tr td": {
//             borderWidth: "1px",
//             borderColor: "divider",
//             borderStyle: "solid",
//           },
//         },
//       }}
//       renderRowActions={({ row }) => (
//         <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//           {handleDelete && (
//             <Tooltip arrow placement="right" title="Delete">
//               <IconButton color="error" onClick={() => handleDelete(row.original)}>
//                 <FiTrash />
//               </IconButton>
//             </Tooltip>
//           )}
//           {routeLink && (
//             <Tooltip arrow placement="right" title="View">
//               <Link to={`/${routeLink}/${row.id}`}>
//                 <IconButton>
//                   <FiEye />
//                 </IconButton>
//               </Link>
//             </Tooltip>
//           )}
//         </Box>
//       )}
//     />
//   );
// };

// export default Table;


// import React, { useEffect, useState, useMemo } from "react";
// import { Table as AntTable } from "antd";
// import { IconButton, Tooltip, Box, Avatar } from "@mui/material";
// import { FiEye, FiTrash } from "react-icons/fi";
// import { Link } from "react-router-dom";

// export const Table = ({
//   data,
//   fields,
//   enablePagination,
//   showPreview,
//   routeLink,
//   handleDelete,
//   isLoading,
//   pagination,
// }) => {
//   const columns = useMemo(() => {
//     const mappedFields = fields.map((field) => ({
//       title: field.header,
//       dataIndex: field.accessorKey,
//       key: field.accessorKey,
//       render: (text, record) => {
//         if (field.accessorKey === "profilePicture") {
//           return (
//             <Avatar
//               src={record[field.accessorKey] || "/default-avatar.png"}
//               alt="Profile"
//               sx={{ width: 30, height: 30 }}
//             />
//           );
//         }
//         return text || "N/A";
//       },
//     }));

//     // Ensure actions column exists
//     mappedFields.push({
//       title: "Actions",
//       key: "actions",
//       render: (_, record) => (
//         <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//           {handleDelete && (
//             <Tooltip arrow placement="right" title="Delete">
//               <IconButton color="error" onClick={() => handleDelete(record)}>
//                 <FiTrash />
//               </IconButton>
//             </Tooltip>
//           )}
//           {showPreview && routeLink && (
//             <Tooltip arrow placement="right" title="View">
//               <Link to={`/${routeLink}/${record._id}`}>
//                 <IconButton>
//                   <FiEye />
//                 </IconButton>
//               </Link>
//             </Tooltip>
//           )}
//         </Box>
//       ),
//     });

//     return mappedFields;
//   }, [fields, handleDelete, routeLink, showPreview]);

//   const [page, setPage] = useState(pagination?.page || 1);
//   const [pageSize, setPageSize] = useState(pagination?.pageSize || 10);

//   useEffect(() => {
//     if (pagination?.onPageChange) pagination.onPageChange(page);
//     if (pagination?.onPageSizeChange) pagination.onPageSizeChange(pageSize);
//   }, [page, pageSize, pagination]);

//   return (
//     <AntTable
//       columns={columns}
//       dataSource={data}
//       rowKey="_id"
//       pagination={enablePagination ? {
//         current: page,
//         pageSize: pageSize,
//         total: pagination?.totalRecords || 0,
//         onChange: (newPage, newPageSize) => {
//           setPage(newPage);
//           setPageSize(newPageSize);
//         },
//       } : false}
//       loading={isLoading}
//     />
//   );
// };

// export default Table;
