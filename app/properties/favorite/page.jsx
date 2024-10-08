const FavoritePropertiesPage = () => {
  const [userId, setUserId] = useState("");
  const [properties, setProperties] = useState([]);
  const [isFavorite, setIsFavorite] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = sessionStorage.getItem("userId");
    setUserId(id);
  }, []);

  const handleToggleFavorite = async (propertyId) => {
    try {
      if (isFavorite[propertyId]) {
        // Optionally call your removeFavoriteProperties function
        console.log("removed from favorite properties");
        setIsFavorite((prev) => ({ ...prev, [propertyId]: false }));
      } else {
        await addFavoriteProperties(userId, propertyId);
        setIsFavorite((prev) => ({ ...prev, [propertyId]: true }));
      }
    } catch (error) {
      console.log("Error toggling favorite: ", error);
    }
  };

  useEffect(() => {
    const handleFetchFavoriteProperties = async () => {
      if (userId) {
        try {
          const res = await fetchFavoriteProperties(userId);
          setProperties(res);
        } catch (error) {
          console.error("Failed to fetch favorite properties: ", error);
        } finally {
          setLoading(false);
        }
      } else {
        console.log(
          "Failed to fetch favorite properties, user id is not found"
        );
      }
    };
    handleFetchFavoriteProperties();
  }, [userId]);

  return loading ? (
    <Spinner loading={loading} />
  ) : (
    <section className="px-4 py-6">
      <div className="container-xl lg:container m-auto px-4 py-6">
        <h1 className="text-2xl mb-4">Favorite Properties</h1>
        {properties.length === 0 ? (
          <p>No saved properties</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard
                key={property._id}
                property={property}
                isFavorite={isFavorite[property._id]}
                onToggleFavorite={() => handleToggleFavorite(property._id)} // Ensure this is passed
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FavoritePropertiesPage;
