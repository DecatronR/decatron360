const Amenities = ({ property }) => {
  return (
    <section className="container mx-auto py-6 px-6">
      <h2 className="text-2xl font-bold">Amenities</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {property.amenities.map((amenity) => (
          <div key={amenity.id} className="flex items-center space-x-2">
            <img src={amenity.icon} alt={amenity.name} className="w-6 h-6" />
            <p>{amenity.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Amenities;
