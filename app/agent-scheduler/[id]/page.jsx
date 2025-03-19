"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { updateSchedule } from "utils/api/scheduler/updateSchedule";
import { fetchAgentSchedule } from "utils/api/scheduler/fetchAgentSchedule";
import ButtonSpinner from "components/ui/ButtonSpinner";
import { useSnackbar } from "notistack";
// import "@fullcalendar/common/main.css";

const AgentScheduler = () => {
  const { id: userId } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [bookedDates, setBookedDates] = useState({});
  const [availableTimes, setAvailableTimes] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  const closeMobileView = () => {
    setIsMobileView(false);
  };

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
    const formattedHour = hour % 12 || 12;
    const ampm = hour < 12 ? "AM" : "PM";
    return `${formattedHour}:${minute} ${ampm}`;
  };

  useEffect(() => {
    const handleFetchAgentSchedule = async () => {
      try {
        const res = await fetchAgentSchedule(userId);

        const available = {};
        const booked = {};

        res.forEach((schedule) => {
          const dateStr = schedule.date.replace(/\//g, "-"); // Convert date format to match FullCalendar requirements
          const timeSlot = `${schedule.time}:00`; // Format time slot as HH:00

          if (schedule.isAvailable === "0") {
            // "0" indicates available
            if (!available[dateStr]) available[dateStr] = [];
            available[dateStr].push(timeSlot);
          } else if (schedule.isAvailable === "1") {
            // "1" indicates booked
            if (!booked[dateStr]) booked[dateStr] = [];
            booked[dateStr].push(timeSlot);
          }
        });

        setAvailableTimes(available);
        setBookedDates(booked);
      } catch (error) {
        console.log("Could not fetch user schedule: ", error);
      }
    };

    handleFetchAgentSchedule();
  }, [userId]);

  const handleDateClick = (dateInfo) => {
    setSelectedDate(dateInfo.dateStr);
    if (window.innerWidth < 640) {
      setIsMobileView(true);
    }
    const clickedDate = dateInfo.dateStr;

    if (availableTimes[clickedDate] && selectedDate === clickedDate) {
      const updatedTimes = { ...availableTimes };
      delete updatedTimes[clickedDate];
      setAvailableTimes(updatedTimes);
      setSelectedDate(null);
    } else if (availableTimes[clickedDate]) {
      setSelectedDate(clickedDate);
    } else {
      setAvailableTimes({ ...availableTimes, [clickedDate]: [] });
      setSelectedDate(clickedDate);
    }
  };

  const handleTimeSlotClick = (dateStr, timeSlot) => {
    if (bookedDates[dateStr]?.includes(timeSlot)) {
      return; // Prevent booked slots from being modified
    }
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
  };

  const handleSetAvailability = async () => {
    const availability = Object.entries(availableTimes).map(
      ([date, times]) => ({
        date: date.replace(/-/g, "/"), // Formatting date as required
        time: times.map((t) => parseInt(t.split(":")[0])), // Extracting hour as integer
      })
    );

    try {
      setIsButtonLoading(true);
      const res = await updateSchedule(userId, availability);
      enqueueSnackbar("Successfully updated schedule!", {
        variant: "success",
      });
    } catch (error) {
      console.error("Failed to to update schedule:", error);
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.message;
        enqueueSnackbar(`Failed to update schedule: ${errorMessage}`, {
          variant: "error",
        });
      } else {
        enqueueSnackbar(`Failed to update schedule: ${error.message}`, {
          variant: "error",
        });
      }
    } finally {
      setIsButtonLoading(false);
    }
  };

  const handleSaveChanges = () => {
    handleSetAvailability();
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
    <section className="px-2 sm:px-4 py-6 bg-gray-50">
      <div className="container mx-auto max-w-3xl p-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 text-center">
          Set Availability
        </h2>
      </div>

      <div className="container max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-4 sm:p-8">
        <p className="text-center text-gray-800 mb-4 sm:mb-6 text-sm sm:text-base">
          Select available times for property inspections
        </p>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-4">
          {[
            { color: "bg-yellow-100", label: "Today" },
            { color: "bg-white", label: "Unavailable" },
            { color: "bg-green-500", label: "Available" },
            { color: "bg-red-500", label: "Booked" },
          ].map((item, index) => (
            <div key={index} className="flex items-center">
              <div
                className={`w-4 h-4 ${item.color} border border-gray-400 rounded-full mr-2`}
              ></div>
              <span className="text-gray-600 text-sm">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Calendar */}
          <div className="lg:w-2/3 w-full">
            <div className="w-full rounded-lg border border-gray-300 shadow-lg overflow-hidden">
              <div className="h-[50vh] sm:h-[60vh] lg:h-[69vh] overflow-y-auto sm:text-lg text-xs">
                <FullCalendar
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                  initialView="dayGridMonth"
                  headerToolbar={{
                    left: "prev,next",
                    center: "title",
                    right: "dayGridMonth",
                  }}
                  selectable={true}
                  dayMaxEvents={true}
                  dateClick={handleDateClick}
                  events={[
                    ...Object.keys(availableTimes).map((date) => ({
                      start: date,
                      end: date,
                      display: "background",
                      backgroundColor: "green",
                    })),
                    ...Object.keys(bookedDates).map((date) => ({
                      start: date,
                      end: date,
                      display: "background",
                      backgroundColor: "red",
                    })),
                  ]}
                  height="auto"
                />
              </div>
            </div>
          </div>

          {/* Desktop Time Slots */}
          <div className="lg:w-1/3 w-full lg:pl-4 mt-4 lg:mt-0 hidden sm:block">
            {selectedDate && (
              <div className="bg-white rounded-lg shadow-lg p-4">
                <h4 className="font-semibold text-lg mb-2 text-primary-600">
                  {selectedDate}
                </h4>
                <div className="h-[40vh] sm:h-[50vh] overflow-y-auto">
                  <div className="flex flex-col mb-3">
                    <button
                      onClick={handleSelectAllTimeSlots}
                      className="w-full sm:w-auto px-4 py-2 rounded bg-gradient-to-r from-green-400 to-green-600 text-white hover:bg-green-500 transition duration-200"
                    >
                      All Day
                    </button>
                    {timeSlots.map((slot) => {
                      const isAvailable =
                        availableTimes[selectedDate]?.includes(slot) || false;
                      const isBooked =
                        bookedDates[selectedDate]?.includes(slot) || false;
                      return (
                        <button
                          key={slot}
                          onClick={() =>
                            handleTimeSlotClick(selectedDate, slot)
                          }
                          className={`mb-2 w-full px-4 py-2 rounded transition duration-200 ${
                            isBooked
                              ? "bg-red-500 text-white cursor-not-allowed"
                              : isAvailable
                              ? "bg-green-500 text-white hover:bg-green-500"
                              : "bg-gray-200 hover:bg-gray-300"
                          }`}
                          disabled={isBooked}
                        >
                          {formatTimeTo12Hour(slot)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Time Slot Drawer */}
        {/* Sidebar for Time Slots */}
        <div
          className={`fixed top-[10rem] right-0 h-[65vh] w-[60%] max-w-md bg-white shadow-lg p-6 transform transition-transform duration-300 ${
            selectedDate ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <button
            onClick={() => setSelectedDate(null)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
          >
            ✖
          </button>

          <h4 className="font-semibold text-lg mb-2 text-primary-600">
            {selectedDate}
          </h4>

          <div className="h-[70vh] overflow-y-auto">
            <div className="flex flex-col mb-3">
              <button
                onClick={handleSelectAllTimeSlots}
                className="w-full px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
              >
                All Day
              </button>
              {timeSlots.map((slot) => {
                const isAvailable =
                  availableTimes[selectedDate]?.includes(slot);
                const isBooked = bookedDates[selectedDate]?.includes(slot);

                return (
                  <button
                    key={slot}
                    onClick={() => handleTimeSlotClick(selectedDate, slot)}
                    className={`mb-2 w-full px-4 py-2 rounded transition duration-200 ${
                      isBooked
                        ? "bg-red-500 text-white cursor-not-allowed"
                        : isAvailable
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                    disabled={isBooked}
                  >
                    {formatTimeTo12Hour(slot)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="text-center mt-5">
          <button
            onClick={handleSaveChanges}
            className="w-full sm:w-auto bg-primary-500 text-white px-6 py-3 rounded-full transition hover:bg-primary-600"
          >
            {isButtonLoading ? <ButtonSpinner /> : "Save Changes"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default AgentScheduler;
