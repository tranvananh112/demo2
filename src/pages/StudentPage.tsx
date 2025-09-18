import React, { useState, useEffect } from 'react';
import { Class, Student } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Camera } from '../components/Camera';
import { AttendanceTicket } from '../components/AttendanceTicket';
import { loadFaceApiModels, detectFace, compareFaces } from '../utils/faceRecognition';
import { speakVietnamese, initializeVoices } from '../utils/textToSpeech';
import { ArrowLeft, Camera as CameraIcon, User, CheckCircle } from 'lucide-react';

interface StudentPageProps {
  onBack: () => void;
}

export const StudentPage: React.FC<StudentPageProps> = ({ onBack }) => {
  const [classes] = useLocalStorage<Class[]>('classes', []);
  const [currentView, setCurrentView] = useState<'join' | 'menu' | 'create-face' | 'attendance' | 'ticket'>('join');
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [classId, setClassId] = useState('');
  const [studentMSSV, setStudentMSSV] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [faceDescriptor, setFaceDescriptor] = useState<Float32Array | null>(null);
  const [attendanceTicket, setAttendanceTicket] = useState<Student | null>(null);

  useEffect(() => {
    // Khởi tạo Face API và Text-to-Speech
    const initializeServices = async () => {
      try {
        await Promise.all([
          loadFaceApiModels(),
          initializeVoices()
        ]);
      } catch (error) {
        console.error('Error initializing services:', error);
      }
    };

    initializeServices();
  }, []);

  const handleJoinClass = () => {
    if (!classId.trim()) {
      setError('Vui lòng nhập ID lớp');
      return;
    }

    const foundClass = classes.find(cls => cls.idLop === classId.trim());
    if (!foundClass) {
      setError('Không tìm thấy lớp học với ID này');
      return;
    }

    setSelectedClass(foundClass);
    setError('');
    setCurrentView('menu');
  };

  const handleSelectStudent = () => {
    if (!studentMSSV.trim()) {
      setError('Vui lòng nhập MSSV');
      return;
    }

    if (!selectedClass) return;

    const student = selectedClass.danhSachSinhVien.find(s => s.mssv === studentMSSV.trim());
    if (!student) {
      setError('Không tìm thấy sinh viên với MSSV này trong lớp');
      return;
    }

    setCurrentStudent(student);
    setError('');
  };

  const handleCreateFace = async (imageData: string) => {
    if (!currentStudent) return;

    setIsLoading(true);
    setError('');

    try {
      const img = new Image();
      img.onload = async () => {
        const detection = await detectFace(img);
        
        if (!detection) {
          setError('Không phát hiện được khuôn mặt. Vui lòng thử lại.');
          setIsLoading(false);
          return;
        }

        // Lưu ảnh gốc và descriptor
        const updatedStudent = {
          ...currentStudent,
          anhGoc: imageData
        };

        // Cập nhật vào localStorage
        const updatedClasses = classes.map(cls => {
          if (cls.id === selectedClass?.id) {
            return {
              ...cls,
              danhSachSinhVien: cls.danhSachSinhVien.map(s => 
                s.id === currentStudent.id ? updatedStudent : s
              )
            };
          }
          return cls;
        });

        localStorage.setItem('classes', JSON.stringify(updatedClasses));
        localStorage.setItem(`face_descriptor_${currentStudent.id}`, JSON.stringify(Array.from(detection.descriptor)));

        setFaceDescriptor(detection.descriptor);
        setCurrentStudent(updatedStudent);
        setIsLoading(false);
        
        speakVietnamese('Tạo khuôn mặt thành công');
        alert('Tạo khuôn mặt thành công! Bây giờ bạn có thể điểm danh.');
      };

      img.src = imageData;
    } catch (error) {
      setError('Lỗi khi xử lý ảnh: ' + (error as Error).message);
      setIsLoading(false);
    }
  };

  const handleAttendance = async (imageData: string) => {
    if (!currentStudent || !selectedClass) return;

    setIsLoading(true);
    setError('');

    try {
      // Kiểm tra xem sinh viên đã tạo khuôn mặt gốc chưa
      const savedDescriptor = localStorage.getItem(`face_descriptor_${currentStudent.id}`);
      if (!savedDescriptor) {
        setError('Bạn chưa tạo khuôn mặt gốc. Vui lòng tạo khuôn mặt trước khi điểm danh.');
        setIsLoading(false);
        return;
      }

      const img = new Image();
      img.onload = async () => {
        const detection = await detectFace(img);
        
        if (!detection) {
          setError('Không phát hiện được khuôn mặt. Vui lòng thử lại.');
          setIsLoading(false);
          return;
        }

        // So sánh với khuôn mặt gốc
        const originalDescriptor = new Float32Array(JSON.parse(savedDescriptor));
        const distance = compareFaces(originalDescriptor, detection.descriptor);
        
        // Ngưỡng nhận diện (có thể điều chỉnh)
        const threshold = 0.6;
        
        if (distance > threshold) {
          setError('Khuôn mặt không khớp. Vui lòng thử lại.');
          setIsLoading(false);
          return;
        }

        // Kiểm tra xem sinh viên đã điểm danh chưa
        if (currentStudent.trangThai === 'C') {
          setError('Bạn đã điểm danh rồi.');
          setIsLoading(false);
          return;
        }

        // Cập nhật trạng thái điểm danh
        const updatedStudent = {
          ...currentStudent,
          trangThai: 'C' as const,
          anhKhuonMat: imageData,
          thoiGianDiemDanh: new Date()
        };

        // Cập nhật vào localStorage
        const updatedClasses = classes.map(cls => {
          if (cls.id === selectedClass.id) {
            return {
              ...cls,
              danhSachSinhVien: cls.danhSachSinhVien.map(s => 
                s.id === currentStudent.id ? updatedStudent : s
              )
            };
          }
          return cls;
        });

        localStorage.setItem('classes', JSON.stringify(updatedClasses));

        setCurrentStudent(updatedStudent);
        setAttendanceTicket(updatedStudent);
        setIsLoading(false);
        
        // Phát giọng nói thông báo
        speakVietnamese('Bạn đã điểm danh thành công');
        
        setCurrentView('ticket');
      };

      img.src = imageData;
    } catch (error) {
      setError('Lỗi khi điểm danh: ' + (error as Error).message);
      setIsLoading(false);
    }
  };

  if (currentView === 'join') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="card">
            <div className="text-center mb-6">
              <div className="bg-green-100 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <User className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Tham gia lớp học</h1>
              <p className="text-gray-600">Nhập ID lớp để bắt đầu điểm danh</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID lớp học
                </label>
                <input
                  type="text"
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  className="input-field"
                  placeholder="Nhập ID lớp do giáo viên cung cấp"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <button
                onClick={handleJoinClass}
                className="btn-primary w-full"
                disabled={!classId.trim()}
              >
                Tham gia lớp
              </button>

              <button
                onClick={onBack}
                className="btn-secondary w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại trang chủ
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'menu' && selectedClass) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center mb-6">
            <button
              onClick={() => setCurrentView('join')}
              className="btn-secondary mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{selectedClass.tenLop}</h1>
              <p className="text-gray-600">ID: {selectedClass.idLop}</p>
            </div>
          </div>

          <div className="card mb-6">
            <h2 className="text-xl font-semibold mb-4">Chọn sinh viên</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  MSSV của bạn
                </label>
                <input
                  type="text"
                  value={studentMSSV}
                  onChange={(e) => setStudentMSSV(e.target.value)}
                  className="input-field"
                  placeholder="Nhập MSSV của bạn"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <button
                onClick={handleSelectStudent}
                className="btn-primary w-full"
                disabled={!studentMSSV.trim()}
              >
                Xác nhận
              </button>
            </div>
          </div>

          {currentStudent && (
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Thông tin sinh viên</h2>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="space-y-2">
                  <p><span className="font-medium">STT:</span> {currentStudent.stt}</p>
                  <p><span className="font-medium">MSSV:</span> {currentStudent.mssv}</p>
                  <p><span className="font-medium">Họ tên:</span> {currentStudent.ten}</p>
                  <p><span className="font-medium">Lớp:</span> {currentStudent.lop}</p>
                  <p><span className="font-medium">Trạng thái:</span> 
                    <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                      currentStudent.trangThai === 'C' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {currentStudent.trangThai === 'C' ? 'Đã điểm danh' : 'Chưa điểm danh'}
                    </span>
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={() => setCurrentView('create-face')}
                  className="btn-secondary"
                  disabled={!!currentStudent.anhGoc}
                >
                  <CameraIcon className="w-4 h-4 mr-2" />
                  {currentStudent.anhGoc ? 'Đã tạo khuôn mặt' : 'Tạo khuôn mặt'}
                </button>

                <button
                  onClick={() => setCurrentView('attendance')}
                  className="btn-primary"
                  disabled={!currentStudent.anhGoc || currentStudent.trangThai === 'C'}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {currentStudent.trangThai === 'C' ? 'Đã điểm danh' : 'Điểm danh'}
                </button>
              </div>

              {currentStudent.trangThai === 'C' && (
                <button
                  onClick={() => {
                    setAttendanceTicket(currentStudent);
                    setCurrentView('ticket');
                  }}
                  className="btn-secondary w-full mt-4"
                >
                  Xem phiếu điểm danh
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (currentView === 'create-face' && currentStudent) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center mb-6">
            <button
              onClick={() => setCurrentView('menu')}
              className="btn-secondary mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Tạo khuôn mặt gốc</h1>
          </div>

          <div className="card">
            <div className="text-center mb-6">
              <p className="text-gray-600">
                Hãy nhìn thẳng vào camera và chụp ảnh khuôn mặt của bạn. 
                Ảnh này sẽ được sử dụng để so sánh khi điểm danh.
              </p>
            </div>

            <div className="mb-6">
              <Camera
                onCapture={handleCreateFace}
                isActive={true}
                className="w-full h-96"
              />
            </div>

            {isLoading && (
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
                <p className="text-gray-600">Đang xử lý ảnh...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'attendance' && currentStudent) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center mb-6">
            <button
              onClick={() => setCurrentView('menu')}
              className="btn-secondary mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Điểm danh</h1>
          </div>

          <div className="card">
            <div className="text-center mb-6">
              <p className="text-gray-600">
                Hãy nhìn thẳng vào camera để thực hiện điểm danh. 
                Hệ thống sẽ so sánh với khuôn mặt gốc của bạn.
              </p>
            </div>

            <div className="mb-6">
              <Camera
                onCapture={handleAttendance}
                isActive={true}
                className="w-full h-96"
              />
            </div>

            {isLoading && (
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
                <p className="text-gray-600">Đang xử lý điểm danh...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'ticket' && attendanceTicket && selectedClass) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <button
              onClick={() => setCurrentView('menu')}
              className="btn-secondary mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Phiếu điểm danh</h1>
          </div>

          <AttendanceTicket 
            student={attendanceTicket} 
            className={selectedClass.tenLop}
          />

          <div className="text-center mt-6">
            <p className="text-green-600 font-medium mb-4">
              🎉 Điểm danh thành công! 🎉
            </p>
            <button
              onClick={() => setCurrentView('menu')}
              className="btn-primary"
            >
              Quay lại menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};