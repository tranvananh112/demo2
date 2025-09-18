import React, { useState } from 'react';
import { Class, Student } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { readExcelFile, exportToExcel } from '../utils/excelUtils';
import { Upload, Download, Users, Plus, ArrowLeft, Eye } from 'lucide-react';
import { StudentCard } from '../components/StudentCard';

interface TeacherPageProps {
  onBack: () => void;
}

export const TeacherPage: React.FC<TeacherPageProps> = ({ onBack }) => {
  const [classes, setClasses] = useLocalStorage<Class[]>('classes', []);
  const [currentView, setCurrentView] = useState<'list' | 'create' | 'manage'>('list');
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    tenLop: '',
    idLop: '',
    soLuongSinhVien: 0,
    danhSachSinhVien: [] as Student[]
  });
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleCreateClass = () => {
    if (!formData.tenLop || !formData.idLop || formData.danhSachSinhVien.length === 0) {
      alert('Vui lòng điền đầy đủ thông tin và thêm danh sách sinh viên');
      return;
    }

    // Kiểm tra ID lớp đã tồn tại
    if (classes.some(cls => cls.idLop === formData.idLop)) {
      alert('ID lớp đã tồn tại. Vui lòng chọn ID khác.');
      return;
    }

    const newClass: Class = {
      id: `class_${Date.now()}`,
      tenLop: formData.tenLop,
      idLop: formData.idLop,
      soLuongSinhVien: formData.danhSachSinhVien.length,
      danhSachSinhVien: formData.danhSachSinhVien,
      thoiGianTao: new Date(),
      trangThai: 'active'
    };

    setClasses([...classes, newClass]);
    
    // Reset form
    setFormData({
      tenLop: '',
      idLop: '',
      soLuongSinhVien: 0,
      danhSachSinhVien: []
    });
    
    setCurrentView('list');
    alert('Tạo lớp thành công!');
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError('');

    try {
      const students = await readExcelFile(file);
      setFormData(prev => ({
        ...prev,
        danhSachSinhVien: students,
        soLuongSinhVien: students.length
      }));
    } catch (error) {
      setUploadError((error as Error).message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleManualAdd = () => {
    const mssv = prompt('Nhập MSSV:');
    const ten = prompt('Nhập họ tên:');
    const lop = prompt('Nhập lớp:');
    
    if (mssv && ten && lop) {
      const newStudent: Student = {
        id: `student_${Date.now()}`,
        stt: formData.danhSachSinhVien.length + 1,
        mssv: mssv.trim(),
        ten: ten.trim(),
        lop: lop.trim(),
        trangThai: ''
      };
      
      setFormData(prev => ({
        ...prev,
        danhSachSinhVien: [...prev.danhSachSinhVien, newStudent],
        soLuongSinhVien: prev.danhSachSinhVien.length + 1
      }));
    }
  };

  const handleExportExcel = (classData: Class) => {
    exportToExcel(classData.danhSachSinhVien, classData.tenLop);
  };

  const handleViewClass = (classData: Class) => {
    setSelectedClass(classData);
    setCurrentView('manage');
  };

  // Cập nhật danh sách sinh viên khi có điểm danh mới
  React.useEffect(() => {
    const handleStorageChange = () => {
      const updatedClasses = JSON.parse(localStorage.getItem('classes') || '[]');
      setClasses(updatedClasses);
      
      if (selectedClass) {
        const updatedClass = updatedClasses.find((cls: Class) => cls.id === selectedClass.id);
        if (updatedClass) {
          setSelectedClass(updatedClass);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Polling để cập nhật thời gian thực
    const interval = setInterval(() => {
      const updatedClasses = JSON.parse(localStorage.getItem('classes') || '[]');
      setClasses(updatedClasses);
      
      if (selectedClass) {
        const updatedClass = updatedClasses.find((cls: Class) => cls.id === selectedClass.id);
        if (updatedClass) {
          setSelectedClass(updatedClass);
        }
      }
    }, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [selectedClass, setClasses]);

  if (currentView === 'create') {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <button
              onClick={() => setCurrentView('list')}
              className="btn-secondary mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Tạo lớp học mới</h1>
          </div>

          <div className="card">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Thông tin lớp */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Thông tin lớp học</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên lớp học
                    </label>
                    <input
                      type="text"
                      value={formData.tenLop}
                      onChange={(e) => setFormData(prev => ({ ...prev, tenLop: e.target.value }))}
                      className="input-field"
                      placeholder="Ví dụ: Lập trình Web - K65"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ID lớp (mã định danh)
                    </label>
                    <input
                      type="text"
                      value={formData.idLop}
                      onChange={(e) => setFormData(prev => ({ ...prev, idLop: e.target.value }))}
                      className="input-field"
                      placeholder="Ví dụ: WEB2024_K65"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Sinh viên sẽ sử dụng ID này để tham gia lớp
                    </p>
                  </div>
                </div>
              </div>

              {/* Danh sách sinh viên */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Danh sách sinh viên</h2>
                <div className="space-y-4">
                  {/* Upload Excel */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tải lên file Excel
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="excel-upload"
                        disabled={isUploading}
                      />
                      <label
                        htmlFor="excel-upload"
                        className={`btn-primary cursor-pointer ${isUploading ? 'opacity-50' : ''}`}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {isUploading ? 'Đang tải...' : 'Chọn file Excel'}
                      </label>
                    </div>
                    {uploadError && (
                      <p className="text-red-600 text-sm mt-2">{uploadError}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      File Excel cần có các cột: STT (tùy chọn), MSSV, Tên, Lớp
                    </p>
                  </div>

                  {/* Thêm thủ công */}
                  <div>
                    <button
                      onClick={handleManualAdd}
                      className="btn-secondary w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Thêm sinh viên thủ công
                    </button>
                  </div>

                  {/* Hiển thị số lượng */}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">
                      Số lượng sinh viên: <span className="font-semibold">{formData.danhSachSinhVien.length}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Danh sách sinh viên đã thêm */}
            {formData.danhSachSinhVien.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Danh sách sinh viên đã thêm</h3>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {formData.danhSachSinhVien.map((student) => (
                    <div key={student.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div>
                        <span className="font-medium">{student.stt}. {student.ten}</span>
                        <span className="text-gray-500 ml-2">({student.mssv} - {student.lop})</span>
                      </div>
                      <button
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            danhSachSinhVien: prev.danhSachSinhVien.filter(s => s.id !== student.id),
                            soLuongSinhVien: prev.danhSachSinhVien.length - 1
                          }));
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        Xóa
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nút tạo lớp */}
            <div className="mt-8 flex justify-end">
              <button
                onClick={handleCreateClass}
                className="btn-primary"
                disabled={!formData.tenLop || !formData.idLop || formData.danhSachSinhVien.length === 0}
              >
                Tạo lớp học
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'manage' && selectedClass) {
    const attendedCount = selectedClass.danhSachSinhVien.filter(s => s.trangThai === 'C').length;
    const absentCount = selectedClass.danhSachSinhVien.filter(s => s.trangThai === 'V').length;
    const notYetCount = selectedClass.danhSachSinhVien.filter(s => !s.trangThai).length;

    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <button
                onClick={() => setCurrentView('list')}
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
            
            <button
              onClick={() => handleExportExcel(selectedClass)}
              className="btn-primary"
            >
              <Download className="w-4 h-4 mr-2" />
              Xuất Excel
            </button>
          </div>

          {/* Thống kê */}
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-gray-900">{selectedClass.soLuongSinhVien}</div>
              <div className="text-sm text-gray-600">Tổng sinh viên</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-green-600">{attendedCount}</div>
              <div className="text-sm text-gray-600">Có mặt</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-red-600">{absentCount}</div>
              <div className="text-sm text-gray-600">Vắng</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-gray-600">{notYetCount}</div>
              <div className="text-sm text-gray-600">Chưa điểm danh</div>
            </div>
          </div>

          {/* Danh sách sinh viên */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Danh sách điểm danh</h2>
            <div className="space-y-4">
              {selectedClass.danhSachSinhVien
                .sort((a, b) => a.stt - b.stt)
                .map((student) => (
                  <StudentCard key={student.id} student={student} showImage={true} />
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="btn-secondary mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Trang chủ
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý lớp học</h1>
          </div>
          
          <button
            onClick={() => setCurrentView('create')}
            className="btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tạo lớp mới
          </button>
        </div>

        {classes.length === 0 ? (
          <div className="card text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Chưa có lớp học nào</h2>
            <p className="text-gray-600 mb-6">Tạo lớp học đầu tiên để bắt đầu điểm danh</p>
            <button
              onClick={() => setCurrentView('create')}
              className="btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Tạo lớp mới
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((classData) => {
              const attendedCount = classData.danhSachSinhVien.filter(s => s.trangThai === 'C').length;
              
              return (
                <div key={classData.id} className="card hover:shadow-lg transition-shadow duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {classData.tenLop}
                      </h3>
                      <p className="text-sm text-gray-600">ID: {classData.idLop}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      classData.trangThai === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {classData.trangThai === 'active' ? 'Đang hoạt động' : 'Đã kết thúc'}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tổng sinh viên:</span>
                      <span className="font-medium">{classData.soLuongSinhVien}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Đã điểm danh:</span>
                      <span className="font-medium text-green-600">{attendedCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tạo lúc:</span>
                      <span className="font-medium">
                        {new Date(classData.thoiGianTao).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewClass(classData)}
                      className="btn-primary flex-1"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Xem chi tiết
                    </button>
                    <button
                      onClick={() => handleExportExcel(classData)}
                      className="btn-secondary"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};