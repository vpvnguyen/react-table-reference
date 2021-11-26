import React from "react";
import styled from "styled-components";
import { useTable, useFilters, useFlexLayout } from "react-table";
import makeData from "./makeData";

const StyledTable = styled.div`
  padding: 1em;
  border: 1px solid black;
  border-radius: 20px;
  text-align: left;
  gap: 1em;

  h1 {
    padding: 0 0 1em 0;
  }

  table {
    border-spacing: 0;
    thead {
      display: flex;
      flex-direction: column-reverse;
      border-bottom: 1px solid black;
      tr {
        th {
          padding: 0.5em;
          input {
            appearance: none;
            -webkit-appearance: none;
            -moz-appearance: none;
            -ms-appearance: none;
            -o-appearance: none;
            border: none;
            outline: none;

            width: 80%;
            border-bottom: 1px solid black;
          }
          button {
            appearance: none;
            -webkit-appearance: none;
            -moz-appearance: none;
            -ms-appearance: none;
            -o-appearance: none;
            border: none;
            outline: none;

            width: 80%;
            border: 0;
            border-radius: 0.5em;
            padding: 0.5em;
            font-size: 0.75em;
            color: white;
            background: darkslateblue;
            cursor: pointer;
          }
        }
      }
    }

    tbody {
      tr {
        border-bottom: 1px solid lightgrey;
        :hover {
          background-color: #d3d3d380;
        }
        td {
          padding: 0.5em;
        }
      }
    }
  }
`;

// FILTERS ========================================================================
const StringMatchFilter = ({ column: { filterValue, setFilter, parent } }) => {
  return (
    <input
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // undefined to entirely remove filter
      }}
      placeholder={`${parent.Header}`}
    />
  );
};
function StringMatchFilterButton({
  column: { filterValue, setFilter, parent },
}) {
  return (
    <button
      onClick={(e) => {
        console.log("StringMatchFilterButton");
        setFilter(e.target.value || undefined); // undefined to entirely remove filter
      }}
    >
      Apply Filter
    </button>
  );
}

// TABLE ========================================================================
const Table = ({ title, columns, data }) => {
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
      defaultColumn: React.useMemo(
        () => ({
          // useFlexLayout
          minWidth: 30, // minWidth is only used as a limit for resizing
          width: 150, // width is used for both the flex-basis and flex-grow
          maxWidth: 200, // maxWidth is only used as a limit for resizing
        }),
        []
      ),
      filterTypes: React.useMemo(
        () => ({
          text: (rows, id, filterValue) => {
            return rows.filter((row) => {
              const rowValue = row.values[id];
              return rowValue !== undefined
                ? String(rowValue)
                    .toLowerCase()
                    .startsWith(String(filterValue).toLowerCase())
                : true;
            });
          },
        }),
        []
      ),
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
    <StyledTable>
      <h1>{title}</h1>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>
                  {/* Headers and Filters */}
                  <div>{column.Filter ? column.render("Filter") : null}</div>
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>

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

      {/* EXAMPLE LOG - Remove Later */}
      <div>Showing the first 20 results of {rows.length} rows</div>
      <div>
        <pre>
          <code>{JSON.stringify(state.filters, null, 2)}</code>
        </pre>
      </div>
    </StyledTable>
  );
};

// RENDER TABLE WITH DATA ==========================================
const CustomFilterTable = () => {
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
        Header: "Filter", // Figure out how to remove name
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

  return <Table title="Table Name" columns={columns} data={data} />;
};

export default CustomFilterTable;
