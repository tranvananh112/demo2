import React from 'react';
import { Users, UserPlus, GraduationCap } from 'lucide-react';

interface HomePageProps {
  onSelectRole: (role: 'teacher' | 'student') => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onSelectRole }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-primary-600 p-4 rounded-full">
              <GraduationCap className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Hệ thống điểm danh bằng nhận diện khuôn mặt
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Giải pháp điểm danh hiện đại, chính xác và tiện lợi cho giáo viên và sinh viên
          </p>
        </div>

        {/* Role Selection */}
        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {/* Teacher Card */}
          <div 
            onClick={() => onSelectRole('teacher')}
            className="card hover:shadow-lg cursor-pointer transition-all duration-200 hover:scale-105 border-2 border-transparent hover:border-primary-200"
          >
            <div className="text-center">
              <div className="bg-primary-100 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Users className="w-10 h-10 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Giáo viên</h3>
              <p className="text-gray-600 mb-6">
                Tạo lớp học, quản lý danh sách sinh viên và theo dõi điểm danh
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
                  <span>Tạo và quản lý lớp học</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
                  <span>Nhập danh sách từ Excel</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
                  <span>Theo dõi điểm danh thời gian thực</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
                  <span>Xuất báo cáo Excel</span>
                </div>
              </div>
            </div>
          </div>

          {/* Student Card */}
          <div 
            onClick={() => onSelectRole('student')}
            className="card hover:shadow-lg cursor-pointer transition-all duration-200 hover:scale-105 border-2 border-transparent hover:border-green-200"
          >
            <div className="text-center">
              <div className="bg-green-100 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <UserPlus className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Sinh viên</h3>
              <p className="text-gray-600 mb-6">
                Tham gia lớp học và thực hiện điểm danh bằng khuôn mặt
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Tham gia lớp bằng ID</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Tạo khuôn mặt gốc</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Điểm danh tự động</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Xem phiếu điểm danh</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Tính năng nổi bật</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-semibold text-gray-900 mb-2">Chính xác cao</h3>
              <p className="text-sm text-gray-600">Công nghệ AI nhận diện khuôn mặt tiên tiến</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-semibold text-gray-900 mb-2">Nhanh chóng</h3>
              <p className="text-sm text-gray-600">Điểm danh chỉ trong vài giây</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-semibold text-gray-900 mb-2">Báo cáo chi tiết</h3>
              <p className="text-sm text-gray-600">Xuất báo cáo Excel tự động</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};