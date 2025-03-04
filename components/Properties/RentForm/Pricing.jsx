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
            onChange={(e) => {
              const numericPrice = e.target.value.replace(/[^0-9.]/g, "");
              setFields((prevFields) => ({
                ...prevFields,
                price: numericPrice,
              }));
            }}
            onBlur={() => {
              const formattedPrice = formatPrice(fields.price);
              setFields((prevFields) => ({
                ...prevFields,
                price: formattedPrice,
              }));
            }}
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
            onChange={(e) => {
              const numericValue = e.target.value.replace(/[^0-9.]/g, "");
              setFields((prevFields) => ({
                ...prevFields,
                inspectionFee: numericValue,
              }));
            }}
            onBlur={() => {
              const formattedPrice = formatPrice(fields.inspectionFee);
              setFields((prevFields) => ({
                ...prevFields,
                inspectionFee: formattedPrice,
              }));
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Pricing;
