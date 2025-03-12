import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { format } from "date-fns";

export const AttendanceContext = createContext();

// Status constants
export const STATUS_TYPES = {
  NOT_STARTED: "not_started",
  GO_WORK: "go_work",
  CHECK_IN: "check_in",
  CHECK_OUT: "check_out",
  COMPLETE: "complete",
  ABSENT: "absent",
  LEAVE: "leave",
  SICK: "sick",
  HOLIDAY: "holiday",
  LATE_OR_EARLY: "late_or_early",
};

export const AttendanceProvider = ({ children }) => {
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [todayStatus, setTodayStatus] = useState({
    status: STATUS_TYPES.NOT_STARTED,
    goWorkTime: null,
    checkInTime: null,
    checkOutTime: null,
    completeTime: null,
    showSignButton: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAttendanceRecords();
  }, []);

  const loadAttendanceRecords = async () => {
    try {
      setLoading(true);
      const data = await AsyncStorage.getItem("attendanceRecords");
      const todayData = await AsyncStorage.getItem(
        `attendance_${format(new Date(), "yyyy-MM-dd")}`
      );

      if (data) {
        setAttendanceRecords(JSON.parse(data));
      }

      if (todayData) {
        setTodayStatus(JSON.parse(todayData));
      } else {
        // Reset today's status if not exists
        setTodayStatus({
          status: STATUS_TYPES.NOT_STARTED,
          goWorkTime: null,
          checkInTime: null,
          checkOutTime: null,
          completeTime: null,
          showSignButton: false,
        });
      }
    } catch (e) {
      console.error("Failed to load attendance records", e);
    } finally {
      setLoading(false);
    }
  };

  const updateTodayStatus = async (newStatus) => {
    try {
      const today = format(new Date(), "yyyy-MM-dd");
      const updatedStatus = { ...todayStatus, ...newStatus };

      // Save today's status
      await AsyncStorage.setItem(
        `attendance_${today}`,
        JSON.stringify(updatedStatus)
      );
      setTodayStatus(updatedStatus);

      // Update the attendance records
      const updatedRecords = { ...attendanceRecords };
      updatedRecords[today] = updatedStatus;
      await AsyncStorage.setItem(
        "attendanceRecords",
        JSON.stringify(updatedRecords)
      );
      setAttendanceRecords(updatedRecords);

      return true;
    } catch (e) {
      console.error("Failed to update today's status", e);
      return false;
    }
  };

  const resetTodayStatus = async () => {
    try {
      const today = format(new Date(), "yyyy-MM-dd");
      const resetStatus = {
        status: STATUS_TYPES.NOT_STARTED,
        goWorkTime: null,
        checkInTime: null,
        checkOutTime: null,
        completeTime: null,
        showSignButton: false,
      };

      await AsyncStorage.setItem(
        `attendance_${today}`,
        JSON.stringify(resetStatus)
      );
      setTodayStatus(resetStatus);

      // Update the attendance records
      const updatedRecords = { ...attendanceRecords };
      updatedRecords[today] = resetStatus;
      await AsyncStorage.setItem(
        "attendanceRecords",
        JSON.stringify(updatedRecords)
      );
      setAttendanceRecords(updatedRecords);

      // Here you would also re-enable any reminders for the day
      // resetReminders();

      return true;
    } catch (e) {
      console.error("Failed to reset today's status", e);
      return false;
    }
  };

  const updateDateStatus = async (date, status) => {
    try {
      const formattedDate = format(new Date(date), "yyyy-MM-dd");

      // Update the attendance records
      const updatedRecords = { ...attendanceRecords };
      updatedRecords[formattedDate] = status;
      await AsyncStorage.setItem(
        "attendanceRecords",
        JSON.stringify(updatedRecords)
      );
      setAttendanceRecords(updatedRecords);

      // If it's today, also update today's status
      if (formattedDate === format(new Date(), "yyyy-MM-dd")) {
        await AsyncStorage.setItem(
          `attendance_${formattedDate}`,
          JSON.stringify(status)
        );
        setTodayStatus(status);
      }

      return true;
    } catch (e) {
      console.error("Failed to update date status", e);
      return false;
    }
  };

  const getWeeklyAttendance = (startDate = new Date()) => {
    const result = [];
    const currentDate = new Date(startDate);

    // Go to Monday of the current week
    const day = currentDate.getDay();
    const diff = currentDate.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    currentDate.setDate(diff);

    // Get records for the 7 days of the week
    for (let i = 0; i < 7; i++) {
      const dateStr = format(currentDate, "yyyy-MM-dd");
      result.push({
        date: new Date(currentDate),
        dateStr,
        status: attendanceRecords[dateStr] || {
          status: STATUS_TYPES.NOT_STARTED,
        },
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return result;
  };

  // Check if we can transition to the next status
  const canTransition = (from, to) => {
    // Define valid transitions
    const validTransitions = {
      [STATUS_TYPES.NOT_STARTED]: [
        STATUS_TYPES.GO_WORK,
        STATUS_TYPES.ABSENT,
        STATUS_TYPES.LEAVE,
        STATUS_TYPES.SICK,
        STATUS_TYPES.HOLIDAY,
      ],
      [STATUS_TYPES.GO_WORK]: [STATUS_TYPES.CHECK_IN],
      [STATUS_TYPES.CHECK_IN]: [STATUS_TYPES.CHECK_OUT],
      [STATUS_TYPES.CHECK_OUT]: [STATUS_TYPES.COMPLETE],
    };

    return validTransitions[from]?.includes(to) || false;
  };

  // Handle the multi-purpose button press
  const handleMultiPurposeButton = async () => {
    const now = new Date();

    switch (todayStatus.status) {
      case STATUS_TYPES.NOT_STARTED:
        // go_work → Đi Làm (Lưu thời gian đi làm, hiển thị thời gian ngay bên dưới)
        return await updateTodayStatus({
          status: STATUS_TYPES.GO_WORK,
          goWorkTime: now.toISOString(),
        });

      case STATUS_TYPES.GO_WORK:
        // check_in → Chấm Công Vào (Lưu thời gian chấm công vào, hiển thị thời gian ngay bên dưới)
        // Check minimum time difference (5 minutes = 300000 ms)
        if (
          todayStatus.goWorkTime &&
          now - new Date(todayStatus.goWorkTime) < 300000
        ) {
          // Confirmation is handled in the UI (HomeScreen.js)
          return false;
        }
        
        {
          // Determine if sign button should be shown (this could be based on settings or other criteria)
          const showSignButton = Math.random() > 0.5; // Example: randomly decide for demo purposes
          
          return await updateTodayStatus({
            status: STATUS_TYPES.CHECK_IN,
            checkInTime: now.toISOString(),
            showSignButton,
          });
        }

      case STATUS_TYPES.CHECK_IN:
        // check_out → Tan Làm (Lưu thời gian chấm công ra, hiển thị thời gian ngay bên dưới)
        // Check minimum time difference (2 hours = 7200000 ms)
        if (
          todayStatus.checkInTime &&
          now - new Date(todayStatus.checkInTime) < 7200000
        ) {
          // Confirmation is handled in the UI (HomeScreen.js)
          return false;
        }
        return await updateTodayStatus({
          status: STATUS_TYPES.CHECK_OUT,
          checkOutTime: now.toISOString(),
        });

      case STATUS_TYPES.CHECK_OUT:
        // complete → Hoàn Tất
        return await updateTodayStatus({
          status: STATUS_TYPES.COMPLETE,
          completeTime: now.toISOString(),
          showSignButton: false,
        });

      default:
        return false;
    }
  };

  const getDateHistory = (date) => {
    const formattedDate = format(new Date(date), "yyyy-MM-dd");
    const record = attendanceRecords[formattedDate];

    if (!record) return [];

    const history = [];

    // Add status changes to history in chronological order
    if (record.goWorkTime) {
      history.push({
        status: STATUS_TYPES.GO_WORK,
        time: record.goWorkTime,
      });
    }

    if (record.checkInTime) {
      history.push({
        status: STATUS_TYPES.CHECK_IN,
        time: record.checkInTime,
      });
    }

    if (record.checkOutTime) {
      history.push({
        status: STATUS_TYPES.CHECK_OUT,
        time: record.checkOutTime,
      });
    }

    if (record.completeTime) {
      history.push({
        status: STATUS_TYPES.COMPLETE,
        time: record.completeTime,
      });
    }

    // Sort history by time
    return history.sort((a, b) => new Date(a.time) - new Date(b.time));
  };

  return (
    <AttendanceContext.Provider
      value={{
        attendanceRecords,
        todayStatus,
        loading,
        updateTodayStatus,
        resetTodayStatus,
        updateDateStatus,
        getWeeklyAttendance,
        handleMultiPurposeButton,
        getDateHistory,
        STATUS_TYPES,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};
