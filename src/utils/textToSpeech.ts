export const speakVietnamese = (text: string): void => {
  if ('speechSynthesis' in window) {
    // Dừng tất cả giọng nói đang phát
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Cấu hình giọng nói
    utterance.lang = 'vi-VN';
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.volume = 0.8;
    
    // Tìm giọng nói tiếng Việt nữ
    const voices = window.speechSynthesis.getVoices();
    const vietnameseVoice = voices.find(voice => 
      voice.lang.includes('vi') && voice.name.toLowerCase().includes('female')
    ) || voices.find(voice => voice.lang.includes('vi'));
    
    if (vietnameseVoice) {
      utterance.voice = vietnameseVoice;
    }
    
    // Phát giọng nói
    window.speechSynthesis.speak(utterance);
  } else {
    console.warn('Trình duyệt không hỗ trợ Text-to-Speech');
  }
};

// Khởi tạo danh sách giọng nói
export const initializeVoices = (): Promise<void> => {
  return new Promise((resolve) => {
    if (window.speechSynthesis.getVoices().length > 0) {
      resolve();
      return;
    }
    
    window.speechSynthesis.onvoiceschanged = () => {
      resolve();
    };
  });
};