import { differenceInDays, parseISO, isValid } from 'date-fns';

/**
 * Hàm trì hoãn thực thi chức năng liên tục (dùng cho thanh Search liên tục gọi API)
 * @param {Function} func Hàm cần thực thi
 * @param {number} wait Thời gian delay (ms)
 * @returns {Function} 
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Tính toán số ngày còn lại của Gói tập Gym tính từ hôm nay
 * @param {string|Date} endDateStr Ngày kết thúc gói tập
 * @returns {number} Số ngày còn lại (hoặc 0 nếu đã hết hạn)
 */
export const calculateRemainingDays = (endDateStr) => {
  if (!endDateStr) return 0;
  try {
    const end = typeof endDateStr === "string" ? parseISO(endDateStr) : endDateStr;
    if (!isValid(end)) return 0;
    
    const now = new Date();
    const days = differenceInDays(end, now);
    
    return days > 0 ? days : 0;
  } catch {
    return 0;
  }
};

/**
 * Kiểm tra xem người dùng có quyền truy cập dựa trên danh sách roles không
 * @param {string} userRole Role của user hiện tại
 * @param {Array<string>} allowedRoles Danh sách các Role được cho phép
 * @returns {boolean}
 */
export const hasRoleAccess = (userRole, allowedRoles = []) => {
  if (!userRole || !Array.isArray(allowedRoles)) return false;
  return allowedRoles.includes(userRole);
};

/**
 * Dịch tên khu vực/phòng tập thực tế từ DB dựa trên file ngôn ngữ
 * @param {string} name Tên gốc từ DB
 * @param {Function} t Hàm dịch thuật i18n
 * @returns {string} Tên đã dịch hoặc tên gốc
 */
export const localizeRoomName = (name, t) => {
  if (!name) return 'N/A';
  const map = {
    'phong gym vip': 'room.db.gym_vip_name',
    'phong yoga': 'room.db.yoga_name',
    'phong aerobic': 'room.db.aerobic_name',
    'phong pilates': 'room.db.pilates_name',
    'phong duong sinh': 'room.db.duong_sinh_name',
    'phong xong hoi kho': 'room.db.sauna_name',
    'phong xong hoi uot': 'room.db.steam_name',
    'phong boxing': 'room.db.boxing_name',
    'phong gym co ban': 'room.db.gym_basic_name',
    'phong gym nu': 'room.db.gym_female_name',
  };
  const normalized = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  const key = map[normalized];
  return key && t(key) !== key ? t(key) : name;
};

/**
 * Dịch mô tả khu vực/phòng tập thực tế từ DB dựa trên file ngôn ngữ
 * @param {string} desc Mô tả gốc từ DB
 * @param {string} name Tên gốc từ DB (để ánh xạ mô tả)
 * @param {Function} t Hàm dịch thuật i18n
 * @returns {string} Mô tả đã dịch hoặc mô tả gốc
 */
export const localizeRoomDesc = (desc, name, t) => {
  if (!desc) return '';
  const map = {
    'phong gym vip': 'room.db.gym_vip_desc',
    'phong yoga': 'room.db.yoga_desc',
    'phong aerobic': 'room.db.aerobic_desc',
    'phong pilates': 'room.db.pilates_desc',
    'phong duong sinh': 'room.db.duong_sinh_desc',
    'phong xong hoi kho': 'room.db.sauna_desc',
    'phong xong hoi uot': 'room.db.steam_desc',
    'phong boxing': 'room.db.boxing_desc',
    'phong gym co ban': 'room.db.gym_basic_desc',
    'phong gym nu': 'room.db.gym_female_desc',
  };
  const normalizedName = name ? name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim() : '';
  const key = map[normalizedName];
  return key && t(key) !== key ? t(key) : desc;
};

/**
 * Dịch các tiện ích (amenities) thực tế từ DB dựa trên file ngôn ngữ
 * @param {string} amenity Tiện ích gốc từ DB
 * @param {Function} t Hàm dịch thuật i18n
 * @returns {string} Tiện ích đã dịch hoặc tiện ích gốc
 */
export const localizeAmenity = (amenity, t) => {
  if (!amenity) return '';
  const normalized = amenity.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '_').trim();
  const key = `room.db.amenity.${normalized}`;
  const translated = t(key);
  return translated !== key ? translated : amenity;
};
