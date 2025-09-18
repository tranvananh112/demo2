import React, { useState } from 'react';
import { HomePage } from './pages/HomePage';
import { TeacherPage } from './pages/TeacherPage';
import { StudentPage } from './pages/StudentPage';

type AppView = 'home' | 'teacher' | 'student';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');

  const handleSelectRole = (role: 'teacher' | 'student') => {
    setCurrentView(role);
  };

  const handleBackToHome = () => {
    setCurrentView('home');
  };

  return (
    <div className="App">
      {currentView === 'home' && (
        <HomePage onSelectRole={handleSelectRole} />
      )}
      
      {currentView === 'teacher' && (
        <TeacherPage onBack={handleBackToHome} />
      )}
      
      {currentView === 'student' && (
        <StudentPage onBack={handleBackToHome} />
      )}
    </div>
  );
}

export default App;