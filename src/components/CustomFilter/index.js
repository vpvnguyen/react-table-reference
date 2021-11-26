import React from "react";
import styled from "styled-components";
import { useTable, useFilters, useFlexLayout } from "react-table";
// A great library for fuzzy filtering/sorting items
import { matchSorter } from "match-sorter";

import makeData from "./makeData";

const Styles = styled.div`
  padding: 1rem;
  border: 1px solid black;
  border-radius: 20px;
  text-align: left;
  table {
    border-spacing: 0;

    thead {
      border-bottom: 1px solid black;
      tr {
        th {
        }
      }
    }

    tbody {
      tr {
        border-bottom: 1px solid lightgrey;
        :hover {
          background-color: #d3d3d380;
        }
      }
    }
  }
`;

const Input = styled.input`
  width: 80%;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  -ms-appearance: none;
  -o-appearance: none;
  border: none;
  outline: none;
  border-bottom: 1px solid black;
`;

const Button = styled.button`
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  -ms-appearance: none;
  -o-appearance: none;
  border: none;
  outline: none;

  background-color: -internal-light-dark(white, blue);
  width: 80%;
  border-radius: 20px;
`;

const Thead = styled.thead`
  display: flex;
  flex-direction: column-reverse;
`;

// FILTERS ========================================================================
function StringMatchFilter({ column: { filterValue, setFilter, parent } }) {
  return (
    <Input
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={`${parent.Header}`}
    />
  );
}
function StringMatchFilterButton({
  column: { filterValue, setFilter, parent },
}) {
  return (
    <Button
      onClick={(e) => {
        console.log("StringMatchFilterButton");
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
    >
      Apply Filter
    </Button>
  );
}
function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
}
// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val) => !val;

// TABLE ========================================================================
function Table({ columns, data }) {
  const defaultColumn = React.useMemo(
    () => ({
      // When using the useFlexLayout:
      minWidth: 30, // minWidth is only used as a limit for resizing
      width: 150, // width is used for both the flex-basis and flex-grow
      maxWidth: 200, // maxWidth is only used as a limit for resizing
    }),
    []
  );
  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      applyFilter: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
      // Or, override the default text filter to use
      // "startWith"
      // text: (rows, id, filterValue) => {
      //   return rows.filter((row) => {
      //     const rowValue = row.values[id];
      //     return rowValue !== undefined
      //       ? String(rowValue)
      //           .toLowerCase()
      //           .startsWith(String(filterValue).toLowerCase())
      //       : true;
      //   });
      // },
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
  } = useTable(
    {
      columns,
      data,
      defaultColumn, // Be sure to pass the defaultColumn option
      filterTypes,
      // manualFilters: true,
    },
    useFilters,
    useFlexLayout
  );

  console.log({
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
  });

  // We don't want to render all of the rows for this example, so cap
  // it for this use case
  const firstPageRows = rows.slice(0, 10);

  return (
    <>
      <table {...getTableProps()}>
        <Thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>
                  {/* Render Filters */}
                  <div>{column.Filter ? column.render("Filter") : null}</div>
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </Thead>
        <tbody {...getTableBodyProps()}>
          {firstPageRows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <br />
      <div>Showing the first 20 results of {rows.length} rows</div>
      <div>
        <pre>
          <code>{JSON.stringify(state.filters, null, 2)}</code>
        </pre>
      </div>
    </>
  );
}

// EXPORT TABLE ==================================================================
function CustomFilterTable() {
  const columns = React.useMemo(
    () => [
      {
        Header: "First Name",
        disableFilters: true,
        columns: [
          {
            accessor: "firstName",
            Filter: StringMatchFilter,
          },
        ],
      },
      {
        Header: "Last Name",
        columns: [
          {
            accessor: "lastName",
            Filter: StringMatchFilter,
            filter: "fuzzyText",
          },
        ],
      },
      {
        Header: "Age",
        columns: [
          {
            accessor: "age",
            Filter: StringMatchFilter,
          },
        ],
      },
      {
        Header: "Visits",
        columns: [
          {
            accessor: "visits",
            Filter: StringMatchFilter,
          },
        ],
      },
      {
        Header: "Status",
        columns: [
          {
            accessor: "status",
            Filter: StringMatchFilter,
          },
        ],
      },
      {
        Header: "Filter",
        columns: [
          {
            accessor: "progress",
            Filter: StringMatchFilterButton,
          },
        ],
      },
    ],
    []
  );

  const data = React.useMemo(() => makeData(100000), []);

  return (
    <Styles>
      <Table columns={columns} data={data} />
    </Styles>
  );
}

export default CustomFilterTable;
