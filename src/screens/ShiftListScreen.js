import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../context/ThemeContext";
import { LanguageContext } from "../context/LanguageContext";
import { ShiftContext } from "../context/ShiftContext";

const ITEMS_PER_PAGE = 3;

const ShiftListScreen = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const { t } = useContext(LanguageContext);
  const { shifts, deleteShift, applyShift, activeShiftId } =
    useContext(ShiftContext);

  const [currentPage, setCurrentPage] = useState(0);
  const [reminderOption, setReminderOption] = useState("none");

  const sortedShifts = [...shifts].sort((a, b) => {
    if (a.id === activeShiftId) return -1;
    if (b.id === activeShiftId) return 1;
    return 0;
  });

  const paginatedShifts = sortedShifts.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(shifts.length / ITEMS_PER_PAGE);

  const handleApplyShift = (shift) => {
    Alert.alert(t("shift.apply.title"), t("shift.apply.message"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("common.confirm"),
        onPress: () => {
          applyShift(shift.id, reminderOption);
          Alert.alert(t("success"), t("shift.apply.success"));
        },
      },
    ]);
  };

  const handleDeleteShift = (shiftId) => {
    Alert.alert(t("shift.delete.title"), t("shift.delete.message"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("common.delete"),
        style: "destructive",
        onPress: () => {
          deleteShift(shiftId);
          Alert.alert(t("success"), t("shift.delete.success"));
        },
      },
    ]);
  };

  const renderShiftItem = ({ item }) => {
    const isActive = item.id === activeShiftId;

    return (
      <View
        style={[
          styles.shiftCard,
          { backgroundColor: theme.surface },
          isActive && styles.activeShiftCard,
        ]}
      >
        <View style={styles.shiftInfo}>
          <Text style={[styles.shiftName, { color: theme.text }]}>
            {item.name}
          </Text>
          <Text style={[styles.shiftTime, { color: theme.textSecondary }]}>
            {new Date(item.startTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            -
            {new Date(item.endTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.primary }]}
            onPress={() => handleApplyShift(item)}
          >
            <Ionicons name="checkmark-circle" size={20} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.warning }]}
            onPress={() => navigation.navigate("AddEditShift", { shift: item })}
          >
            <MaterialIcons name="edit" size={20} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.error }]}
            onPress={() => handleDeleteShift(item.id)}
          >
            <MaterialIcons name="delete" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>
          {t("shift.list.title")}
        </Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.primary }]}
          onPress={() => navigation.navigate("AddEditShift")}
        >
          <MaterialIcons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.reminderContainer}>
        <Text style={[styles.reminderLabel, { color: theme.text }]}>
          {t("shift.reminder.label")}
        </Text>
        <TouchableOpacity
          style={[styles.reminderPicker, { borderColor: theme.border }]}
          onPress={() => {
            // TODO: Implement reminder options picker
            setReminderOption("onChange");
          }}
        >
          <Text style={[styles.reminderText, { color: theme.text }]}>
            {t(`shift.reminder.${reminderOption}`)}
          </Text>
          <MaterialIcons name="arrow-drop-down" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      {shifts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            {t("no_shifts_available")}
          </Text>
        </View>
      ) : (
        <FlatList
          data={paginatedShifts}
          renderItem={renderShiftItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}

      {totalPages > 1 && (
        <View style={styles.pagination}>
          <TouchableOpacity
            style={[styles.pageButton, { opacity: currentPage > 0 ? 1 : 0.5 }]}
            onPress={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
          >
            <MaterialIcons name="chevron-left" size={24} color={theme.text} />
          </TouchableOpacity>

          <Text style={[styles.pageText, { color: theme.text }]}>
            {currentPage + 1} / {totalPages}
          </Text>

          <TouchableOpacity
            style={[
              styles.pageButton,
              { opacity: currentPage < totalPages - 1 ? 1 : 0.5 },
            ]}
            onPress={() =>
              setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
            }
            disabled={currentPage === totalPages - 1}
          >
            <MaterialIcons name="chevron-right" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  reminderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  reminderLabel: {
    fontSize: 16,
    marginRight: 8,
  },
  reminderPicker: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 8,
    flex: 1,
  },
  reminderText: {
    flex: 1,
  },
  listContainer: {
    paddingBottom: 16,
  },
  shiftCard: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  activeShiftCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  shiftInfo: {
    flex: 1,
  },
  shiftName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  shiftTime: {
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
  },
  pageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  pageText: {
    marginHorizontal: 16,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontStyle: 'italic',
  },
});

export default ShiftListScreen;
