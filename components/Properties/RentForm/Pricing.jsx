const Pricing = ({ fields, setFields }) => {
  const formatPrice = (price) => {
    if (typeof price !== "string") {
      price = String(price);
    }
    const numericPrice = parseFloat(price.replace(/[^0-9.]/g, ""));
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(numericPrice || 0);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericValue = value.replace(/[^0-9.]/g, "");
    setFields((prevFields) => ({
      ...prevFields,
      [name]: numericValue,
    }));
  };

  const handleBlur = (name) => {
    setFields((prevFields) => ({
      ...prevFields,
      [name]: formatPrice(prevFields[name]),
    }));
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
      <label className="block text-lg font-semibold text-gray-900">
        Pricing
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Price Input */}
        <div>
          <label htmlFor="price" className="text-sm text-gray-600">
            Price
          </label>
          <input
            type="text"
            id="price"
            name="price"
            placeholder="NGN 0.00"
            className="border rounded-lg w-full py-3 px-4 bg-gray-50 focus:ring-blue-300"
            required
            value={fields.price || ""}
            onChange={handleChange}
            onBlur={() => handleBlur("price")}
          />
        </div>

        {/* Inspection Fee Input */}
        <div>
          <label htmlFor="inspectionFee" className="text-sm text-gray-600">
            Inspection Fee
          </label>
          <input
            type="text"
            id="inspectionFee"
            name="inspectionFee"
            placeholder="NGN 0.00"
            className="border rounded-lg w-full py-3 px-4 bg-gray-50 focus:ring-blue-300"
            value={fields.inspectionFee || ""}
            onChange={handleChange}
            onBlur={() => handleBlur("inspectionFee")}
          />
        </div>

        {/* Refundable Caution Fee Input */}
        <div>
          <label
            htmlFor="refundableCautionFee"
            className="text-sm text-gray-600"
          >
            Refundable Caution Fee
          </label>
          <input
            type="text"
            id="cautionFee"
            name="cautionFee"
            placeholder="NGN 0.00"
            className="border rounded-lg w-full py-3 px-4 bg-gray-50 focus:ring-blue-300"
            value={fields.cautionFee || ""}
            onChange={handleChange}
            onBlur={() => handleBlur("refundableCautionFee")}
          />
        </div>

        {/* Transaction Commission Input */}
        <div>
          <label
            htmlFor="transactionCommission"
            className="text-sm text-gray-600"
          >
            Transaction Commission
          </label>
          <input
            type="text"
            id="agencyFee"
            name="agencyFee"
            placeholder="NGN 0.00"
            className="border rounded-lg w-full py-3 px-4 bg-gray-50 focus:ring-blue-300"
            value={fields.agencyFee || ""}
            onChange={handleChange}
            onBlur={() => handleBlur("transactionCommission")}
          />
        </div>
      </div>
    </div>
  );
};

export default Pricing;
