import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import "./RoomCalender.css";

export default function RoomCalendar({ roomId }) {
  const [bookedRanges, setBookedRanges] = useState([]);

  useEffect(() => {
    const fetchBookedDates = async () => {
      const res = await axios.get(
        `http://localhost:5000/api/rooms/${roomId}/booked-dates`,
        { withCredentials: true }
      );
      setBookedRanges(res.data);
    };

    fetchBookedDates();
  }, [roomId]);

  // disable booked dates
  const isDateDisabled = (date) => {
    return bookedRanges.some((range) => {
      const start = new Date(range.check_in);
      const end = new Date(range.check_out);

      return date >= start && date < end;
    });
  };

  return (
    <div className="calendar-wrapper">
      <Calendar
        tileDisabled={({ date }) => isDateDisabled(date)}
      />
    </div>
  );
}