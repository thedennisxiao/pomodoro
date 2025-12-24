class PomodoroTimer {
    constructor() {
        this.workDuration = 25 * 60; // 25 minutes in seconds
        this.breakDuration = 5 * 60; // 5 minutes in seconds
        this.timeLeft = this.workDuration;
        this.isRunning = false;
        this.isWorkMode = true;
        this.sessionCount = 0;
        this.interval = null;
        
        this.timeElement = document.getElementById('time');
        this.modeElement = document.getElementById('mode');
        this.startPauseBtn = document.getElementById('startPause');
        this.resetBtn = document.getElementById('reset');
        this.sessionCountElement = document.getElementById('sessionCount');
        this.workBtn = document.getElementById('workBtn');
        this.restBtn = document.getElementById('restBtn');
        this.addTimeBtn = document.getElementById('addTimeBtn');
        
        this.startPauseBtn.addEventListener('click', () => this.toggleTimer());
        this.resetBtn.addEventListener('click', () => this.resetTimer());
        this.workBtn.addEventListener('click', () => this.setWorkMode());
        this.restBtn.addEventListener('click', () => this.setRestMode());
        this.addTimeBtn.addEventListener('click', () => this.addTime());
        
        this.updateModeButtons();
        this.updateDisplay();
    }
    
    toggleTimer() {
        if (this.isRunning) {
            this.pauseTimer();
        } else {
            this.startTimer();
        }
    }
    
    startTimer() {
        this.isRunning = true;
        this.startPauseBtn.textContent = 'Pause';
        
        this.interval = setInterval(() => {
            this.timeLeft--;
            this.updateDisplay();
            
            if (this.timeLeft <= 0) {
                this.completeSession();
            }
        }, 1000);
    }
    
    pauseTimer() {
        this.isRunning = false;
        this.startPauseBtn.textContent = 'Start';
        clearInterval(this.interval);
    }
    
    resetTimer() {
        this.pauseTimer();
        this.isWorkMode = true;
        this.timeLeft = this.workDuration;
        this.updateModeButtons();
        this.updateDisplay();
    }
    
    setWorkMode() {
        this.pauseTimer();
        this.isWorkMode = true;
        this.timeLeft = this.workDuration;
        this.updateModeButtons();
        this.updateDisplay();
    }
    
    setRestMode() {
        this.pauseTimer();
        this.isWorkMode = false;
        this.timeLeft = this.breakDuration;
        this.updateModeButtons();
        this.updateDisplay();
    }
    
    updateModeButtons() {
        if (this.isWorkMode) {
            this.workBtn.classList.add('btn-mode-active');
            this.restBtn.classList.remove('btn-mode-active');
        } else {
            this.restBtn.classList.add('btn-mode-active');
            this.workBtn.classList.remove('btn-mode-active');
        }
    }
    
    addTime() {
        // Add 5 minutes (300 seconds) to the current timer
        this.timeLeft += 5 * 60;
        this.updateDisplay();
    }
    
    completeSession() {
        clearInterval(this.interval);
        this.isRunning = false;
        this.startPauseBtn.textContent = 'Start';
        
        if (this.isWorkMode) {
            // Work session completed
            this.sessionCount++;
            this.sessionCountElement.textContent = this.sessionCount;
            this.isWorkMode = false;
            this.timeLeft = this.breakDuration;
            
            // Show notification
            this.showNotification('Break Time!', 'Take a 5-minute break.');
        } else {
            // Break completed
            this.isWorkMode = true;
            this.timeLeft = this.workDuration;
            
            // Show notification
            this.showNotification('Break Over!', 'Ready for another work session?');
        }
        
        this.updateDisplay();
        
        // Play notification sound if browser supports it
        this.playNotificationSound();
    }
    
    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        const timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        this.timeElement.textContent = timeString;
        
        if (this.isWorkMode) {
            this.modeElement.textContent = 'Work Session';
            this.modeElement.className = 'mode work';
        } else {
            this.modeElement.textContent = 'Break Time';
            this.modeElement.className = 'mode break';
        }
        
        // Update browser tab title with remaining time
        this.updateTabTitle(timeString);
    }
    
    updateTabTitle(timeString) {
        if (this.isRunning) {
            document.title = `${timeString} - Pomodoro`;
        } else {
            document.title = 'Pomodoro';
        }
    }
    
    showNotification(title, message) {
        // Check if browser supports notifications
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, {
                body: message,
                icon: '🔔'
            });
        } else if ('Notification' in window && Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification(title, {
                        body: message,
                        icon: '🔔'
                    });
                }
            });
        }
        
        // Visual alert as fallback
        alert(`${title}\n${message}`);
    }
    
    playNotificationSound() {
        // Create a simple beep sound using Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    }
}

// Initialize the timer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new PomodoroTimer();
});

