"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
// import "@fullcalendar/common/main.css";

const AgentScheduler = () => {
  const { id } = useParams(); // Fetch specific data for this user
  const [bookedDates, setBookedDates] = useState({});
  const [availableTimes, setAvailableTimes] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);

  const timeSlots = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];

  const formatTimeTo12Hour = (time) => {
    const [hour, minute] = time.split(":");
    const formattedHour = hour % 12 || 12; // Convert to 12-hour format
    const ampm = hour < 12 ? "AM" : "PM";
    return `${formattedHour}:${minute} ${ampm}`;
  };

  const handleDateClick = (dateInfo) => {
    const clickedDate = dateInfo.dateStr;

    if (availableTimes[clickedDate]) {
      delete availableTimes[clickedDate];
      setSelectedDate(null);
    } else {
      setAvailableTimes({ ...availableTimes, [clickedDate]: [] });
      setSelectedDate(clickedDate);
    }

    if (bookedDates[clickedDate]) {
      delete bookedDates[clickedDate];
    }
  };

  const handleTimeSlotClick = (dateStr, timeSlot) => {
    if (availableTimes[dateStr]?.includes(timeSlot)) {
      setAvailableTimes((prev) => ({
        ...prev,
        [dateStr]: prev[dateStr].filter((time) => time !== timeSlot),
      }));
    } else {
      setAvailableTimes((prev) => ({
        ...prev,
        [dateStr]: [...(prev[dateStr] || []), timeSlot],
      }));
    }

    if (bookedDates[dateStr]?.includes(timeSlot)) {
      setBookedDates((prev) => ({
        ...prev,
        [dateStr]: prev[dateStr].filter((time) => time !== timeSlot),
      }));
    }
  };

  const handleSaveChanges = () => {
    console.log("Available Times:", availableTimes);
    console.log("Booked Dates:", bookedDates);
  };

  const eventColor = (dateStr) => {
    if (bookedDates[dateStr]) {
      return "#ff5733"; // Red for booked
    } else if (availableTimes[dateStr]) {
      return "#28a745"; // Green for available
    }
    return "#e2e2e2"; // Light gray for unavailable
  };

  const handleSelectAllTimeSlots = () => {
    if (selectedDate) {
      setAvailableTimes((prev) => ({
        ...prev,
        [selectedDate]: timeSlots,
      }));
    }
  };

  return (
    <section className="px-4 py-6 bg-gray-50">
      <div className="container max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-primary-600 mb-4 text-center">
          Agent Inspection Scheduler
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Select available times for property inspections
        </p>
        <div className="flex justify-center mb-4">
          <div className="flex items-center mr-4">
            <div className="w-4 h-4 bg-white border border-gray-400 rounded-full mr-2"></div>
            <span className="text-gray-600">Unavailable</span>
          </div>
          <div className="flex items-center mr-4">
            <div className="w-4 h-4 bg-green-400 border border-gray-400 rounded-full mr-2"></div>
            <span className="text-gray-600">Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-400 border border-gray-400 rounded-full mr-2"></div>
            <span className="text-gray-600">Booked</span>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-2/3">
            <div className="w-full rounded-lg border border-gray-300 shadow-lg overflow-hidden">
              <div className="h-[69vh] overflow-y-auto">
                <FullCalendar
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                  initialView="timeGridWeek"
                  headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,timeGridDay",
                  }}
                  selectable={true}
                  dayMaxEvents={true}
                  dateClick={handleDateClick}
                  events={Object.keys(availableTimes).map((date) => ({
                    start: date,
                    end: date,
                    display: "background",
                    backgroundColor: eventColor(date),
                  }))}
                  height="auto"
                />
              </div>
            </div>
          </div>
          <div className="lg:w-1/3 lg:pl-4 mt-4 lg:mt-0">
            {selectedDate && (
              <div className="bg-white rounded-lg shadow-lg p-4">
                <h4 className="font-semibold text-lg mb-2 text-primary-600">
                  {selectedDate}
                </h4>
                <div className="h-[60vh] overflow-y-auto">
                  <div className="flex flex-col mb-3">
                    <button
                      onClick={handleSelectAllTimeSlots}
                      className="mb-2 px-4 py-2 rounded bg-gradient-to-r from-green-400 to-green-600 text-white hover:bg-green-500 transition duration-200"
                    >
                      All Day
                    </button>
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => handleTimeSlotClick(selectedDate, slot)}
                        className={`mb-2 px-4 py-2 rounded transition duration-200 ${
                          availableTimes[selectedDate]?.includes(slot)
                            ? "bg-green-400 text-white hover:bg-green-500"
                            : "bg-gray-200 hover:bg-gray-300"
                        }`}
                      >
                        {formatTimeTo12Hour(slot)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="text-center mt-5">
          <button
            onClick={handleSaveChanges}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-primary-500 transition duration-200 shadow-md hover:shadow-lg"
          >
            Save Changes
          </button>
        </div>
      </div>
    </section>
  );
};

export default AgentScheduler;
