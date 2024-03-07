"use client";

import { useEffect, useRef } from "react";
import Grid from "tui-grid";
import "tui-grid/dist/tui-grid.css";

export default function DataGrid({ dataGridRef, columns, data }) {
  const gridRef = dataGridRef ?? useRef();

  const getGrid = () => {
    if (!gridRef.current.instance) {
      const grid = new Grid({
        el: gridRef.current,
        bodyHeight: "fitToParent",
        columns,
        data: [],
      });

      gridRef.current.instance = grid;
    }
  };

  useEffect(() => {
    getGrid();
  }, []);

  useEffect(() => {
    gridRef.current.instance.resetData(data);
  }, [data]);

  return <div ref={gridRef} />;
}
