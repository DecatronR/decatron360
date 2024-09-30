import InfoBox from "./InfoBox";

const SelectListingType = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <a
        href="/properties/add/for-sale"
        className="block bg-white shadow-lg transition-transform transform hover:scale-105 rounded-lg p-6 text-left relative overflow-hidden"
      >
        <InfoBox heading="Properties For Sale" backgroundColor="bg-transparent">
          <p className="text-3xl font-bold text-gray-800">Sale</p>
        </InfoBox>
        <div className="absolute inset-0 bg-green-500 opacity-0 transition-opacity duration-300 hover:opacity-20"></div>
      </a>
      <a
        href="/properties/add/for-rent"
        className="block bg-white shadow-lg transition-transform transform hover:scale-105 rounded-lg p-6 text-left relative overflow-hidden"
      >
        <InfoBox
          heading="Properties for Rent & Shortlet"
          backgroundColor="bg-transparent"
        >
          <p className="text-3xl font-bold text-gray-800">Rent</p>
        </InfoBox>
        <div className="absolute inset-0 bg-blue-500 opacity-0 transition-opacity duration-300 hover:opacity-20"></div>
      </a>
    </div>
  );
};

export default SelectListingType;
