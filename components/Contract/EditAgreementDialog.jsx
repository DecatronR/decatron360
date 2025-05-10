const handleSubmit = async (e) => {
  e.preventDefault();
  if (buttonLoading) return;

  // Validate form
  if (!formData.title.trim()) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Please enter agreement title.",
      toast: true,
      position: "center",
      showConfirmButton: false,
      timer: 3000,
    });
    return;
  }

  if (!formData.description.trim()) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Please enter agreement description.",
      toast: true,
      position: "center",
      showConfirmButton: false,
      timer: 3000,
    });
    return;
  }

  // Show confirmation toast
  const result = await Swal.fire({
    title: "Confirm Changes",
    text: "Are you sure you want to save these changes?",
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

  try {
    // Show loading state
    Swal.fire({
      title: "Saving Changes",
      text: "Please wait while we save your changes...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    await updateAgreement(agreementId, formData);

    // Close loading state
    Swal.close();

    // Show success message
    await Swal.fire({
      icon: "success",
      title: "Success!",
      text: "Agreement has been updated successfully.",
      showConfirmButton: false,
      timer: 2000,
    });

    onOpenChange(false);
  } catch (error) {
    console.error("Failed to update agreement:", error);

    // Close loading state
    Swal.close();

    // Show error message
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Failed to update agreement. Please try again.",
      confirmButtonText: "OK",
    });
  } finally {
    setButtonLoading(false);
  }
};
