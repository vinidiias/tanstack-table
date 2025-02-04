import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { rankItem } from "@tanstack/match-sorter-utils";
import styles from "./BasicTable.module.css";
import { useState } from "react";

const fuzzyFilter = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

const BasicTable = ({ data, columns, pageSize }) => {
   // Define states for global filtering and sorting
   const [globalFilter, setGlobalFilter] = useState("");
   const [sorting, setSorting] = useState([]);
   const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: pageSize,
   })
  // Create the table instance
  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter, // Register the fuzzy filter for global use
    },
    state: {
      globalFilter, // Manage the global filter state
      sorting, // Manage the sorting state
      pagination,
    },
    onGlobalFilterChange: setGlobalFilter, // Update global filter on changes
    globalFilterFn: "fuzzy", // Use fuzzy filter globally
    onSortingChange: setSorting, // Handle sorting state changes
    onPaginationChange: setPagination, // Handle pagination state changes
    getCoreRowModel: getCoreRowModel(), // Base row model
    getFilteredRowModel: getFilteredRowModel(), // Enable filtering
    getPaginationRowModel: getPaginationRowModel(), // Enable pagination
    getSortedRowModel: getSortedRowModel(), // Enable sorting
  });

  const isRowHighlighted = (row) => { 
    const price = row.original.price; 
    return price > 150; // Highlight rows where price > 100 
  };

  return (
    <div>
      {/* Input field for global search */}
      <input
        type="text"
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        placeholder="Search..."
        style={{ marginBottom: "10px", padding: "5px", width: "100%" }}
      />
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  onClick={header.column.getToggleSortingHandler()} // Click handler for column sorting
                  style={{
                    cursor: header.column.getCanSort() ? "pointer" : "default",
                  }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  {{
                    asc: " 🔼", // Ascending indicator
                    desc: " 🔽", // Descending indicator
                  }[header.column.getIsSorted()] ?? null}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              style={{
                backgroundColor: isRowHighlighted(row) ? "#ffeb3b" : "inherit", // Highlight rows conditionally
              }}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: "10px" }}>
        {/* Pagination controls */}
        <button
          onClick={() => table.previousPage()} // Go to the previous page
          disabled={!table.getCanPreviousPage()} // Disable if on the first page
        >
          {"<"}
        </button>
        <button
          onClick={() => table.nextPage()} // Go to the next page
          disabled={!table.getCanNextPage()} // Disable if on the last page
        >
          {">"}
        </button>

        {/* Display current page number and total page count */}
        <span>
          Page{" "}
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
        </span>
      </div>
    </div>
  );
};

export default BasicTable;
