"use client";
import React, { useEffect, useState } from "react";
import UserProperties from "@/components/UserProperties/UserProperties";
import UserPropertySearchForm from "components/UserProperties/UserPropertySearchForm";
import { fetchUserProperties } from "@/utils/api/user/fetchUserProperties";
import { fetchUserData } from "utils/api/user/fetchUserData";
import { fetchUserAcceptedProperties } from "utils/api/agencyRequest/fetchUserAccpetedProperties";
import { useParams } from "next/navigation";

const UserPropertiesPage = async () => {
  const { id } = useParams();
  const [userProperties, setUserProperties] = useState([]);
  const [userRole, setUserRole] = useState();

  useEffect(() => {
    const handleFetchUserProperties = async () => {
      if (id) {
        try {
          // const res = await fetchUserData(id);
          // setUserRole(res.role);
          // if (res.role === "agent") {
          //   const res = await fetchUserAcceptedProperties(id);
          //   setUserProperties(res);
          // } else {
          const res = await fetchUserProperties(id);
          setUserProperties(res);
          // }
        } catch (error) {
          console.log("Issue with fetching user properties: ", error);
        }
      } else {
        console.log("Could not fetch user properties, user id not found");
      }
    };
    handleFetchUserProperties();
  }, [id]);

  return (
    <>
      <section className="bg-primary-500 py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-start sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-4">
            {userRole ? "Listings by your network" : "Your Listings"}
          </h1>
          <UserPropertySearchForm />
        </div>
      </section>
      <UserProperties userProperties={userProperties} />
    </>
  );
};

export default UserPropertiesPage;
