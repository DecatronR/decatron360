import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useRef, useState } from "react";
import { useAuth } from "context/AuthContext";
import SignatureCanvas from "react-signature-canvas";
import { trimCanvas } from "utils/helpers/trimCanvas";
import { dataURLToBlob } from "utils/helpers/dataUrlToBlob";
import { createSignature } from "utils/api/eSignature/createSignature";
import Swal from "sweetalert2";
import ButtonSpinner from "components/ui/ButtonSpinner";

const SignatureDialog = ({ open, onOpenChange, onSave, contractId }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("draw");
  const sigPadRef = useRef(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [buttonLoading, setButtonLoading] = useState(false);

  const mapUserRoleToBackendRole = (role) => {
    if (["owner", "property-manager", "careTaker"].includes(role)) {
      return "propertyOwner";
    } else if (["buyer", "tenant"].includes(role)) {
      return "tenant";
    }
    throw new Error(`Unsupported user role: ${role}`);
  };

  const clearCanvas = () => {
    sigPadRef.current.clear();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a FileReader to read the file as a base64 string
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result); // base64 string of the image
      };
      reader.readAsDataURL(file); // Convert to base64 string
    }
  };

  const handleSave = async () => {
    if (buttonLoading) return;

    // Validate signature
    if (activeTab === "draw") {
      if (!sigPadRef.current) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Signature pad not available.",
          toast: true,
          position: "center",
          showConfirmButton: false,
          timer: 3000,
        });
        return;
      }

      if (sigPadRef.current.isEmpty()) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Please provide a signature.",
          toast: true,
          position: "center",
          showConfirmButton: false,
          timer: 3000,
        });
        return;
      }
    } else {
      if (!uploadedImage) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Please provide a signature.",
          toast: true,
          position: "center",
          showConfirmButton: false,
          timer: 3000,
        });
        return;
      }
    }

    // Prepare the signature data before confirmation
    let blob = null;
    try {
      if (activeTab === "draw") {
        const originalCanvas = sigPadRef.current.getCanvas();
        const trimmedCanvas = trimCanvas(originalCanvas);
        const dataURL = trimmedCanvas.toDataURL("image/png");
        blob = dataURLToBlob(dataURL);
      } else {
        blob = dataURLToBlob(uploadedImage);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to prepare signature. Please try again.",
        confirmButtonText: "OK",
      });
      return;
    }

    // Show confirmation toast
    const result = await Swal.fire({
      title: "Confirm Signature",
      text: "Are you sure you want to save this signature?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, save it",
      cancelButtonText: "No, cancel",
      toast: true,
      position: "center",
    });

    if (!result.isConfirmed) return;

    setButtonLoading(true);

    const formData = new FormData();
    formData.append("contractId", contractId);
    formData.append("event", "signed");
    formData.append("role", mapUserRoleToBackendRole(user?.role));
    formData.append("timestamp", new Date().toISOString());
    formData.append("device", navigator.userAgent);
    formData.append("signatureImage", blob, "signature.png");

    try {
      // Show loading state
      Swal.fire({
        title: "Saving Signature",
        text: "Please wait while we save your signature...",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      await createSignature(formData);

      // Close loading state
      Swal.close();

      // Show success message and handle cleanup
      await Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Signature has been saved successfully.",
        showConfirmButton: false,
        timer: 2000,
      });

      // Only call onSave if it's provided
      if (typeof onSave === "function") {
        onSave(URL.createObjectURL(blob));
      }

      onOpenChange(false);
      return; // Add return to prevent error alert
    } catch (error) {
      console.error("Failed to save signature:", error);

      // Close loading state
      Swal.close();

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to save signature. Please try again.",
        confirmButtonText: "OK",
      });
    } finally {
      setButtonLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-[90vw] max-w-lg -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-lg p-6 z-50">
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-lg font-semibold">
              Add Signature
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="p-1 rounded hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </Dialog.Close>
          </div>

          <div className="flex space-x-2 mb-4">
            <button
              onClick={() => setActiveTab("draw")}
              className={`flex-1 px-4 py-2 rounded-full border ${
                activeTab === "draw"
                  ? "bg-primary-600 text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Draw
            </button>
            <button
              onClick={() => setActiveTab("upload")}
              className={`flex-1 px-4 py-2 rounded-full border ${
                activeTab === "upload"
                  ? "bg-primary-600 text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Upload
            </button>
          </div>

          {/* Draw */}
          {activeTab === "draw" && (
            <div className="space-y-2">
              <SignatureCanvas
                ref={sigPadRef}
                penColor="blue"
                canvasProps={{
                  width: 400,
                  height: 200,
                  className: "border rounded w-full",
                }}
              />
              <button
                onClick={clearCanvas}
                className="px-3 py-1 rounded-full border text-gray-600 hover:bg-gray-50 text-sm"
              >
                Clear
              </button>
            </div>
          )}

          {/* Upload */}
          {activeTab === "upload" && (
            <div className="space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full border rounded p-2"
              />
              {uploadedImage && (
                <img
                  src={uploadedImage}
                  alt="Uploaded Signature"
                  className="w-full h-auto rounded border"
                />
              )}
            </div>
          )}

          <div className="mt-6 flex justify-end space-x-3">
            <Dialog.Close asChild>
              <button className="px-4 py-2 rounded-full border text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
            </Dialog.Close>
            <button
              onClick={handleSave}
              disabled={buttonLoading}
              className="px-4 py-2 rounded-full bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {buttonLoading ? (
                <ButtonSpinner loading={buttonLoading} />
              ) : (
                "Save Signature"
              )}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default SignatureDialog;
