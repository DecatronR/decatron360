const AgentInfo = ({ agent }) => {
  return (
    <section className="container mx-auto py-6 px-6">
      <div className="flex items-center space-x-4">
        <img
          src={agent.profilePicture}
          alt="Agent profile"
          className="w-12 h-12 rounded-full"
        />
        <div>
          <p className="font-bold">{agent.name}</p>
          <p className="text-gray-600">Agent</p>
        </div>
        <button className="ml-auto bg-blue-500 text-white py-2 px-4 rounded">
          Message Agent
        </button>
      </div>
    </section>
  );
};

export default AgentInfo;
