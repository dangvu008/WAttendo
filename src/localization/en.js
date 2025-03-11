export default {
  // Common
  app_name: 'Attendo',
  confirm: 'Confirm',
  cancel: 'Cancel',
  save: 'Save',
  delete: 'Delete',
  edit: 'Edit',
  add: 'Add',
  reset: 'Reset',
  apply: 'Apply',
  error: 'Error',
  view_all: 'View All',
  success: 'Success',
  
  // Home Screen
  today: 'Today',
  current_shift: 'Current Shift',
  multi_purpose_button: {
    go_work: 'Go to Work',
    check_in: 'Check In',
    check_out: 'Check Out',
    complete: 'Complete',
    sign: 'Sign',
    not_started: 'Not Started'
  },
  reset_button: 'Reset',
  reset_confirmation: 'Are you sure you want to reset today\'s status?',
  check_in_confirmation: 'It\'s been less than 5 minutes since you started going to work. Are you sure you want to check in now?',
  check_out_confirmation: 'It\'s been less than 2 hours since you checked in. Are you sure you want to check out now?',
  action_failed: 'The action could not be completed. Please try again.',
  reset_failed: 'Reset failed. Please try again.',
  weekly_status: 'Weekly Status',
  notes: 'Work Notes',
  add_note: 'Add Note',
  recent_notes: 'Recent Notes',
  no_notes: 'No notes available',
  no_shifts_available: 'No shifts available',
  
  // Time labels
  go_work_time: 'Go to Work Time',
  check_in_time: 'Check In Time',
  check_out_time: 'Check Out Time',
  complete_time: 'Complete Time',
  time_constraint_warning: 'Time Constraint Warning',

  // Work Status
  status: {
    not_started: 'Not Started',
    go_work: 'Going to Work',
    check_in: 'Checked In',
    check_out: 'Checked Out',
    complete: 'Completed',
    incomplete: 'Incomplete',
    absent: 'Absent',
    leave: 'Leave',
    sick: 'Sick',
    holiday: 'Holiday',
    late_or_early: 'Late/Early',
    not_set: 'Not Set',
    current: 'On Leave',
    label: 'Status'
  },

  // Week Days
  weekdays: {
    short: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    long: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  },

  // Status History
  history: {
    title: 'Status History',
    no_records: 'No history records available'
  },
  
  // Current Status
  current_status: 'Current Status',
  update_status: 'Update Status',
  change_status: 'Change Status',
  close: 'Close',

  // Settings Screen
  settings: 'Settings',
  work_shifts: 'Work Shifts',
  add_shift: 'Add Work Shift',
  edit_shift: 'Edit Work Shift',
  apply_shift: 'Apply Shift',
  apply_shift_confirmation: 'Apply this shift to the current week?',
  delete_shift_confirmation: 'Are you sure you want to delete this work shift?',
  reminder_setting: 'Reminder Settings',
  general_settings: 'General Settings',
  dark_mode: 'Dark Mode',
  language: 'Language',
  notification_sound: 'Notification Sound',
  vibration: 'Vibration',
  workHours: '08:00 - 20:00',
  see_more: 'See More',

  // Shift List Screen
  shift: {
    list: {
      title: 'Work Shifts'
    },
    apply: {
      title: 'Apply Shift',
      message: 'Do you want to apply this shift to your schedule?',
      success: 'Shift applied successfully'
    },
    delete: {
      title: 'Delete Shift',
      message: 'Are you sure you want to delete this shift?',
      success: 'Shift deleted successfully'
    },
    reminder: {
      label: 'Reminder Option',
      none: 'No Reminder',
      onChange: 'On Status Change',
      daily: 'Daily',
      beforeStart: 'Before Start',
      afterEnd: 'After End'
    }
  },

  // Common actions
  common: {
    cancel: 'Cancel',
    confirm: 'Confirm',
    delete: 'Delete',
    save: 'Save'
  },

  // Work Shift Form
  shift_name: 'Shift Name',
  departure_time: 'Departure Time',
  start_time: 'Start Time',
  end_time: 'End Time',
  reminder_before: 'Reminder Before Start',
  reminder_after: 'Reminder After End',
  show_sign_button: 'Show Sign Button',
  days_applied: 'Days Applied',
  shift_name_required: 'Shift name is required',
  shift_name_length: 'Shift name must be less than 200 characters',
  shift_name_duplicate: 'A shift with this name already exists',
  
  // Notes Form
  note_title: 'Title',
  note_content: 'Content',
  note_title_placeholder: 'Enter note title',
  note_content_placeholder: 'Enter note content',
  reminder_time: 'Reminder Time',
  reminder_days: 'Reminder Days',
  note_title_required: 'Title is required',
  note_title_length: 'Title must be less than 100 characters',
  note_content_required: 'Content is required',
  note_content_length: 'Content must be less than 300 characters',
  delete_note: 'Delete Note',
  delete_note_confirmation: 'Are you sure you want to delete this note?',
  delete_note_error: 'Failed to delete note',
  save_note_error: 'Failed to save note',
  no_reminder_days: 'No reminder days set',
  everyday: 'Every day',

  // Time intervals
  time_intervals: {
    '5_min': '5 minutes',
    '10_min': '10 minutes',
    '15_min': '15 minutes',
    '30_min': '30 minutes',
    '1_hour': '1 hour'
  }
};