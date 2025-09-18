import React from 'react';
import { Student } from '../types';
import { CheckCircle, User } from 'lucide-react';

interface AttendanceTicketProps {
  student: Student;
  className: string;
}

export const AttendanceTicket: React.FC<AttendanceTicketProps> = ({ student, className }) => {
  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
        <div className="flex items-center justify-center space-x-2 text-white">
          <CheckCircle className="w-6 h-6" />
          <h2 className="text-lg font-bold">PHIẾU ĐIỂM DANH</h2>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Ảnh khuôn mặt */}
        <div className="flex justify-center mb-6">
          {student.anhKhuonMat ? (
            <img
              src={student.anhKhuonMat}
              alt={`Khuôn mặt ${student.ten}`}
              className="w-32 h-32 rounded-full object-cover border-4 border-green-200 shadow-md"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-300">
              <User className="w-16 h-16 text-gray-400" />
            </div>
          )}
        </div>

        {/* Thông tin sinh viên */}
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="font-medium text-gray-600">STT:</span>
            <span className="font-semibold text-gray-900">{student.stt}</span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="font-medium text-gray-600">MSSV:</span>
            <span className="font-semibold text-gray-900">{student.mssv}</span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="font-medium text-gray-600">Họ tên:</span>
            <span className="font-semibold text-gray-900">{student.ten}</span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="font-medium text-gray-600">Lớp:</span>
            <span className="font-semibold text-gray-900">{student.lop}</span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="font-medium text-gray-600">Lớp học:</span>
            <span className="font-semibold text-gray-900">{className}</span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="font-medium text-gray-600">Trạng thái:</span>
            <span className="font-semibold text-green-600 flex items-center space-x-1">
              <CheckCircle className="w-4 h-4" />
              <span>Đã điểm danh</span>
            </span>
          </div>
          
          {student.thoiGianDiemDanh && (
            <div className="flex justify-between items-center py-2">
              <span className="font-medium text-gray-600">Thời gian:</span>
              <span className="font-semibold text-gray-900">
                {new Date(student.thoiGianDiemDanh).toLocaleString('vi-VN')}
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-center text-sm text-gray-500">
            Hệ thống điểm danh tự động
          </p>
          <p className="text-center text-xs text-gray-400 mt-1">
            Được tạo lúc {new Date().toLocaleString('vi-VN')}
          </p>
        </div>
      </div>
    </div>
  );
};