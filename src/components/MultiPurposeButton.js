import React, { useContext } from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  View 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../context/ThemeContext';
import { LanguageContext } from '../context/LanguageContext';
import { STATUS_TYPES } from '../context/AttendanceContext';

const MultiPurposeButton = ({ status, onPress, showSignButton = false }) => {
  const { theme } = useContext(ThemeContext);
  const { t } = useContext(LanguageContext);

  const getButtonConfig = () => {
    switch (status) {
      case STATUS_TYPES.NOT_STARTED:
        return {
          text: t('multi_purpose_button.go_work'),
          icon: 'briefcase-outline',
          bgColor: theme.secondary,
          visible: true,
        };
      case STATUS_TYPES.GO_WORK:
        return {
          text: t('multi_purpose_button.check_in'),
          icon: 'enter-outline',
          bgColor: theme.primary,
          visible: true,
        };
      case STATUS_TYPES.CHECK_IN:
        return {
          text: t('multi_purpose_button.check_out'),
          icon: 'exit-outline',
          bgColor: theme.accent,
          visible: true,
        };
      case STATUS_TYPES.CHECK_OUT:
        return {
          text: showSignButton ? t('multi_purpose_button.sign') : t('multi_purpose_button.complete'),
          icon: showSignButton ? 'create-outline' : 'checkmark-done-outline',
          bgColor: theme.primary,
          visible: true,
        };
      case STATUS_TYPES.COMPLETE:
        return {
          text: t('multi_purpose_button.complete'),
          icon: 'checkmark-circle-outline',
          bgColor: theme.secondary,
          visible: false,
        };
      default:
        return {
          text: t('multi_purpose_button.go_work'),
          icon: 'briefcase-outline',
          bgColor: theme.secondary,
          visible: true,
        };
    }
  };

  const { text, icon, bgColor, visible = true } = getButtonConfig();

  if (!visible) {
    return null;
  }

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: bgColor },
        styles.buttonShadow,
      ]}
      onPress={onPress}
    >
      <View style={styles.contentContainer}>
        <Ionicons name={icon} size={36} color="white" />
        <Text style={styles.text}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonShadow: {
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  contentContainer: {
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default MultiPurposeButton;