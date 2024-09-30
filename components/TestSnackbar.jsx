"use client";
import React from "react";
import { useSnackbar } from "notistack";

const TestSnackbar = () => {
  const { enqueueSnackbar } = useSnackbar();

  const handleClick = (variant) => {
    enqueueSnackbar(`This is a ${variant} message!`, { variant });
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="mb-4">Test Snackbar</h2>
      <button onClick={() => handleClick("success")} className="mb-2">
        Show Success Snackbar
      </button>
      <button onClick={() => handleClick("error")} className="mb-2">
        Show Error Snackbar
      </button>
      <button onClick={() => handleClick("warning")} className="mb-2">
        Show Warning Snackbar
      </button>
      <button onClick={() => handleClick("info")}>Show Info Snackbar</button>
    </div>
  );
};

export default TestSnackbar;
