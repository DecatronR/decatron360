const AgentInfo = ({ host }) => {
  return (
    <section className="container mx-auto py-6 px-6">
      <div className="flex items-center space-x-4">
        <img
          src={host.profilePicture}
          alt="Host profile"
          className="w-12 h-12 rounded-full"
        />
        <div>
          <p className="font-bold">{host.name}</p>
          <p className="text-gray-600">Host</p>
        </div>
        <button className="ml-auto bg-blue-500 text-white py-2 px-4 rounded">
          Message Host
        </button>
      </div>
    </section>
  );
};

export default AgentInfo;
