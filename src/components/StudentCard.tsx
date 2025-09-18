import React from 'react';
import { Student } from '../types';
import { User, Check, X } from 'lucide-react';

interface StudentCardProps {
  student: Student;
  showImage?: boolean;
}

export const StudentCard: React.FC<StudentCardProps> = ({ student, showImage = true }) => {
  const getStatusIcon = () => {
    switch (student.trangThai) {
      case 'C':
        return <Check className="w-5 h-5 text-green-600" />;
      case 'V':
        return <X className="w-5 h-5 text-red-600" />;
      default:
        return <div className="w-5 h-5 rounded-full bg-gray-300"></div>;
    }
  };

  const getStatusText = () => {
    switch (student.trangThai) {
      case 'C':
        return 'Có mặt';
      case 'V':
        return 'Vắng';
      default:
        return 'Chưa điểm danh';
    }
  };

  const getStatusColor = () => {
    switch (student.trangThai) {
      case 'C':
        return 'bg-green-50 border-green-200';
      case 'V':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className={`card ${getStatusColor()} transition-colors duration-200`}>
      <div className="flex items-center space-x-4">
        {/* Ảnh khuôn mặt */}
        <div className="flex-shrink-0">
          {showImage && student.anhKhuonMat ? (
            <img
              src={student.anhKhuonMat}
              alt={`Khuôn mặt ${student.ten}`}
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>

        {/* Thông tin sinh viên */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {student.ten}
            </h3>
            <div className="flex items-center space-x-2">
              {getStatusIcon()}
              <span className={`text-sm font-medium ${
                student.trangThai === 'C' ? 'text-green-600' :
                student.trangThai === 'V' ? 'text-red-600' : 'text-gray-500'
              }`}>
                {getStatusText()}
              </span>
            </div>
          </div>
          
          <div className="mt-1 space-y-1">
            <p className="text-sm text-gray-600">
              <span className="font-medium">STT:</span> {student.stt}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">MSSV:</span> {student.mssv}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Lớp:</span> {student.lop}
            </p>
            {student.thoiGianDiemDanh && (
              <p className="text-xs text-gray-500">
                Điểm danh lúc: {new Date(student.thoiGianDiemDanh).toLocaleString('vi-VN')}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};