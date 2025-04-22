import React, { useState, useEffect } from 'react';
import './App.css';

type CallStatus = 'incoming' | 'analyzing' | 'scam-detected';
type LogEntry = {
  timestamp: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
};

interface CallerInfo {
  name: string;
  number: string;
  avatar: string;
}

const generateRandomHex = (size: number): string => {
  return [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
};

const generateRandomIP = (): string => {
  return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
};

const App: React.FC = () => {
  const [callStatus, setCallStatus] = useState<CallStatus>('incoming');
  const [progress, setProgress] = useState<number>(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [callerInfo] = useState<CallerInfo>({
    name: 'Unknown',
    number: '+1 (555) 123-4567',
    avatar: 'https://randomuser.me/api/portraits/lego/1.jpg'
  });

  const addLog = (message: string, type: LogEntry['type'] = 'info') => {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    setLogs(prev => [...prev, { timestamp, message, type }]);
  };

  // Simulate call flow
  useEffect(() => {
    if (callStatus === 'incoming') {
      addLog('Incoming call detected from ' + callerInfo.number);
      addLog('Initializing voice pattern analysis module...');
      addLog('Loading AI detection models...', 'info');
      
      const timer = setTimeout(() => {
        setCallStatus('analyzing');
      }, 3000);
      return () => clearTimeout(timer);
    }

    if (callStatus === 'analyzing') {
      addLog('Beginning real-time voice analysis...', 'info');
      addLog('Extracting vocal features...');
      
      const features = ['pitch', 'timbre', 'formants', 'spectral', 'prosody'];
      features.forEach(feat => {
        addLog(`Analyzing ${feat} patterns...`);
      });

      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setCallStatus('scam-detected');
            addLog('WARNING: Synthetic voice patterns detected!', 'error');
            addLog('Confidence level: 92.7%', 'error');
            addLog('Signature match to known deepfake samples', 'error');
            return 100;
          }
          
          // Add random logs during analysis
          if (Math.random() > 0.7) {
            const randomLogs = [
              `Processing frame ${Math.floor(prev * 30)}...`,
              `Voiceprint hash: ${generateRandomHex(8)}`,
              `Comparing to ${Math.floor(Math.random() * 5000)} known samples`,
              `Network connection established with ${generateRandomIP()}`,
              `Calculating spectral deviation (current: ${(Math.random() * 10).toFixed(2)}%)`
            ];
            addLog(randomLogs[Math.floor(Math.random() * randomLogs.length)]);
          }
          
          return prev + 5;
        });
      }, 200);
      return () => clearInterval(interval);
    }
  }, [callStatus]);

  const handleAnswer = (): void => {
    addLog('User answered call', 'success');
    setCallStatus('analyzing');
  };

  const handleDecline = (): void => {
    addLog('Call declined by user', 'warning');
    setCallStatus('incoming');
    setProgress(0);
  };

  return (
    <div className="app-container">
      <div className="terminal-panel">
        <div className="terminal-header">
          <div className="terminal-buttons">
            <div className="terminal-btn close"></div>
            <div className="terminal-btn minimize"></div>
            <div className="terminal-btn maximize"></div>
          </div>
          <div className="terminal-title">deepfake-detection-engine</div>
        </div>
        <div className="terminal-body">
          {logs.map((log, index) => (
            <div key={index} className={`log-entry ${log.type}`}>
              <span className="timestamp">[{log.timestamp}]</span>
              <span className="log-message">{log.message}</span>
            </div>
          ))}
          {callStatus === 'analyzing' && (
            <div className="log-entry info">
              <span className="timestamp">[{new Date().toISOString().split('T')[1].split('.')[0]}]</span>
              <span className="log-message">
                Analyzing... {progress}% complete
                {progress % 20 === 0 && ` (checksum: ${generateRandomHex(4)})`}
              </span>
            </div>
          )}
        </div>
        <div className="terminal-input">
          <span className="prompt">$</span>
          <span className="cursor">|</span>
        </div>
      </div>

      <div className="call-panel">
        <div className={`call-screen ${callStatus}`}>
          <div className="caller-info">
            <img src={callerInfo.avatar} alt="Caller" className="caller-avatar" />
            <h2>{callerInfo.name}</h2>
            <p>{callerInfo.number}</p>
          </div>

          {callStatus === 'incoming' && (
            <div className="call-buttons">
              <button className="decline-btn" onClick={handleDecline}>
                Decline
              </button>
              <button className="answer-btn" onClick={handleAnswer}>
                Answer
              </button>
            </div>
          )}

          {callStatus === 'analyzing' && (
            <div className="analysis-container">
              <div className="analyzing-animation">
                <div className="wave"></div>
                <div className="wave"></div>
                <div className="wave"></div>
              </div>
              <p>Analyzing voice patterns...</p>
              <div className="progress-bar">
                <div className="progress" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          )}

          {callStatus === 'scam-detected' && (
            <div className="scam-alert">
              <div className="warning-icon">⚠️</div>
              <h2>SCAM ALERT</h2>
              <p>Deepfake AI voice detected</p>
              <button className="end-call-btn" onClick={handleDecline}>
                End Call
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;