import * as XLSX from 'xlsx';
import { Student } from '../types';

export const readExcelFile = (file: File): Promise<Student[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
        
        if (jsonData.length < 2) {
          reject(new Error('File Excel phải có ít nhất 2 dòng (tiêu đề và dữ liệu)'));
          return;
        }
        
        const headers = jsonData[0].map((h: string) => h?.toString().toLowerCase().trim());
        const dataRows = jsonData.slice(1);
        
        // Tìm vị trí các cột
        const sttIndex = headers.findIndex(h => h.includes('stt') || h.includes('số thứ tự'));
        const mssvIndex = headers.findIndex(h => h.includes('mssv') || h.includes('mã số'));
        const tenIndex = headers.findIndex(h => h.includes('tên') || h.includes('họ tên'));
        const lopIndex = headers.findIndex(h => h.includes('lớp') || h.includes('class'));
        
        if (mssvIndex === -1 || tenIndex === -1 || lopIndex === -1) {
          reject(new Error('File Excel phải có các cột: MSSV, Tên, Lớp'));
          return;
        }
        
        const students: Student[] = dataRows
          .filter(row => row[mssvIndex] && row[tenIndex] && row[lopIndex])
          .map((row, index) => ({
            id: `student_${Date.now()}_${index}`,
            stt: sttIndex !== -1 ? Number(row[sttIndex]) || (index + 1) : (index + 1),
            mssv: row[mssvIndex]?.toString().trim() || '',
            ten: row[tenIndex]?.toString().trim() || '',
            lop: row[lopIndex]?.toString().trim() || '',
            trangThai: '' as '',
          }));
        
        // Sắp xếp theo STT
        students.sort((a, b) => a.stt - b.stt);
        
        resolve(students);
      } catch (error) {
        reject(new Error('Lỗi khi đọc file Excel: ' + (error as Error).message));
      }
    };
    
    reader.onerror = () => reject(new Error('Lỗi khi đọc file'));
    reader.readAsBinaryString(file);
  });
};

export const exportToExcel = (students: Student[], className: string) => {
  const data = students.map(student => ({
    'STT': student.stt,
    'MSSV': student.mssv,
    'Tên': student.ten,
    'Lớp': student.lop,
    'Trạng thái': student.trangThai || 'V'
  }));
  
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Điểm danh');
  
  // Tự động điều chỉnh độ rộng cột
  const colWidths = [
    { wch: 5 },  // STT
    { wch: 12 }, // MSSV
    { wch: 25 }, // Tên
    { wch: 15 }, // Lớp
    { wch: 12 }  // Trạng thái
  ];
  worksheet['!cols'] = colWidths;
  
  const fileName = `DiemDanh_${className}_${new Date().toLocaleDateString('vi-VN').replace(/\//g, '-')}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};