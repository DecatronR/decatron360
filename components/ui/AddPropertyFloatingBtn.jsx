import React from "react";
import { HousePlus } from "lucide-react";

const AddPropertyFloatingBtn = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-20 right-6 md:hidden flex items-center justify-center w-14 h-14  bg-green-600  text-white rounded-3xl shadow-lg hover:bg-green-700  transition duration-300"
    >
      <HousePlus className="h-6 w-6" />
    </button>
  );
};

export default AddPropertyFloatingBtn;
