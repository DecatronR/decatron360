import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useState } from "react";
import { sendWitnessInvite } from "utils/api/eSignature/sendWitnessInvite";
import { useAuth } from "context/AuthContext";
import Swal from "sweetalert2";
import ButtonSpinner from "components/ui/ButtonSpinner";

const WitnessInviteDialog = ({ open, onOpenChange, contractId }) => {
  const { user } = useAuth();
  const [buttonLoading, setButtonLoading] = useState(false);

  const mapUserRoleToWitnessRole = (userRole) => {
    if (["owner", "propertyManager", "careTaker"].includes(userRole)) {
      return "propertyOwnerWitness";
    } else if (["buyer", "tenant"].includes(userRole)) {
      return "tenantWitness";
    }
    throw new Error(`Unsupported user role: ${userRole}`);
  };

  const [formData, setFormData] = useState({
    witnessName: "",
    witnessEmail: "",
    role: mapUserRoleToWitnessRole(user?.role),
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.witnessName.trim()) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please enter witness name.",
        toast: true,
        position: "center",
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    }

    if (!formData.witnessEmail.trim()) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please enter witness email.",
        toast: true,
        position: "center",
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    }

    // Show confirmation toast
    const result = await Swal.fire({
      title: "Confirm Invitation",
      text: "Are you sure you want to send this witness invitation?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, send it",
      cancelButtonText: "No, cancel",
      toast: true,
      position: "center",
    });

    if (!result.isConfirmed) return;

    setButtonLoading(true);

    try {
      // Show loading state
      Swal.fire({
        title: "Sending Invitation",
        text: "Please wait while we send the invitation...",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      await sendWitnessInvite(
        contractId,
        formData.witnessName,
        formData.witnessEmail,
        formData.role
      );

      // Close loading state
      Swal.close();

      // Show success message
      await Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Witness invitation has been sent successfully.",
        showConfirmButton: false,
        timer: 2000,
      });

      onOpenChange(false);
    } catch (error) {
      console.error("Error sending witness invite:", error);

      // Close loading state
      Swal.close();

      // Show error message
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to send witness invitation. Please try again.",
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
              Invite Witness
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="p-1 rounded hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Witness Name
              </label>
              <input
                type="text"
                name="witnessName"
                value={formData.witnessName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter witness name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Witness Email
              </label>
              <input
                type="email"
                name="witnessEmail"
                value={formData.witnessEmail}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter witness email"
              />
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="px-4 py-2 rounded-full border text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </Dialog.Close>
              <button
                type="submit"
                disabled={buttonLoading}
                className="px-4 py-2 rounded-full bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {buttonLoading ? (
                  <ButtonSpinner loading={buttonLoading} />
                ) : (
                  "Send Invitation"
                )}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default WitnessInviteDialog;
