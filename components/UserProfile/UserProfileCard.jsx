"use client";
import Image from "next/image";
import StarRatings from "react-star-ratings";

const UserProfileCard = ({ userData, userRating }) => {
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result); // Update the profile image with the new file
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <div className="flex flex-col sm:flex-row items-center">
        <div className="w-20 h-20 sm:w-16 sm:h-16 rounded-full overflow-hidden mr-4 cursor-pointer">
          <Image
            src={""}
            alt={`${name}'s photo`}
            width={64}
            height={64}
            className="object-cover"
            onClick={() => document.getElementById("fileInput").click()} // Trigger file input on image click
          />
          <input
            type="file"
            id="fileInput"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>
        <div>
          <p className="text-lg font-semibold text-gray-800">
            {userData?.name}
          </p>

          {/* Use StarRatings for the rating display */}
          <div className="flex items-center">
            <StarRatings
              rating={3} // we need to fetch the ratings average from the backend and not an array
              starRatedColor="gold"
              numberOfStars={5}
              starDimension="20px"
              starSpacing="2px"
              name="rating"
            />
          </div>
          {/* <p className="text-gray-500 text-sm">
            Joined{" "}
            {formatDistanceToNow(new Date(joinDate), { addSuffix: true })}
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;
