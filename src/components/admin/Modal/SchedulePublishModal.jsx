import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { successNotif, errorNotif } from '../../../utils/customNotifs';
import useAdminHttp from '../../../hooks/useAdminHttp';
import { formatJalaliDateTime } from '../../../utils/dateUtils';
import jalaali from 'jalaali-js';

// تابع برای تبدیل اعداد به فارسی
const toPersianNumber = (num) => {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return `${num}`.replace(/\d/g, d => persianDigits[d]);
};

// تبدیل تاریخ شمسی به میلادی
const jalaliToGregorian = (year, month, day) => {
  const { gy, gm, gd } = jalaali.toGregorian(year, month, day);
  return new Date(gy, gm - 1, gd);
};

// تبدیل تاریخ میلادی به شمسی
const gregorianToJalali = (date) => {
  const { jy, jm, jd } = jalaali.toJalaali(date.getFullYear(), date.getMonth() + 1, date.getDate());
  return { year: jy, month: jm, day: jd };
};

// کامپوننت تقویم شمسی ساده
const PersianCalendar = ({ selectedDate, onChange, minDate }) => {
  const today = new Date();
  const currentJalali = gregorianToJalali(today);
  
  const [viewYear, setViewYear] = useState(currentJalali.year);
  const [viewMonth, setViewMonth] = useState(currentJalali.month);
  
  // تعداد روزهای هر ماه شمسی
  const getMonthDays = (year, month) => {
    return jalaali.jalaaliMonthLength(year, month);
  };
  
  // نام ماه‌های شمسی
  const jalaliMonths = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
  ];
  
  // نام روزهای هفته
  const weekDays = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];
  
  // تغییر ماه
  const changeMonth = (delta) => {
    let newMonth = viewMonth + delta;
    let newYear = viewYear;
    
    if (newMonth > 12) {
      newMonth = 1;
      newYear++;
    } else if (newMonth < 1) {
      newMonth = 12;
      newYear--;
    }
    
    setViewMonth(newMonth);
    setViewYear(newYear);
  };
  
  // محاسبه روز اول ماه
  const getFirstDayOfMonth = (year, month) => {
    const gregorianDate = jalaliToGregorian(year, month, 1);
    let dayOfWeek = gregorianDate.getDay(); // 0 = یکشنبه
    return (dayOfWeek + 1) % 7; // تبدیل به شنبه = 0
  };
  
  // ساخت روزهای ماه
  const renderDays = () => {
    const days = [];
    const daysInMonth = getMonthDays(viewYear, viewMonth);
    const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
    
    // روزهای خالی ابتدای ماه
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
    }
    
    // روزهای ماه
    for (let day = 1; day <= daysInMonth; day++) {
      const date = { year: viewYear, month: viewMonth, day };
      const isSelected = selectedDate && 
                        selectedDate.year === date.year && 
                        selectedDate.month === date.month && 
                        selectedDate.day === date.day;
      
      // بررسی تاریخ حداقل
      let isDisabled = false;
      if (minDate) {
        const minJalali = gregorianToJalali(minDate);
        isDisabled = (date.year < minJalali.year) || 
                    (date.year === minJalali.year && date.month < minJalali.month) ||
                    (date.year === minJalali.year && date.month === minJalali.month && date.day < minJalali.day);
      }
      
      days.push(
        <div 
          key={day} 
          className={`w-8 h-8 flex items-center justify-center rounded-full cursor-pointer text-sm
            ${isSelected ? 'bg-quaternary text-white' : ''}
            ${isDisabled ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-200'}
          `}
          onClick={() => !isDisabled && onChange(date)}
        >
          {toPersianNumber(day)}
        </div>
      );
    }
    
    return days;
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-4">
      {/* هدر تقویم */}
      <div className="flex justify-between items-center mb-4">
        <button 
          type="button"
          onClick={() => changeMonth(-1)} 
          className="p-1 rounded-full hover:bg-gray-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        <div className="text-center font-medium">
          <span>{jalaliMonths[viewMonth - 1]} </span>
          <span>{toPersianNumber(viewYear)}</span>
        </div>
        <button 
          type="button"
          onClick={() => changeMonth(1)} 
          className="p-1 rounded-full hover:bg-gray-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      {/* روزهای هفته */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day, index) => (
          <div key={index} className="w-8 h-8 flex items-center justify-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>
      
      {/* روزهای ماه */}
      <div className="grid grid-cols-7 gap-1">
        {renderDays()}
      </div>
    </div>
  );
};

const SchedulePublishModal = ({ isOpen, onClose, articleId, onSuccess }) => {
  // تاریخ شمسی انتخاب شده
  const [selectedJalaliDate, setSelectedJalaliDate] = useState(null);
  // ساعت و دقیقه به صورت جداگانه
  const [selectedHour, setSelectedHour] = useState('12');
  const [selectedMinute, setSelectedMinute] = useState('00');
  // نمایش پیکر زمان
  const [showTimePicker, setShowTimePicker] = useState(false);
  
  const { isLoading, sendRequest } = useAdminHttp();
  
  // ساخت آرایه‌های ساعت و دقیقه برای انتخاب
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  useEffect(() => {
    // Reset the form when modal opens
    if (isOpen) {
      // تنظیم تاریخ شمسی امروز
      const today = new Date();
      setSelectedJalaliDate(gregorianToJalali(today));
      setSelectedHour('12');
      setSelectedMinute('00');
      setShowTimePicker(false);
    }
  }, [isOpen]);

  // تبدیل تاریخ شمسی انتخاب شده به تاریخ میلادی برای ارسال به سرور
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (!selectedJalaliDate) {
        errorNotif('لطفاً تاریخ را انتخاب کنید.');
        return;
      }
      
      // تبدیل تاریخ شمسی به میلادی
      const gregorianDate = jalaliToGregorian(
        selectedJalaliDate.year, 
        selectedJalaliDate.month, 
        selectedJalaliDate.day
      );
      
      // تنظیم ساعت و دقیقه
      gregorianDate.setHours(parseInt(selectedHour, 10), parseInt(selectedMinute, 10), 0, 0);
      
      // Ensure the date is in the future
      if (gregorianDate <= new Date()) {
        errorNotif('زمان انتخاب شده باید در آینده باشد.');
        return;
      }
      
      // برای مقاله‌های جدید، فقط تاریخ را به کامپوننت والد برمی‌گردانیم
      onSuccess && onSuccess(gregorianDate);
      successNotif('زمان‌بندی انتشار مقاله با موفقیت تنظیم شد.');
      onClose();
      
    } catch (error) {
      errorNotif('خطا در ارتباط با سرور'); // This error won't be from API anymore, but from local date processing
      console.error('Error scheduling article:', error);
    }
  };

  // ساخت تاریخ کامل برای نمایش (تاریخ + زمان)
  const getFullDateTime = () => {
    if (!selectedJalaliDate) return '';
    
    const gregorianDate = jalaliToGregorian(
      selectedJalaliDate.year, 
      selectedJalaliDate.month, 
      selectedJalaliDate.day
    );
    
    gregorianDate.setHours(parseInt(selectedHour, 10), parseInt(selectedMinute, 10), 0, 0);
    return formatJalaliDateTime(gregorianDate);
  };

  // نمایش تاریخ شمسی انتخاب شده
  const getSelectedJalaliDateString = () => {
    if (!selectedJalaliDate) return '';
    return `${toPersianNumber(selectedJalaliDate.year)}/${toPersianNumber(selectedJalaliDate.month)}/${toPersianNumber(selectedJalaliDate.day)}`;
  };

  // نمایش زمان انتخاب شده
  const getSelectedTimeString = () => {
    return `${toPersianNumber(selectedHour)}:${toPersianNumber(selectedMinute)}`;
  };

  // انتخاب ساعت
  const selectHour = (hour) => {
    setSelectedHour(hour);
  };

  // انتخاب دقیقه
  const selectMinute = (minute) => {
    setSelectedMinute(minute);
    setShowTimePicker(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-quinary-tint-800 rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.3)] p-6 w-full max-w-md"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            <h2 className="text-xl font-bold mb-6 text-center text-primary border-b border-quinary-tint-700 pb-3">زمان‌بندی انتشار مقاله</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-secondary">تاریخ انتشار:</label>
                <div className="flex justify-center mb-2">
                  <div className="p-2 border-2 border-quinary-tint-500 rounded-lg text-center w-full text-primary">
                    {getSelectedJalaliDateString() || 'انتخاب تاریخ'}
                  </div>
                </div>
                
                {/* تقویم شمسی */}
                <div className="flex justify-center">
                  <PersianCalendar 
                    selectedDate={selectedJalaliDate}
                    onChange={setSelectedJalaliDate}
                    minDate={new Date()}
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="block text-sm font-medium text-secondary">ساعت انتشار:</label>
                <div className="relative">
                  <div 
                    onClick={() => setShowTimePicker(!showTimePicker)}
                    className="p-3 border-2 border-quinary-tint-500 rounded-lg text-center cursor-pointer flex items-center justify-center gap-2 hover:border-quaternary transition-colors duration-300 text-primary"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-quaternary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-lg">{getSelectedTimeString()}</span>
                  </div>
                  
                  {showTimePicker && (
                    <div className="absolute bottom-full left-0 right-0 mb-2 p-4 bg-quinary-tint-700 rounded-lg shadow-lg z-10 border-2 border-quinary-tint-600">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-secondary mb-2 text-center">ساعت</h3>
                          <div className="h-48 overflow-y-auto custom-scrollbar pr-2">
                            {hours.map(hour => (
                              <div
                                key={hour}
                                onClick={() => selectHour(hour)}
                                className={`p-2 rounded-md cursor-pointer text-center mb-1 transition-colors duration-200 ${
                                  selectedHour === hour
                                    ? 'bg-quaternary text-white'
                                    : 'hover:bg-quinary-tint-600 text-primary'
                                }`}
                              >
                                {toPersianNumber(hour)}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-secondary mb-2 text-center">دقیقه</h3>
                          <div className="h-48 overflow-y-auto custom-scrollbar pr-2">
                            {minutes.map(minute => (
                              <div
                                key={minute}
                                onClick={() => selectMinute(minute)}
                                className={`p-2 rounded-md cursor-pointer text-center mb-1 transition-colors duration-200 ${
                                  selectedMinute === minute
                                    ? 'bg-quaternary text-white'
                                    : 'hover:bg-quinary-tint-600 text-primary'
                                }`}
                              >
                                {toPersianNumber(minute)}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-quaternary/10 border border-primary/20 rounded-lg shadow-inner">
                <p className="text-primary font-medium text-center flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  زمان انتشار: {getFullDateTime()}
                </p>
              </div>
              
              <div className="flex justify-between pt-4 border-t border-quinary-tint-700">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 bg-quinary-tint-700 text-secondary rounded-lg hover:bg-quinary-tint-600 transition-colors"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !selectedJalaliDate}
                  className={`px-5 py-2.5 bg-quaternary text-white rounded-lg hover:bg-quaternary/90 transition-colors ${
                    (isLoading || !selectedJalaliDate) ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? 'در حال ثبت...' : 'ثبت زمان‌بندی'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SchedulePublishModal;