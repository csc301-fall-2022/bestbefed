import React from "react";
import "./style.css";

// renders the buttons and changes the state of the filter
const Filters = ({ setFilter, stores }: { setFilter: any; stores: any }) => {
  return (
    <>
      <div className="buttons">
        <button className="filter-button" onClick={() => setFilter()}>
          All
        </button>
        {stores.map((val: string, id: number) => {
          return (
            <button
              className="filter-button"
              onClick={() => setFilter(val)}
              key={id}
            >
              {val}
            </button>
          );
        })}
      </div>
    </>
  );
};

export default Filters;
