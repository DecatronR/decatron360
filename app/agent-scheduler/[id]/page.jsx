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
import {
  X,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";
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

  const formatSelectedDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Compact Header Section */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-primary-100 rounded-full mb-4 sm:mb-6">
            <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">
            Set Inspection Availability
          </h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            Choose when you're available for property inspections
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:p-8">
          {/* Compact Legend */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-4 sm:mb-6">
            {[
              {
                color: "bg-yellow-100 border-yellow-300",
                label: "Today",
                icon: Clock,
              },
              {
                color: "bg-gray-100 border-gray-300",
                label: "Unavailable",
                icon: X,
              },
              {
                color: "bg-green-100 border-green-300",
                label: "Available",
                icon: CheckCircle,
              },
              {
                color: "bg-red-100 border-red-300",
                label: "Booked",
                icon: AlertCircle,
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center bg-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-gray-200 shadow-sm"
              >
                <div
                  className={`w-2 h-2 sm:w-3 sm:h-3 ${item.color} rounded-full mr-1.5 sm:mr-2 border`}
                ></div>
                <item.icon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 mr-1.5 sm:mr-2" />
                <span className="text-xs sm:text-sm font-medium text-gray-700">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
            {/* Calendar */}
            <div className="lg:w-2/3 w-full">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="h-[45vh] sm:h-[55vh] lg:h-[65vh] overflow-y-auto">
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
                        backgroundColor: "#10B981",
                      })),
                      ...Object.keys(bookedDates).map((date) => ({
                        start: date,
                        end: date,
                        display: "background",
                        backgroundColor: "#EF4444",
                      })),
                    ]}
                    height="auto"
                    dayCellClassNames="hover:bg-gray-50 cursor-pointer transition-colors"
                    buttonText={{
                      prev: "‹",
                      next: "›",
                    }}
                    titleFormat={{ month: "long", year: "numeric" }}
                  />
                </div>
              </div>
            </div>

            {/* Desktop Time Slots */}
            <div className="lg:w-1/3 w-full hidden sm:block">
              {selectedDate ? (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6">
                  <div className="flex items-center mb-4 sm:mb-6">
                    <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-primary-100 rounded-full mr-3 sm:mr-4">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                        Time Slots
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {formatSelectedDate(selectedDate)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <button
                      onClick={handleSelectAllTimeSlots}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white text-sm sm:text-base font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105 shadow-md"
                    >
                      Select All Day
                    </button>

                    <div className="max-h-[45vh] sm:max-h-[50vh] overflow-y-auto space-y-2">
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
                            className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all duration-200 text-sm sm:text-base font-medium ${
                              isBooked
                                ? "bg-red-100 text-red-700 border border-red-200 cursor-not-allowed"
                                : isAvailable
                                ? "bg-green-100 text-green-700 border border-green-200 hover:bg-green-200"
                                : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
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
              ) : (
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 sm:p-8 text-center">
                  <Clock className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                    Select a Date
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Click on any date in the calendar to set your availability
                    for that day.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Time Slot Drawer */}
          <div
            className={`fixed top-0 right-0 h-full w-full sm:w-[85%] max-w-md bg-white shadow-2xl transform sm:hidden transition-transform duration-300 z-50 ${
              selectedDate ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  Time Slots
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  {formatSelectedDate(selectedDate)}
                </p>
              </div>
              <button
                onClick={() => setSelectedDate(null)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors ml-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6">
              <button
                onClick={handleSelectAllTimeSlots}
                className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white text-sm sm:text-base font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 mb-4 sm:mb-6"
              >
                Select All Day
              </button>

              <div className="space-y-2 sm:space-y-3 max-h-[60vh] overflow-y-auto">
                {timeSlots.map((slot) => {
                  const isAvailable =
                    availableTimes[selectedDate]?.includes(slot);
                  const isBooked = bookedDates[selectedDate]?.includes(slot);

                  return (
                    <button
                      key={slot}
                      onClick={() => handleTimeSlotClick(selectedDate, slot)}
                      className={`w-full px-4 py-3 rounded-xl transition-all duration-200 text-sm sm:text-base font-medium ${
                        isBooked
                          ? "bg-red-100 text-red-700 border border-red-200 cursor-not-allowed"
                          : isAvailable
                          ? "bg-green-100 text-green-700 border border-green-200 hover:bg-green-200"
                          : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
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

          {/* Important Note - Moved to bottom */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6 mt-6 sm:mt-8">
            <div className="flex items-start">
              <Info className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mt-0.5 mr-2 sm:mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-xs sm:text-sm font-medium text-blue-900 mb-1">
                  Important Note
                </h3>
                <p className="text-xs sm:text-sm text-blue-700">
                  Without setting your availability, potential clients won't be
                  able to book inspections for your properties. Make sure to
                  select all the times you're comfortable showing your
                  properties.
                </p>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-center mt-6 sm:mt-8">
            <button
              onClick={handleSaveChanges}
              disabled={isButtonLoading}
              className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white px-8 sm:px-12 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none shadow-lg hover:shadow-xl disabled:shadow-md flex items-center justify-center space-x-2"
            >
              {isButtonLoading ? (
                <>
                  <ButtonSpinner />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Save Availability</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentScheduler;
