import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Accessibility, X } from 'lucide-react';

interface AccessibilitySettings {
  highContrast: boolean;
  reducedMotion: boolean;
  fontSize: number;
  focusIndicators: boolean;
  stopAnimations: boolean;
  textSpacing: boolean;
  linkUnderlines: boolean;
}

const AccessibilityPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    reducedMotion: false,
    fontSize: 100,
    focusIndicators: true,
    stopAnimations: false,
    textSpacing: false,
    linkUnderlines: false,
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibility-settings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(parsed);
      applySettings(parsed);
    }
  }, []);

  // Apply settings to the document
  const applySettings = (newSettings: AccessibilitySettings) => {
    const root = document.documentElement;
    
    // High contrast
    if (newSettings.highContrast) {
      root.classList.add('accessibility-high-contrast');
    } else {
      root.classList.remove('accessibility-high-contrast');
    }
    
    // Reduced motion
    if (newSettings.reducedMotion) {
      root.classList.add('accessibility-reduced-motion');
    } else {
      root.classList.remove('accessibility-reduced-motion');
    }
    
    // Font size
    root.style.setProperty('--accessibility-font-scale', `${newSettings.fontSize / 100}`);
    
    // Focus indicators
    if (newSettings.focusIndicators) {
      root.classList.add('accessibility-enhanced-focus');
    } else {
      root.classList.remove('accessibility-enhanced-focus');
    }
    
    // Stop animations
    if (newSettings.stopAnimations) {
      root.classList.add('accessibility-stop-animations');
    } else {
      root.classList.remove('accessibility-stop-animations');
    }
    
    // Text spacing
    if (newSettings.textSpacing) {
      root.classList.add('accessibility-text-spacing');
    } else {
      root.classList.remove('accessibility-text-spacing');
    }
    
    // Link underlines
    if (newSettings.linkUnderlines) {
      root.classList.add('accessibility-link-underlines');
    } else {
      root.classList.remove('accessibility-link-underlines');
    }
  };

  // Update a single setting
  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K, 
    value: AccessibilitySettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    applySettings(newSettings);
    localStorage.setItem('accessibility-settings', JSON.stringify(newSettings));
  };

  // Reset all settings
  const resetSettings = () => {
    const defaultSettings: AccessibilitySettings = {
      highContrast: false,
      reducedMotion: false,
      fontSize: 100,
      focusIndicators: true,
      stopAnimations: false,
      textSpacing: false,
      linkUnderlines: false,
    };
    setSettings(defaultSettings);
    applySettings(defaultSettings);
    localStorage.setItem('accessibility-settings', JSON.stringify(defaultSettings));
  };

  return (
    <>
      {/* Floating accessibility button */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            className="fixed bottom-4 right-4 z-50 rounded-full w-12 h-12 shadow-lg"
            size="icon"
            aria-label="Open accessibility settings"
          >
            <Accessibility className="h-6 w-6" aria-hidden="true" />
          </Button>
        </DialogTrigger>
        
        <DialogContent className="max-w-md" aria-describedby="accessibility-description">
          <DialogHeader>
            <DialogTitle>Accessibility Settings</DialogTitle>
            <p id="accessibility-description" className="text-sm text-muted-foreground">
              Customize the site's appearance and behavior to meet your needs.
            </p>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* High Contrast */}
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="high-contrast" className="text-sm font-medium">
                  High Contrast
                </label>
                <p className="text-xs text-muted-foreground">
                  Increases contrast for better visibility
                </p>
              </div>
              <Switch
                id="high-contrast"
                checked={settings.highContrast}
                onCheckedChange={(checked) => updateSetting('highContrast', checked)}
              />
            </div>
            
            {/* Reduced Motion */}
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="reduced-motion" className="text-sm font-medium">
                  Reduced Motion
                </label>
                <p className="text-xs text-muted-foreground">
                  Minimizes animations and transitions
                </p>
              </div>
              <Switch
                id="reduced-motion"
                checked={settings.reducedMotion}
                onCheckedChange={(checked) => updateSetting('reducedMotion', checked)}
              />
            </div>
            
            {/* Font Size */}
            <div>
              <label htmlFor="font-size" className="text-sm font-medium block mb-2">
                Font Size: {settings.fontSize}%
              </label>
              <Slider
                id="font-size"
                min={75}
                max={150}
                step={25}
                value={[settings.fontSize]}
                onValueChange={([value]) => updateSetting('fontSize', value)}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Small</span>
                <span>Normal</span>
                <span>Large</span>
              </div>
            </div>
            
            {/* Enhanced Focus */}
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="enhanced-focus" className="text-sm font-medium">
                  Enhanced Focus Indicators
                </label>
                <p className="text-xs text-muted-foreground">
                  Makes keyboard focus more visible
                </p>
              </div>
              <Switch
                id="enhanced-focus"
                checked={settings.focusIndicators}
                onCheckedChange={(checked) => updateSetting('focusIndicators', checked)}
              />
            </div>
            
            {/* Stop Animations */}
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="stop-animations" className="text-sm font-medium">
                  Stop All Animations
                </label>
                <p className="text-xs text-muted-foreground">
                  Disables all decorative animations and transitions
                </p>
              </div>
              <Switch
                id="stop-animations"
                checked={settings.stopAnimations}
                onCheckedChange={(checked) => updateSetting('stopAnimations', checked)}
              />
            </div>
            
            {/* Text Spacing */}
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="text-spacing" className="text-sm font-medium">
                  Improved Text Spacing
                </label>
                <p className="text-xs text-muted-foreground">
                  Increases line height and letter spacing for better readability
                </p>
              </div>
              <Switch
                id="text-spacing"
                checked={settings.textSpacing}
                onCheckedChange={(checked) => updateSetting('textSpacing', checked)}
              />
            </div>
            
            {/* Link Underlines */}
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="link-underlines" className="text-sm font-medium">
                  Always Show Link Underlines
                </label>
                <p className="text-xs text-muted-foreground">
                  Makes all links permanently underlined for better identification
                </p>
              </div>
              <Switch
                id="link-underlines"
                checked={settings.linkUnderlines}
                onCheckedChange={(checked) => updateSetting('linkUnderlines', checked)}
              />
            </div>
            
            {/* Reset Button */}
            <Button 
              variant="outline" 
              onClick={resetSettings}
              className="w-full"
            >
              Reset to Default
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AccessibilityPanel;