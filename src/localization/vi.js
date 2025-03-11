export default {
  // Common
  app_name: 'Attendo',
  confirm: 'Xác nhận',
  cancel: 'Hủy',
  save: 'Lưu',
  delete: 'Xóa',
  edit: 'Sửa',
  add: 'Thêm',
  reset: 'Đặt lại',
  apply: 'Áp dụng',
  error: 'Lỗi',
  view_all: 'Xem tất cả',
  success: 'Thành công',
  
  // Home Screen
  today: 'Hôm nay',
  current_shift: 'Ca hiện tại',
  multi_purpose_button: {
    go_work: 'Đi làm',
    check_in: 'Chấm công vào',
    check_out: 'Tan làm',
    complete: 'Hoàn tất',
    sign: 'Ký công',
    not_started: 'Chưa bắt đầu'
  },
  reset_button: 'Đặt lại',
  reset_confirmation: 'Bạn có chắc chắn muốn đặt lại trạng thái hôm nay?',
  check_in_confirmation: 'Chưa đến 5 phút kể từ khi bạn bắt đầu đi làm. Bạn có chắc chắn muốn chấm công vào bây giờ?',
  check_out_confirmation: 'Chưa đến 2 giờ kể từ khi bạn chấm công vào. Bạn có chắc chắn muốn tan làm bây giờ?',
  action_failed: 'Không thể hoàn thành hành động. Vui lòng thử lại.',
  reset_failed: 'Đặt lại thất bại. Vui lòng thử lại.',
  weekly_status: 'Trạng thái tuần',
  notes: 'Ghi chú công việc',
  add_note: 'Thêm ghi chú',
  recent_notes: 'Ghi chú gần đây',
  no_notes: 'Không có ghi chú',
  
  // Time labels
  go_work_time: 'Thời gian đi làm',
  check_in_time: 'Thời gian chấm công vào',
  check_out_time: 'Thời gian tan làm',
  complete_time: 'Thời gian hoàn tất',
  time_constraint_warning: 'Cảnh báo về thời gian',

  // Work Status
  status: {
    not_started: 'Chưa bắt đầu',
    go_work: 'Đang đi làm',
    check_in: 'Đã chấm công vào',
    check_out: 'Đã tan làm',
    complete: 'Đã hoàn tất',
    incomplete: 'Chưa hoàn tất',
    absent: 'Vắng',
    leave: 'Nghỉ phép',
    sick: 'Nghỉ bệnh',
    holiday: 'Nghỉ lễ',
    late_or_early: 'Muộn/Sớm',
    not_set: 'Chưa thiết lập',
    current: 'Nghỉ phép',
    label: 'Trạng thái'
  },

  // Week Days
  weekdays: {
    short: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
    long: ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật']
  },

  // Status History
  history: {
    title: 'Lịch sử trạng thái',
    no_records: 'Không có bản ghi lịch sử'
  },
  
  // Current Status
  current_status: 'Trạng thái hiện tại',
  update_status: 'Cập nhật trạng thái',
  change_status: 'Thay đổi trạng thái',
  close: 'Đóng',

  // Settings Screen
  settings: 'Cài đặt',
  work_shifts: 'Ca làm việc',
  add_shift: 'Thêm ca làm việc',
  edit_shift: 'Sửa ca làm việc',
  apply_shift: 'Áp dụng ca',
  apply_shift_confirmation: 'Áp dụng ca này cho tuần hiện tại?',
  delete_shift_confirmation: 'Bạn có chắc chắn muốn xóa ca làm việc này?',
  reminder_setting: 'Cài đặt nhắc nhở',
  general_settings: 'Cài đặt chung',
  dark_mode: 'Chế độ tối',
  language: 'Ngôn ngữ',
  notification_sound: 'Âm thanh thông báo',
  vibration: 'Rung',
  workHours: '08:00 - 20:00',
  see_more: 'Xem thêm',

  // Shift List Screen
  shift: {
    list: {
      title: 'Ca làm việc'
    },
    apply: {
      title: 'Áp dụng ca',
      message: 'Bạn có muốn áp dụng ca này vào lịch trình của bạn?',
      success: 'Áp dụng ca thành công'
    },
    delete: {
      title: 'Xóa ca',
      message: 'Bạn có chắc chắn muốn xóa ca này?',
      success: 'Xóa ca thành công'
    },
    reminder: {
      label: 'Tùy chọn nhắc nhở',
      none: 'Không nhắc nhở',
      onChange: 'Khi thay đổi trạng thái',
      daily: 'Hàng ngày',
      beforeStart: 'Trước giờ bắt đầu',
      afterEnd: 'Sau giờ kết thúc'
    }
  },

  // Common actions
  common: {
    cancel: 'Hủy',
    confirm: 'Xác nhận',
    delete: 'Xóa',
    save: 'Lưu'
  },

  // Work Shift Form
  shift_name: 'Tên ca',
  departure_time: 'Giờ xuất phát',
  start_time: 'Giờ bắt đầu',
  end_time: 'Giờ kết thúc',
  reminder_before: 'Nhắc nhở trước giờ bắt đầu',
  reminder_after: 'Nhắc nhở sau giờ kết thúc',
  show_sign_button: 'Hiển thị nút ký công',
  days_applied: 'Ngày áp dụng',
  shift_name_required: 'Tên ca làm việc là bắt buộc',
  shift_name_length: 'Tên ca làm việc phải ít hơn 200 ký tự',
  shift_name_duplicate: 'Ca làm việc có tên này đã tồn tại',
  
  // Notes Form
  note_title: 'Tiêu đề',
  note_content: 'Nội dung',
  note_title_placeholder: 'Nhập tiêu đề ghi chú',
  note_content_placeholder: 'Nhập nội dung ghi chú',
  reminder_time: 'Thời gian nhắc nhở',
  reminder_days: 'Ngày nhắc nhở',
  note_title_required: 'Tiêu đề là bắt buộc',
  note_title_length: 'Tiêu đề phải ít hơn 100 ký tự',
  note_content_required: 'Nội dung là bắt buộc',
  note_content_length: 'Nội dung phải ít hơn 300 ký tự',
  delete_note: 'Xóa ghi chú',
  delete_note_confirmation: 'Bạn có chắc chắn muốn xóa ghi chú này?',
  delete_note_error: 'Xóa ghi chú thất bại',
  save_note_error: 'Lưu ghi chú thất bại',
  no_reminder_days: 'Không có ngày nhắc nhở',
  everyday: 'Hàng ngày',

  // Time intervals
  time_intervals: {
    '5_min': '5 phút',
    '10_min': '10 phút',
    '15_min': '15 phút',
    '30_min': '30 phút',
    '1_hour': '1 giờ'
  }
};