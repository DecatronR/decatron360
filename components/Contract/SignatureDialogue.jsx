import * as Dialog from "@radix-ui/react-dialog";
import { X, PenTool, Upload, CheckCircle } from "lucide-react";
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
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-[95vw] max-w-md -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl border border-gray-100 p-0 z-50 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-50 to-primary-100 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                  <PenTool className="w-5 h-5 text-white" />
                </div>
                <div>
                  <Dialog.Title className="text-lg font-semibold text-gray-900">
                    Add Your Signature
                  </Dialog.Title>
                  <p className="text-sm text-gray-600">
                    Sign your contract document
                  </p>
                </div>
              </div>
              <Dialog.Close asChild>
                <button className="p-2 rounded-xl hover:bg-white/50 transition-colors">
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </Dialog.Close>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Tab Navigation */}
            <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab("draw")}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === "draw"
                    ? "bg-white text-primary-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <PenTool className="w-4 h-4" />
                <span>Draw</span>
              </button>
              <button
                onClick={() => setActiveTab("upload")}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === "upload"
                    ? "bg-white text-primary-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Upload className="w-4 h-4" />
                <span>Upload</span>
              </button>
            </div>

            {/* Draw Tab */}
            {activeTab === "draw" && (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-4 border-2 border-dashed border-gray-200">
                  <SignatureCanvas
                    ref={sigPadRef}
                    penColor="#3b82f6"
                    canvasProps={{
                      width: 350,
                      height: 150,
                      className: "w-full h-full rounded-lg bg-white",
                    }}
                  />
                </div>
                <button
                  onClick={clearCanvas}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium transition-colors"
                >
                  Clear Signature
                </button>
              </div>
            )}

            {/* Upload Tab */}
            {activeTab === "upload" && (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-4 border-2 border-dashed border-gray-200">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-600 file:text-white hover:file:bg-primary-700 transition-colors"
                  />
                </div>
                {uploadedImage && (
                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <img
                      src={uploadedImage}
                      alt="Uploaded Signature"
                      className="w-full h-auto rounded-lg"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3 mt-8 pt-6 border-t border-gray-200">
              <Dialog.Close asChild>
                <button className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium transition-colors">
                  Cancel
                </button>
              </Dialog.Close>
              <button
                onClick={handleSave}
                disabled={buttonLoading}
                className="flex-1 px-4 py-3 rounded-xl bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all duration-200 flex items-center justify-center space-x-2"
              >
                {buttonLoading ? (
                  <>
                    <ButtonSpinner loading={buttonLoading} />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Save Signature</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default SignatureDialog;
