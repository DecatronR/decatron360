"use client";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";

const UserAbout = ({ name, initialDescription }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(initialDescription);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    setDescription(e.target.value);
  };

  const handleSave = () => {
    // Logic to save the new description goes here
    console.log("Saved:", description);
    setIsEditing(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">About {name}</h2>
        <button
          onClick={handleEditToggle}
          className="text-gray-500 hover:text-primary-500"
        >
          <FontAwesomeIcon icon={faPen} />
        </button>
      </div>
      {isEditing ? (
        <div className="flex flex-col md:flex-row items-center">
          <input
            type="text"
            value={description}
            onChange={handleChange}
            className="border border-gray-300 rounded p-2 w-full mb-2 md:mb-0 md:mr-2"
            onBlur={handleEditToggle}
            placeholder="Edit your description..."
          />
          <button
            onClick={handleSave}
            className="bg-primary-500 text-white rounded px-4 py-2"
          >
            Save
          </button>
        </div>
      ) : (
        <p className="text-gray-700">{description}</p>
      )}
    </div>
  );
};

export default UserAbout;
