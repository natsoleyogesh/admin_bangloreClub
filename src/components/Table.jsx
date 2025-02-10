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
  isLoading
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
      state={{ isLoading }} // Pass the loading state here
      // renderTopToolbarCustomActions={() =>
      //   isLoading && (
      //     <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
      //       <CircularProgress />
      //     </Box>
      //   )
      // }
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
