const Pricing = () => {
  return (
    <div>
      <div className="w-1/2">
        <label htmlFor="price" className="block text-gray-800 font-medium mb-3">
          Price
        </label>
        <input
          type="text"
          id="price"
          name="price"
          placeholder="NGN 0.00"
          className="border rounded-lg w-full py-3 px-4 text-gray-700 bg-gray-50 focus:outline-none focus:ring focus:ring-blue-300 transition"
          required
          value={fields.price}
          onChange={(e) => {
            const numericPrice = e.target.value.replace(/[^0-9.]/g, "");
            setFields((prevFields) => ({
              ...prevFields,
              price: numericPrice,
            }));
          }}
          onBlur={(e) => {
            const formattedPrice = formatPrice(fields.price);
            setFields((prevFields) => ({
              ...prevFields,
              price: formattedPrice,
            }));
          }}
        />
      </div>

      <div className="w-1/2">
        <label
          htmlFor="inspectionFee"
          className="block text-gray-800 font-medium mb-3"
        >
          Inspection Fee
        </label>
        <input
          type="text"
          id="inspectionFee"
          name="inspectionFee"
          placeholder="NGN 0.00"
          className="border rounded-lg w-full py-3 px-4 text-gray-700 bg-gray-50 focus:outline-none focus:ring focus:ring-blue-300 transition"
          value={fields.inspectionFee || ""} // Ensure it always has a string value
          onChange={(e) => {
            const numericValue = e.target.value.replace(/[^0-9.]/g, "");
            setFields((prevFields) => ({
              ...prevFields,
              inspectionFee: numericValue, // Allow empty strings during editing
            }));
          }}
          onBlur={(e) => {
            const numericValue = parseFloat(fields.inspectionFee) || 0;
            const formattedPrice =
              numericValue > 0 ? formatPrice(numericValue) : ""; // Format valid values
            setFields((prevFields) => ({
              ...prevFields,
              inspectionFee: formattedPrice, // Always a string, even if empty
            }));
          }}
        />
      </div>
    </div>
  );
};

export default Pricing;
