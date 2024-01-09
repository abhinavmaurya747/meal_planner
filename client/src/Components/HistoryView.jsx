import React from "react";
import HistoryTable from "./HistoryTable";

const HistoryView = () => {
  return (
    <>
      <div className="container">
        <div className="row mt-4 mb-2">
          <h2>History</h2>
        </div>
        <div className="row mb-2">
          <hr></hr>
        </div>
        <div className="row mb-2">
          {" "}
          <p>Manage your recent history here.</p>
        </div>
        <div className="row mt-2 mb-2">
          <HistoryTable />
        </div>
      </div>
    </>
  );
};

export default HistoryView;
