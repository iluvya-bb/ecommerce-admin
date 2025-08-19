export const formatCurrency = (amount) => {
  const number = parseFloat(amount);
  if (isNaN(number)) {
    return "0 ₮";
  }
  return number.toLocaleString("en-US", {
    style: "currency",
    currency: "MNT",
    currencySymbol: "₮",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).replace("MNT", "").trim();
};
