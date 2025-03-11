import React, { useContext } from "react";
import { View, FlatList, StyleSheet, Alert } from "react-native";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../context/ThemeContext";
import { WorkShiftContext } from "../context/WorkShiftContext";
import ShiftCard from "../components/ShiftCard";

const AllShifts = ({ navigation }) => {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const { workShifts, activeShift, setActiveWorkShift, deleteWorkShift } =
    useContext(WorkShiftContext);

  const handleApplyShift = (shiftId) => {
    Alert.alert(t("apply_shift"), t("apply_shift_confirmation"), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("confirm"),
        onPress: async () => {
          const success = await setActiveWorkShift(shiftId);
          if (success) {
            Alert.alert(t("success"), t("shift_applied"));
          }
        },
      },
    ]);
  };

  const handleDeleteShift = (shiftId) => {
    Alert.alert(t("delete_shift_confirmation"), "", [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("confirm"),
        style: "destructive",
        onPress: async () => {
          const success = await deleteWorkShift(shiftId);
          if (success) {
            Alert.alert(t("success"), t("shift_deleted"));
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <ShiftCard
      shift={item}
      isActive={activeShift?.id === item.id}
      onApply={() => handleApplyShift(item.id)}
      onEdit={() => navigation.navigate("AddEditShift", { shift: item })}
      onDelete={() => handleDeleteShift(item.id)}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={workShifts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
});

export default AllShifts;
