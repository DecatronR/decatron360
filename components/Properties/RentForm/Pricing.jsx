import { DollarSign, CreditCard, Shield, Clock, Percent } from "lucide-react";

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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <div className="flex items-center mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-full mr-4">
          <DollarSign className="w-5 h-5 text-primary-600" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900">Pricing & Fees</h2>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Price Input */}
          <div className="space-y-2">
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              <div className="flex items-center">
                <DollarSign className="w-4 h-4 mr-2 text-primary-600" />
                Monthly Rent
              </div>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                ₦
              </span>
              <input
                type="text"
                id="price"
                name="price"
                placeholder="0.00"
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
                required
                value={fields.price || ""}
                onChange={handleChange}
                onBlur={() => handleBlur("price")}
              />
            </div>
          </div>

          {/* Inspection Fee Input */}
          <div className="space-y-2">
            <label
              htmlFor="inspectionFee"
              className="block text-sm font-medium text-gray-700"
            >
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-2 text-primary-600" />
                Inspection Fee
              </div>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                ₦
              </span>
              <input
                type="text"
                id="inspectionFee"
                name="inspectionFee"
                placeholder="0.00"
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
                value={fields.inspectionFee || ""}
                onChange={handleChange}
                onBlur={() => handleBlur("inspectionFee")}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Refundable Caution Fee Input */}
          <div className="space-y-2">
            <label
              htmlFor="cautionFee"
              className="block text-sm font-medium text-gray-700"
            >
              <div className="flex items-center">
                <CreditCard className="w-4 h-4 mr-2 text-primary-600" />
                Refundable Caution Fee
              </div>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                ₦
              </span>
              <input
                type="text"
                id="cautionFee"
                name="cautionFee"
                placeholder="0.00"
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
                value={fields.cautionFee || ""}
                onChange={handleChange}
                onBlur={() => handleBlur("cautionFee")}
              />
            </div>
          </div>

          {/* Transaction Commission Input */}
          <div className="space-y-2">
            <label
              htmlFor="agencyFee"
              className="block text-sm font-medium text-gray-700"
            >
              <div className="flex items-center">
                <Percent className="w-4 h-4 mr-2 text-primary-600" />
                Agency Commission
              </div>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                ₦
              </span>
              <input
                type="text"
                id="agencyFee"
                name="agencyFee"
                placeholder="0.00"
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
                value={fields.agencyFee || ""}
                onChange={handleChange}
                onBlur={() => handleBlur("agencyFee")}
              />
            </div>
          </div>
        </div>

        {/* Monthly Late Payment Fee Input */}
        <div className="space-y-2">
          <label
            htmlFor="latePaymentFee"
            className="block text-sm font-medium text-gray-700"
          >
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2 text-primary-600" />
              Monthly Late Payment Fee
            </div>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
              ₦
            </span>
            <input
              type="text"
              id="latePaymentFee"
              name="latePaymentFee"
              placeholder="0.00"
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
              value={fields.latePaymentFee || ""}
              onChange={handleChange}
              onBlur={() => handleBlur("latePaymentFee")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
