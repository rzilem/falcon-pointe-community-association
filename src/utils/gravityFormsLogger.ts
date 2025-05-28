
// Rotating debug logger for Gravity Forms issues
interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  category: 'iframe' | 'calendar' | 'network' | 'dom';
  message: string;
  data?: any;
}

class GravityFormsLogger {
  private logs: LogEntry[] = [];
  private maxLogs = 100; // Keep last 100 logs
  private enabled = true;

  log(level: LogEntry['level'], category: LogEntry['category'], message: string, data?: any) {
    if (!this.enabled) return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      data: data ? JSON.stringify(data, null, 2) : undefined
    };

    this.logs.push(entry);
    
    // Rotate logs if we exceed max
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Also log to console for immediate debugging
    const consoleMethod = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
    consoleMethod(`[GravityForms ${category}]`, message, data || '');
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }

  disable() {
    this.enabled = false;
  }

  enable() {
    this.enabled = true;
  }
}

export const gravityFormsLogger = new GravityFormsLogger();
