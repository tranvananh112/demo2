export interface Student {
  id: string;
  stt: number;
  mssv: string;
  ten: string;
  lop: string;
  trangThai: 'C' | 'V' | '';
  anhKhuonMat?: string;
  anhGoc?: string;
  thoiGianDiemDanh?: Date;
}

export interface Class {
  id: string;
  tenLop: string;
  idLop: string;
  soLuongSinhVien: number;
  danhSachSinhVien: Student[];
  thoiGianTao: Date;
  trangThai: 'active' | 'completed';
}

export interface AttendanceRecord {
  studentId: string;
  classId: string;
  anhKhuonMat: string;
  thoiGianDiemDanh: Date;
  trangThai: 'C';
}