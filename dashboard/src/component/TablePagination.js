import React from "react";

function TablePagination(props) {
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const formsPerPage = 10;

  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
  const paginatedItems = props.children.slice(
    (currentPage - 1) * formsPerPage,
    currentPage * formsPerPage
  );

  function HeaderDisplay({header}) {
    return (
        <tr>
          {Object.keys(header).map((key) => (
            <th key={key} className="border border-gray-300 p-2">
              {key}
            </th>
          ))}
        </tr>
    );
    
  }

  function ObjectDisplay({ data }) {
    return (
      <>
        {Object.values(data).map((value) => (
          <td className="border border-gray-300 p-2">
            {typeof value === "object" && value !== null ? (
              <ObjectDisplay data={value} />
            ) : (
              value.toString()
            )}
          </td>
        ))}
      </>
    );
  }

  return (
    <>
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <HeaderDisplay header={props.children[0]} />
        </thead>
        <tbody>
          {paginatedItems.map((item, index) => (
            <tr key={index}>
              <ObjectDisplay data={item} />
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-lg text-white bg-darkgreen hover:bg-darkergreen disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-lg text-white bg-darkgreen hover:bg-darkergreen disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}

export default TablePagination;
