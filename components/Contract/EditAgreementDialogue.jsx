import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useState, useEffect } from "react";

const EditAgreementDialog = ({
  open,
  onOpenChange,
  onSubmit,
  data,
  setRentAndDurationText,
  setTenantObligations,
  setLandlordObligations,
}) => {
  const [selectedTitle, setSelectedTitle] = useState("Rent and Duration");
  const [currentValue, setCurrentValue] = useState("");

  useEffect(() => {
    if (data[selectedTitle]) {
      if (Array.isArray(data[selectedTitle])) {
        setCurrentValue(
          data[selectedTitle].map((line) => `• ${line}`).join("\n")
        );
      } else {
        setCurrentValue(data[selectedTitle]);
      }
    }
  }, [selectedTitle, data]);

  const handleSave = () => {
    const updatedValue = currentValue
      .split("\n")
      .map((line) => line.replace(/^•\s*/, "").trim())
      .filter((line) => line !== "");

    // Update the state in the parent component based on the selected title
    if (selectedTitle === "Rent and Duration") {
      setRentAndDurationText(updatedValue);
    } else if (selectedTitle === "Tenant's Obligation") {
      setTenantObligations(updatedValue);
    } else if (selectedTitle === "Landlord's Obligation") {
      setLandlordObligations(updatedValue);
    }

    onSubmit(updatedValue);
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-[90vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-lg p-6 z-50">
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-lg font-semibold">
              Edit Agreement
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="p-1 rounded hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </Dialog.Close>
          </div>

          <div className="space-y-4">
            {/* Dropdown for titles */}
            <select
              value={selectedTitle}
              onChange={(e) => setSelectedTitle(e.target.value)}
              className="w-full border rounded p-2"
            >
              {Object.keys(data).map((title) => (
                <option key={title} value={title}>
                  {title}
                </option>
              ))}
            </select>

            {/* Textarea for content */}
            <textarea
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const { selectionStart, selectionEnd } = e.target;
                  const newValue =
                    currentValue.substring(0, selectionStart) +
                    "\n• " +
                    currentValue.substring(selectionEnd);
                  setCurrentValue(newValue);
                  // move cursor after bullet
                  setTimeout(() => {
                    e.target.selectionStart = e.target.selectionEnd =
                      selectionStart + 3;
                  }, 0);
                }
              }}
              className="w-full border rounded p-2 h-64"
            />
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <Dialog.Close asChild>
              <button className="px-4 py-2 rounded-full border text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
            </Dialog.Close>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default EditAgreementDialog;
