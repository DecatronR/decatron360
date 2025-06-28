import React from "react";
import { FilePlus2 } from "lucide-react";

const RequestPropertyFloatingBtn = React.forwardRef((props, ref) => {
  return (
    <button
      {...props}
      ref={ref}
      className="fixed bottom-20 right-6 md:hidden flex items-center justify-center w-14 h-14 bg-primary-500 text-white rounded-3xl shadow-lg hover:bg-primary-600 transition duration-300 z-40"
      aria-label="Request a Property"
    >
      <FilePlus2 className="h-6 w-6" />
    </button>
  );
});

RequestPropertyFloatingBtn.displayName = "RequestPropertyFloatingBtn";

export default RequestPropertyFloatingBtn;
