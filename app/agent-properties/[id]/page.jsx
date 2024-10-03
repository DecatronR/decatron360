"use client";
import React, { useEffect, useState } from "react";
import AgentProperties from "@/components/AgentProperties/AgentProperties";
import AgentPropertySearchForm from "@/components/AgentProperties/AgentPropertiesSearchForm";
import { fetchUserProperties } from "@/utils/api/user/fetchUserProperties";
import { useParams } from "next/navigation";

const AgentPropertiesPage = async () => {
  const { id } = useParams();
  const [agentProperties, setAgentProperties] = useState([]);

  useEffect(() => {
    const handleFetchAgentProperties = async () => {
      if (id) {
        try {
          const res = await fetchUserProperties(id);
          console.log("agent properties: ", res);
          setAgentProperties(res);
        } catch (error) {
          console.log("Issue with fetching agent properties: ", error);
        }
      } else {
        console.log("Could not fetch agent properties, user id not found");
      }
    };
    handleFetchAgentProperties();
  }, [id]);
  return (
    <>
      <section className="bg-primary-500 py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-start sm:px-6 lg:px-8">
          <AgentPropertySearchForm />
        </div>
      </section>
      <AgentProperties agentProperties={agentProperties} />
    </>
  );
};

export default AgentPropertiesPage;
