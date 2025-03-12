import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  Animated,
} from "react-native";
import { format } from "date-fns";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

// Import contexts
import { ThemeContext } from "../context/ThemeContext";
import { LanguageContext } from "../context/LanguageContext";
import { AttendanceContext } from "../context/AttendanceContext";
import { NotesContext } from "../context/NotesContext";

// Import components
import MultiPurposeButton from "../components/MultiPurposeButton";
import WeekStatusGrid from "../components/WeekStatusGrid";
import NoteCard from "../components/NoteCard";

const HomeScreen = () => {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);
  const { t } = useContext(LanguageContext);
  const { todayStatus, handleMultiPurposeButton, resetTodayStatus } = useContext(AttendanceContext);
  const { notes, getRecentNotes } = useContext(NotesContext);

  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState("");
  const fadeAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(0.3))[0];

  // Animation for the confirmation modal
  useEffect(() => {
    if (confirmModalVisible) {
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
  }, [confirmModalVisible, fadeAnim, scaleAnim]);

  const handleMultiPurposeButtonPress = async () => {
    const now = new Date();

    // Check for time constraints based on current status
    if (todayStatus.status === "go_work") {
      // Check if 5 minutes have passed since go_work
      if (
        todayStatus.goWorkTime &&
        now - new Date(todayStatus.goWorkTime) < 300000
      ) {
        showConfirmation(
          t("check_in_confirmation"),
          () => executeMultiPurposeAction()
        );
        return;
      }
    } else if (todayStatus.status === "check_in") {
      // Check if 2 hours have passed since check_in
      if (
        todayStatus.checkInTime &&
        now - new Date(todayStatus.checkInTime) < 7200000
      ) {
        showConfirmation(
          t("check_out_confirmation"),
          () => executeMultiPurposeAction()
        );
        return;
      }
    }

    // If no time constraints or other status, proceed normally
    executeMultiPurposeAction();
  };

  const executeMultiPurposeAction = async () => {
    const success = await handleMultiPurposeButton();
    if (!success) {
      Alert.alert(t("error"), t("action_failed"));
    }
    setConfirmModalVisible(false);
  };

  const handleResetPress = () => {
    showConfirmation(t("reset_confirmation"), async () => {
      const success = await resetTodayStatus();
      if (!success) {
        Alert.alert(t("error"), t("reset_failed"));
      }
      setConfirmModalVisible(false);
    });
  };

  const showConfirmation = (message, onConfirm) => {
    setConfirmMessage(message);
    setConfirmAction(() => onConfirm);
    setConfirmModalVisible(true);
  };

  const renderResetButton = () => {
    // Only show reset button if the day has started (any status other than NOT_STARTED)
    if (todayStatus.status === "not_started") {
      return null;
    }

    return (
      <TouchableOpacity
        style={[styles.resetButton, { backgroundColor: theme.error + "20" }]}
        onPress={handleResetPress}
      >
        <Ionicons name="refresh-outline" size={18} color={theme.error} />
        <Text style={[styles.resetButtonText, { color: theme.error }]}>
          {t("reset_button")}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderStatusTime = () => {
    let timeLabel = "";
    let timeValue = null;

    switch (todayStatus.status) {
      case "go_work":
        timeLabel = t("go_work_time");
        timeValue = todayStatus.goWorkTime;
        break;
      case "check_in":
        timeLabel = t("check_in_time");
        timeValue = todayStatus.checkInTime;
        break;
      case "check_out":
        timeLabel = t("check_out_time");
        timeValue = todayStatus.checkOutTime;
        break;
      case "complete":
        timeLabel = t("complete_time");
        timeValue = todayStatus.completeTime;
        break;
      default:
        return null;
    }

    if (!timeValue) return null;

    return (
      <View style={styles.statusTimeContainer}>
        <Text style={[styles.statusTimeLabel, { color: theme.textSecondary }]}>
          {timeLabel}
        </Text>
        <Text style={[styles.statusTimeValue, { color: theme.text }]}>
          {format(new Date(timeValue), "HH:mm")}
        </Text>
      </View>
    );
  };

  const renderConfirmationModal = () => {
    return (
      <Modal
        transparent={true}
        visible={confirmModalVisible}
        onRequestClose={() => setConfirmModalVisible(false)}
        animationType="none"
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setConfirmModalVisible(false)}
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
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              {t("confirm")}
            </Text>
            <Text style={[styles.modalMessage, { color: theme.text }]}>
              {confirmMessage}
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.cancelButton,
                  { borderColor: theme.border },
                ]}
                onPress={() => setConfirmModalVisible(false)}
              >
                <Text style={[styles.modalButtonText, { color: theme.text }]}>
                  {t("cancel")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.confirmButton,
                  { backgroundColor: theme.primary },
                ]}
                onPress={confirmAction}
              >
                <Text style={styles.confirmButtonText}>{t("confirm")}</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    );
  };

  const renderWorkHours = () => {
    return (
      <View style={styles.workHoursContainer}>
        <Ionicons name="time-outline" size={16} color={theme.textSecondary} />
        <Text style={[styles.workHoursText, { color: theme.textSecondary }]}>
          {t("workHours")}
        </Text>
      </View>
    );
  };

  const recentNotes = getRecentNotes ? getRecentNotes(3) : (notes ? notes.slice(0, 3) : []);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Today's Date */}
      <View style={styles.dateContainer}>
        <Text style={[styles.dateText, { color: theme.textSecondary }]}>
          {t("today")}
        </Text>
        <Text style={[styles.date, { color: theme.text }]}>
          {format(new Date(), "EEEE, dd/MM/yyyy")}
        </Text>
        {renderWorkHours()}
      </View>

      {/* Multi-Purpose Button Section */}
      <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>
            {t("current_shift")}
          </Text>
          {renderResetButton()}
        </View>

        <View style={styles.buttonContainer}>
          <MultiPurposeButton
            status={todayStatus.status}
            onPress={handleMultiPurposeButtonPress}
            showSignButton={todayStatus.showSignButton}
          />
          {renderStatusTime()}
        </View>
      </View>

      {/* Weekly Status Grid */}
      <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>
          {t("weekly_status")}
        </Text>
        <WeekStatusGrid />
      </View>

      {/* Notes Section */}
      <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>
            {t("notes")}
          </Text>
          <TouchableOpacity
            style={[
              styles.addButton,
              { backgroundColor: theme.primary + "20" },
            ]}
            onPress={() => navigation.navigate("AddEditNote")}
          >
            <Ionicons name="add" size={18} color={theme.primary} />
            <Text style={[styles.addButtonText, { color: theme.primary }]}>
              {t("add_note")}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          {t("recent_notes")}
        </Text>

        {recentNotes && recentNotes.length > 0 ? (
          recentNotes.map((note) => <NoteCard key={note.id} note={note} />)
        ) : (
          <Text
            style={[styles.emptyNotesText, { color: theme.textSecondary }]}
          >
            {t("no_notes")}
          </Text>
        )}

        {notes && notes.length > 3 && (
          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={() => navigation.navigate("Notes")}
          >
            <Text
              style={[styles.viewAllButtonText, { color: theme.primary }]}
            >
              {t("view_all")}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {renderConfirmationModal()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  dateContainer: {
    marginBottom: 16,
  },
  dateText: {
    fontSize: 14,
  },
  date: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  workHoursContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  workHoursText: {
    fontSize: 12,
    marginLeft: 4,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  resetButtonText: {
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 4,
  },
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  statusTimeContainer: {
    marginTop: 16,
    alignItems: "center",
  },
  statusTimeLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  statusTimeValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 14,
    marginBottom: 12,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addButtonText: {
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 4,
  },
  emptyNotesText: {
    textAlign: "center",
    fontStyle: "italic",
    padding: 16,
  },
  viewAllButton: {
    alignSelf: "center",
    paddingVertical: 8,
    marginTop: 8,
  },
  viewAllButtonText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    borderRadius: 12,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    marginRight: 8,
    borderWidth: 1,
  },
  confirmButton: {
    marginLeft: 8,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default HomeScreen;
