import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";

import { ThemeContext } from "../context/ThemeContext";
import { LanguageContext } from "../context/LanguageContext";
import { NotesContext } from "../context/NotesContext";

const NoteCard = ({ note }) => {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);
  const { t } = useContext(LanguageContext);
  const { deleteNote } = useContext(NotesContext);

  const handleEdit = () => {
    navigation.navigate("AddEditNote", { note });
  };

  const handleDelete = () => {
    Alert.alert(
      t("delete_note"),
      t("delete_note_confirmation"),
      [
        {
          text: t("cancel"),
          style: "cancel",
        },
        {
          text: t("delete"),
          onPress: async () => {
            try {
              await deleteNote(note.id);
            } catch (error) {
              Alert.alert(t("error"), t("delete_note_error"));
            }
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const formatReminderTime = (timeString) => {
    try {
      return format(new Date(timeString), "HH:mm");
    } catch (error) {
      return "--:--";
    }
  };

  const formatReminderDays = (days) => {
    if (!days || !Array.isArray(days) || days.length === 0) {
      return t("no_reminder_days");
    }

    const weekdaysShort = t("weekdays.short", { returnObjects: true });
    return days.map(day => weekdaysShort[day - 1]).join(", ");
  };

  // Truncate content if it's too long
  const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.cardBackground, borderColor: theme.border },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>
          {truncateText(note.title, 40)}
        </Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.primary + "20" }]}
            onPress={handleEdit}
          >
            <Ionicons name="create-outline" size={18} color={theme.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.error + "20" }]}
            onPress={handleDelete}
          >
            <Ionicons name="trash-outline" size={18} color={theme.error} />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={[styles.content, { color: theme.textSecondary }]}>
        {truncateText(note.content, 100)}
      </Text>

      <View style={styles.footer}>
        <View style={styles.reminderContainer}>
          <Ionicons name="time-outline" size={16} color={theme.textSecondary} />
          <Text style={[styles.reminderText, { color: theme.textSecondary }]}>
            {formatReminderTime(note.reminderTime)}
          </Text>
        </View>
        <View style={styles.reminderContainer}>
          <Ionicons name="calendar-outline" size={16} color={theme.textSecondary} />
          <Text style={[styles.reminderText, { color: theme.textSecondary }]}>
            {formatReminderDays(note.reminderDays)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  actionButtons: {
    flexDirection: "row",
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  content: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 0.5,
    borderTopColor: "#E0E0E0",
    paddingTop: 8,
  },
  reminderContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  reminderText: {
    fontSize: 12,
    marginLeft: 4,
  },
});

export default NoteCard;