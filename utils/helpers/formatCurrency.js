export const formatCurrency = (amount) => {
  return `₦${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
};

export const parseAmount = (amountString) => {
  if (!amountString) return 0;
  return Number(amountString.replace(/[^0-9.-]+/g, ""));
};
