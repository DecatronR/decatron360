const PaystackForm = () => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Payment Details</h2>
      <form>
        <div className="mb-4">
          <label htmlFor="cardNumber" className="block mb-1">
            Card Number
          </label>
          <input
            type="text"
            id="cardNumber"
            className="border border-gray-300 rounded w-full p-2"
            placeholder="1234 5678 9012 3456"
            required
          />
        </div>
        <div className="flex mb-4">
          <div className="w-1/2 mr-2">
            <label htmlFor="expiryDate" className="block mb-1">
              Expiry Date
            </label>
            <input
              type="text"
              id="expiryDate"
              className="border border-gray-300 rounded w-full p-2"
              placeholder="MM/YY"
              required
            />
          </div>
          <div className="w-1/2 ml-2">
            <label htmlFor="cvv" className="block mb-1">
              CVV
            </label>
            <input
              type="text"
              id="cvv"
              className="border border-gray-300 rounded w-full p-2"
              placeholder="123"
              required
            />
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="nameOnCard" className="block mb-1">
            Name on Card
          </label>
          <input
            type="text"
            id="nameOnCard"
            className="border border-gray-300 rounded w-full p-2"
            placeholder="John Doe"
            required
          />
        </div>
      </form>
    </div>
  );
};

export default PaystackForm;
