import React from "react";

function TablePagination(props) {
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const formsPerPage = 10;

  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
  const paginatedItems = props.filteredItems.slice(
    (currentPage - 1) * formsPerPage,
    currentPage * formsPerPage
  );

  function HeaderDisplay({ header }) {
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
        {props.onClickButton1 && (
          <td className="border border-gray-300 p-2">
            <div className="flex items-center justify-center flex-col lg:flex-row w-full gap-2">
              <button
                onClick={props.onClickButton1}
                className="lg:w-auto w-full px-4 py-2 bg-darkgreen text-white rounded"
              >
                {props.button1Text}
              </button>
              {props.onClickButton2 && (
                <button
                  onClick={props.onClickButton2}
                  className="lg:w-auto w-full px-4 py-2 bg-pastelyellow text-black rounded"
                >
                  {props.button1Text}
                </button>
              )}
            </div>
          </td>
        )}
      </>
    );
  }

  return (
    <>
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-darkgreen text-white">
            <HeaderDisplay header={filteredItems.children[0]} />
          </tr>
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
