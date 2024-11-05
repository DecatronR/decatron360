const Reviews = ({ reviews }) => {
  return (
    <section className="container mx-auto py-6 px-6">
      <h2 className="text-2xl font-bold">Reviews</h2>
      <div className="mt-4">
        {reviews.map((review, index) => (
          <div key={index} className="border-b py-4">
            <p className="font-bold">{review.user.name}</p>
            <p className="text-gray-600">{review.comment}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Reviews;
