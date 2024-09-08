import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";

const ProfileCard = ({ agent }) => {
  const { photo, name, rank, reviews, ratings, joinDate } = agent;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <h4 className="text-xl font-bold text-gray-900">Meet Your Agent</h4>
      <div className="flex items-center">
        <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
          <Image
            src={photo}
            alt={`${name}'s photo`}
            width={64}
            height={64}
            className="object-cover"
          />
        </div>
        <div>
          <p className="text-lg font-semibold text-gray-800">{name}</p>
          <p className="text-gray-600">{rank}</p>
          <div className="flex items-center text-yellow-500">
            <FaStar className="text-yellow-500" />
            <span className="ml-2">{ratings}</span>
          </div>
          <p className="text-gray-600">{reviews} reviews</p>
          <p className="text-gray-500 text-sm">
            Joined{" "}
            {formatDistanceToNow(new Date(joinDate), { addSuffix: true })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
