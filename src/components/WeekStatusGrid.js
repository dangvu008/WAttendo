import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  ScrollView,
} from "react-native";
import { format, startOfWeek, addDays, isAfter } from "date-fns";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../context/ThemeContext";
import { LanguageContext } from "../context/LanguageContext";
import { AttendanceContext, STATUS_TYPES } from "../context/AttendanceContext";

const WeekStatusGrid = () => {
  const { theme } = useContext(ThemeContext);
  const { t } = useContext(LanguageContext);
  const { getWeeklyAttendance, updateDateStatus, getDateHistory } =
    useContext(AttendanceContext);

  const [selectedDay, setSelectedDay] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(0.3))[0];

  useEffect(() => {
    if (detailModalVisible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.3);
    }
  }, [detailModalVisible, fadeAnim, scaleAnim]);

  const weeklyData = getWeeklyAttendance();
  const today = new Date();

  const getStatusIcon = (status, isFutureDate = false) => {
    if (isFutureDate) {
      return { icon: "❓", color: "#9E9E9E", label: t("status.not_set") };
    }

    switch (status) {
      case STATUS_TYPES.COMPLETE:
        return { icon: "✅", color: "#4CAF50", label: t("status.complete") };
      case STATUS_TYPES.GO_WORK:
      case STATUS_TYPES.CHECK_IN:
      case STATUS_TYPES.CHECK_OUT:
        return { icon: "❗", color: "#FF9800", label: t("status.incomplete") };
      case STATUS_TYPES.ABSENT:
        return { icon: "❌", color: "#F44336", label: t("status.absent") };
      case STATUS_TYPES.LEAVE:
        return { icon: "📩", color: "#2196F3", label: t("status.leave") };
      case STATUS_TYPES.SICK:
        return { icon: "🛌", color: "#9C27B0", label: t("status.sick") };
      case STATUS_TYPES.HOLIDAY:
        return { icon: "🎌", color: "#E91E63", label: t("status.holiday") };
      case STATUS_TYPES.LATE_OR_EARLY:
        return {
          icon: "⏱️",
          color: "#FF5722",
          label: t("status.late_or_early"),
        };
      default:
        return { icon: "--", color: "#9E9E9E", label: t("status.not_set") };
    }
  };

  const handleDayPress = (day) => {
    // Don't allow interaction with future dates
    if (isAfter(new Date(day.date), today)) {
      return;
    }
    setSelectedDay(day);
    setDetailModalVisible(true);
  };

  const renderWeekGrid = () => {
    const days = t("weekdays.short");
    const currentDate = new Date();
    const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 });

    return (
      <View style={styles.weekContainer}>
        <View style={[styles.dayHeaderRow, { backgroundColor: theme.primary }]}>
          {days.map((day, index) => (
            <View key={`header-${index}`} style={styles.dayHeaderCell}>
              <Text
                style={[
                  styles.dayHeaderText,
                  { color: index === 6 ? "#FFD700" : "#FFFFFF" },
                ]}
              >
                {day}
              </Text>
            </View>
          ))}
        </View>

        <View style={[styles.dateRow, { backgroundColor: theme.cardBackground }]}>
          {days.map((_, index) => {
            const date = addDays(startOfCurrentWeek, index);
            const dateStr = format(date, "dd");
            const isToday =
              format(date, "yyyy-MM-dd") === format(currentDate, "yyyy-MM-dd");
            const isFutureDate = isAfter(date, currentDate);
            
            const dayData = weeklyData.find(
              (d) =>
                format(new Date(d.date), "yyyy-MM-dd") ===
                format(date, "yyyy-MM-dd")
            );
            
            const status = dayData
              ? getStatusIcon(dayData.status.status, isFutureDate)
              : getStatusIcon(null, isFutureDate);

            return (
              <TouchableOpacity
                key={`date-${index}`}
                style={[
                  styles.dateCell, 
                  isToday && styles.todayCell,
                  { borderColor: theme.border }
                ]}
                onPress={() =>
                  handleDayPress(
                    dayData || {
                      date: format(date, "yyyy-MM-dd"),
                      status: { status: STATUS_TYPES.NOT_STARTED },
                    }
                  )
                }
                disabled={isFutureDate}
              >
                <Text style={[styles.dateText, { color: theme.text }]}>
                  {dateStr}
                </Text>
                <Text style={[styles.statusIcon, { color: status.color }]}>
                  {status.icon}
                </Text>
                <Text style={[styles.statusLabel, { color: status.color }]}>
                  {status.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  const renderStatusOptions = () => {
    const statusOptions = [
      { status: STATUS_TYPES.COMPLETE, icon: "✅" },
      { status: STATUS_TYPES.ABSENT, icon: "❌" },
      { status: STATUS_TYPES.LEAVE, icon: "📩" },
      { status: STATUS_TYPES.SICK, icon: "🛌" },
      { status: STATUS_TYPES.HOLIDAY, icon: "🎌" },
      { status: STATUS_TYPES.LATE_OR_EARLY, icon: "⏱️" },
    ];

    return (
      <View style={styles.statusOptions}>
        {statusOptions.map((option) => {
          const statusConfig = getStatusIcon(option.status);
          return (
            <TouchableOpacity
              key={option.status}
              style={[
                styles.statusOption,
                { backgroundColor: statusConfig.color + "20", borderColor: statusConfig.color }
              ]}
              onPress={() => {
                updateDateStatus(selectedDay.date, {
                  status: option.status,
                });
                setDetailModalVisible(false);
              }}
            >
              <Text style={styles.statusOptionIcon}>{option.icon}</Text>
              <Text style={[styles.statusOptionText, { color: theme.text }]}>
                {t(`status.${option.status}`)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const renderHistoryDetails = () => {
    const history = getDateHistory(selectedDay.date);
    
    if (history.length === 0) {
      return (
        <Text style={[styles.noHistoryText, { color: theme.textSecondary }]}>
          {t("history.no_records")}
        </Text>
      );
    }

    return history.map((record, index) => (
      <View key={index} style={styles.historyItem}>
        <View style={[styles.historyIconContainer, { backgroundColor: theme.primary + "20" }]}>
          <Text style={styles.historyIcon}>
            {getStatusIcon(record.status).icon}
          </Text>
        </View>
        <View style={styles.historyContent}>
          <Text style={[styles.historyAction, { color: theme.text }]}>
            {t(`status.${record.status}`)}
          </Text>
          <Text style={[styles.historyTime, { color: theme.textSecondary }]}>
            {format(new Date(record.time), "HH:mm")}
          </Text>
        </View>
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      {renderWeekGrid()}

      <Modal
        animationType="none"
        transparent={true}
        visible={detailModalVisible}
        onRequestClose={() => setDetailModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setDetailModalVisible(false)}
        >
          <Animated.View
            style={[
              styles.modalContent,
              {
                backgroundColor: theme.cardBackground,
                transform: [{ scale: scaleAnim }],
                opacity: fadeAnim,
              },
            ]}
          >
            {selectedDay && (
              <ScrollView>
                <View style={styles.modalHeader}>
                  <Text style={[styles.modalTitle, { color: theme.text }]}>
                    {format(new Date(selectedDay.date), "EEEE, dd/MM/yyyy")}
                  </Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setDetailModalVisible(false)}
                  >
                    <Ionicons name="close" size={24} color={theme.text} />
                  </TouchableOpacity>
                </View>

                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                  {t("current_status")}
                </Text>
                <View style={[styles.currentStatusContainer, { backgroundColor: theme.background }]}>
                  <Text style={[styles.currentStatus, { color: theme.text }]}>
                    {getStatusIcon(selectedDay.status.status).icon} {getStatusIcon(selectedDay.status.status).label}
                  </Text>
                </View>

                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                  {t("change_status")}
                </Text>
                {renderStatusOptions()}

                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                  {t("history.title")}
                </Text>
                <View style={styles.historyContainer}>
                  {renderHistoryDetails()}
                </View>
              </ScrollView>
            )}
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  weekContainer: {
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dayHeaderRow: {
    flexDirection: "row",
    paddingVertical: 10,
  },
  dayHeaderCell: {
    flex: 1,
    alignItems: "center",
  },
  dayHeaderText: {
    fontWeight: "bold",
    fontSize: 14,
  },
  dateRow: {
    flexDirection: "row",
  },
  dateCell: {
    flex: 1,
    alignItems: "center",
    padding: 8,
    borderWidth: 0.5,
    aspectRatio: 1,
  },
  todayCell: {
    borderWidth: 2,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statusIcon: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 2,
  },
  statusLabel: {
    fontSize: 8,
    textAlign: 'center',
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    maxHeight: "80%",
    borderRadius: 12,
    padding: 16,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  currentStatusContainer: {
    padding: 12,
    borderRadius: 8,
  },
  currentStatus: {
    fontSize: 16,
    textAlign: "center",
  },
  statusOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statusOption: {
    width: "48%",
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
    marginBottom: 8,
    alignItems: "center",
  },
  statusOptionIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  statusOptionText: {
    fontSize: 14,
    textAlign: "center",
  },
  historyContainer: {
    marginTop: 8,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  historyIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  historyIcon: {
    fontSize: 18,
  },
  historyContent: {
    flex: 1,
  },
  historyAction: {
    fontSize: 14,
    fontWeight: "500",
  },
  historyTime: {
    fontSize: 12,
  },
  noHistoryText: {
    textAlign: "center",
    fontStyle: "italic",
    padding: 16,
  },
});

export default WeekStatusGrid;
