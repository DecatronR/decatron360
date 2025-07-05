import * as Dialog from "@radix-ui/react-dialog";
import { X, UserPlus, Mail, Send } from "lucide-react";
import { useState } from "react";
import { sendWitnessInvite } from "utils/api/eSignature/sendWitnessInvite";
import { useAuth } from "context/AuthContext";
import Swal from "sweetalert2";
import ButtonSpinner from "components/ui/ButtonSpinner";

const WitnessInviteDialog = ({ open, onOpenChange, contractId }) => {
  const { user } = useAuth();
  const [buttonLoading, setButtonLoading] = useState(false);

  const mapUserRoleToWitnessRole = (userRole) => {
    if (["owner", "property-manager", "careTaker"].includes(userRole)) {
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
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-[95vw] max-w-md -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl border border-gray-100 p-0 z-50 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-50 to-primary-100 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-white" />
                </div>
                <div>
                  <Dialog.Title className="text-lg font-semibold text-gray-900">
                    Invite Witness
                  </Dialog.Title>
                  <p className="text-sm text-gray-600">
                    Send invitation to contract witness
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
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Witness Name Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Witness Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserPlus className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="witnessName"
                    value={formData.witnessName}
                    onChange={handleInputChange}
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="Enter witness full name"
                  />
                </div>
              </div>

              {/* Witness Email Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Witness Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="witnessEmail"
                    value={formData.witnessEmail}
                    onChange={handleInputChange}
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="Enter witness email address"
                  />
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs text-white font-bold">i</span>
                  </div>
                  <div>
                    <p className="text-sm text-blue-800 font-medium mb-1">
                      Witness Invitation
                    </p>
                    <p className="text-xs text-blue-700">
                      The witness will receive an email invitation to sign the
                      contract as a witness. They must use the link provided in
                      the email to eventually sign
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </Dialog.Close>
                <button
                  type="submit"
                  disabled={buttonLoading}
                  className="flex-1 px-4 py-3 rounded-xl bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  {buttonLoading ? (
                    <>
                      <ButtonSpinner loading={buttonLoading} />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Invitation</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default WitnessInviteDialog;
