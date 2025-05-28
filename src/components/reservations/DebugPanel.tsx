
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { gravityFormsLogger } from '@/utils/gravityFormsLogger';
import { Eye, EyeOff, Trash2, RefreshCw } from 'lucide-react';

const DebugPanel = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [logs, setLogs] = useState(gravityFormsLogger.getLogs());
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setLogs(gravityFormsLogger.getLogs());
    }, 1000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleClearLogs = () => {
    gravityFormsLogger.clearLogs();
    setLogs([]);
  };

  const handleRefresh = () => {
    setLogs(gravityFormsLogger.getLogs());
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'destructive';
      case 'warn': return 'secondary';
      default: return 'default';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'iframe': return 'bg-blue-100 text-blue-800';
      case 'calendar': return 'bg-green-100 text-green-800';
      case 'network': return 'bg-purple-100 text-purple-800';
      case 'dom': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsVisible(true)}
          variant="outline"
          size="sm"
          className="bg-white shadow-lg"
        >
          <Eye className="h-4 w-4 mr-2" />
          Debug Panel
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-h-96">
      <Card className="shadow-lg">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Gravity Forms Debug</CardTitle>
            <div className="flex gap-1">
              <Button
                onClick={() => setAutoRefresh(!autoRefresh)}
                variant="ghost"
                size="sm"
                className={autoRefresh ? 'text-green-600' : 'text-gray-400'}
              >
                <RefreshCw className="h-3 w-3" />
              </Button>
              <Button onClick={handleClearLogs} variant="ghost" size="sm">
                <Trash2 className="h-3 w-3" />
              </Button>
              <Button onClick={() => setIsVisible(false)} variant="ghost" size="sm">
                <EyeOff className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-2">
          <div className="flex gap-1 mb-2">
            <Badge variant="outline" className="text-xs">
              {logs.length} logs
            </Badge>
            {autoRefresh && (
              <Badge variant="outline" className="text-xs text-green-600">
                Live
              </Badge>
            )}
          </div>
          <ScrollArea className="h-72">
            <div className="space-y-1">
              {logs.length === 0 ? (
                <div className="text-xs text-gray-500 p-2">No logs yet...</div>
              ) : (
                logs.slice(-20).map((log, index) => (
                  <div key={index} className="text-xs border-b border-gray-100 pb-1">
                    <div className="flex items-center gap-1 mb-1">
                      <Badge variant={getLevelColor(log.level)} className="text-xs px-1 py-0">
                        {log.level}
                      </Badge>
                      <Badge className={`text-xs px-1 py-0 ${getCategoryColor(log.category)}`}>
                        {log.category}
                      </Badge>
                      <span className="text-gray-400 text-xs">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-gray-700">{log.message}</div>
                    {log.data && (
                      <pre className="text-xs text-gray-500 mt-1 bg-gray-50 p-1 rounded overflow-auto max-h-20">
                        {log.data}
                      </pre>
                    )}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default DebugPanel;
