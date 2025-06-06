
import React, { useState } from 'react';
import AdminNav from '@/components/admin/AdminNav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, ExternalLink, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Test = () => {
  const [testUrl, setTestUrl] = useState('');
  const [customEmbed, setCustomEmbed] = useState('');
  const [embedType, setEmbedType] = useState('iframe');
  const [sandbox, setSandbox] = useState(true);
  const [allowFullscreen, setAllowFullscreen] = useState(false);
  const { toast } = useToast();

  const presetExamples = [
    {
      name: 'YouTube Video',
      type: 'iframe',
      code: '<iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>',
      description: 'Standard YouTube embed'
    },
    {
      name: 'Google Forms',
      type: 'iframe',
      code: '<iframe src="https://docs.google.com/forms/d/e/1FAIpQLSexample/viewform?embedded=true" width="640" height="480" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>',
      description: 'Google Forms embed example'
    },
    {
      name: 'Google Maps',
      type: 'iframe',
      code: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3048.4" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
      description: 'Google Maps embed'
    },
    {
      name: 'Calendly',
      type: 'script',
      code: '<div class="calendly-inline-widget" data-url="https://calendly.com/your-link" style="min-width:320px;height:630px;"></div>\n<script type="text/javascript" src="https://assets.calendly.com/assets/external/widget.js" async></script>',
      description: 'Calendly scheduling widget'
    }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Code copied to clipboard",
    });
  };

  const generateIframe = () => {
    if (!testUrl) return '';
    
    const sandboxAttr = sandbox ? 'sandbox="allow-scripts allow-same-origin allow-forms allow-popups"' : '';
    const allowFullscreenAttr = allowFullscreen ? 'allowfullscreen' : '';
    
    return `<iframe src="${testUrl}" width="100%" height="500" frameborder="0" ${sandboxAttr} ${allowFullscreenAttr}></iframe>`;
  };

  const testUrlValid = testUrl && (testUrl.startsWith('http://') || testUrl.startsWith('https://'));

  return (
    <div>
      <AdminNav />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Test Page - Embeds & iFrames</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick URL Test</CardTitle>
                <CardDescription>Test any URL in an iframe quickly</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="test-url">URL to Test</Label>
                  <Input
                    id="test-url"
                    type="url"
                    placeholder="https://example.com"
                    value={testUrl}
                    onChange={(e) => setTestUrl(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sandbox"
                      checked={sandbox}
                      onCheckedChange={setSandbox}
                    />
                    <Label htmlFor="sandbox">Enable Sandbox</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="fullscreen"
                      checked={allowFullscreen}
                      onCheckedChange={setAllowFullscreen}
                    />
                    <Label htmlFor="fullscreen">Allow Fullscreen</Label>
                  </div>
                </div>
                
                {testUrlValid && (
                  <div className="space-y-2">
                    <Label>Generated Code:</Label>
                    <Textarea
                      value={generateIframe()}
                      readOnly
                      className="text-sm font-mono"
                      rows={3}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(generateIframe())}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Code
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Custom Embed Code</CardTitle>
                <CardDescription>Test custom HTML embed codes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="embed-type">Embed Type</Label>
                  <Select value={embedType} onValueChange={setEmbedType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="iframe">iFrame</SelectItem>
                      <SelectItem value="script">Script Embed</SelectItem>
                      <SelectItem value="object">Object/Embed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="custom-embed">Custom Embed Code</Label>
                  <Textarea
                    id="custom-embed"
                    placeholder="Paste your embed code here..."
                    value={customEmbed}
                    onChange={(e) => setCustomEmbed(e.target.value)}
                    rows={6}
                    className="font-mono text-sm"
                  />
                </div>
                
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Only test embed codes from trusted sources. Malicious code can compromise security.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>

          {/* Preview Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
                <CardDescription>See how your embed will look</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-[300px]">
                  {testUrlValid ? (
                    <iframe
                      src={testUrl}
                      width="100%"
                      height="300"
                      frameBorder="0"
                      sandbox={sandbox ? "allow-scripts allow-same-origin allow-forms allow-popups" : undefined}
                      allowFullScreen={allowFullscreen}
                      className="w-full"
                    />
                  ) : customEmbed ? (
                    <div 
                      dangerouslySetInnerHTML={{ __html: customEmbed }}
                      className="w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      Enter a URL or embed code to see preview
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  {sandbox ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  )}
                  <span className="text-sm">
                    Sandbox: {sandbox ? 'Enabled (Recommended)' : 'Disabled'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {allowFullscreen ? (
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                  <span className="text-sm">
                    Fullscreen: {allowFullscreen ? 'Allowed' : 'Restricted'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Preset Examples */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Preset Examples</CardTitle>
            <CardDescription>Common embed patterns you can test and modify</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="youtube" className="w-full">
              <TabsList className="grid grid-cols-4 w-full">
                {presetExamples.map((example, index) => (
                  <TabsTrigger key={index} value={example.name.toLowerCase().replace(' ', '-')}>
                    {example.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              {presetExamples.map((example, index) => (
                <TabsContent key={index} value={example.name.toLowerCase().replace(' ', '-')}>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">{example.description}</p>
                    <Textarea
                      value={example.code}
                      readOnly
                      className="font-mono text-sm"
                      rows={4}
                    />
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(example.code)}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Copy
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setCustomEmbed(example.code)}
                      >
                        Load in Preview
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Test;
