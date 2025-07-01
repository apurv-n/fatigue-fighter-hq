
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

const SettingsPage = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    company: {
      name: 'Your Company',
      fatigueWarningThreshold: 70,
      fatigueCriticalThreshold: 85,
      breakReminderInterval: 60,
      maxWorkHours: 8
    },
    notifications: {
      email: true,
      push: true,
      breaks: true,
      fatigue: true,
      tasks: false
    },
    monitoring: {
      autoBreaks: true,
      keystrokeTracking: true,
      screenTime: true,
      productivityScore: true
    }
  });

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Settings</h2>
        <p className="text-gray-600">Manage your system preferences and configurations</p>
      </div>

      <Tabs defaultValue="company" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>Company Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={settings.company.name}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      company: { ...prev.company, name: e.target.value }
                    }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="maxWorkHours">Max Work Hours per Day</Label>
                  <Select
                    value={settings.company.maxWorkHours.toString()}
                    onValueChange={(value) => setSettings(prev => ({
                      ...prev,
                      company: { ...prev.company, maxWorkHours: parseInt(value) }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">6 hours</SelectItem>
                      <SelectItem value="7">7 hours</SelectItem>
                      <SelectItem value="8">8 hours</SelectItem>
                      <SelectItem value="9">9 hours</SelectItem>
                      <SelectItem value="10">10 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4">Fatigue Thresholds</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="warningThreshold">Warning Threshold (%)</Label>
                    <Input
                      id="warningThreshold"
                      type="number"
                      min="50"
                      max="100"
                      value={settings.company.fatigueWarningThreshold}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        company: { ...prev.company, fatigueWarningThreshold: parseInt(e.target.value) }
                      }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="criticalThreshold">Critical Threshold (%)</Label>
                    <Input
                      id="criticalThreshold"
                      type="number"
                      min="70"
                      max="100"
                      value={settings.company.fatigueCriticalThreshold}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        company: { ...prev.company, fatigueCriticalThreshold: parseInt(e.target.value) }
                      }))}
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="breakInterval">Break Reminder Interval (minutes)</Label>
                <Select
                  value={settings.company.breakReminderInterval.toString()}
                  onValueChange={(value) => setSettings(prev => ({
                    ...prev,
                    company: { ...prev.company, breakReminderInterval: parseInt(value) }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="90">1.5 hours</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <p className="text-sm text-gray-500">Receive notifications via email</p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={settings.notifications.email}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, email: checked }
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="pushNotifications">Push Notifications</Label>
                    <p className="text-sm text-gray-500">Receive browser notifications</p>
                  </div>
                  <Switch
                    id="pushNotifications"
                    checked={settings.notifications.push}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, push: checked }
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="breakNotifications">Break Reminders</Label>
                    <p className="text-sm text-gray-500">Get notified when it's time for a break</p>
                  </div>
                  <Switch
                    id="breakNotifications"
                    checked={settings.notifications.breaks}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, breaks: checked }
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="fatigueNotifications">Fatigue Alerts</Label>
                    <p className="text-sm text-gray-500">Receive alerts for high fatigue levels</p>
                  </div>
                  <Switch
                    id="fatigueNotifications"
                    checked={settings.notifications.fatigue}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, fatigue: checked }
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="taskNotifications">Task Updates</Label>
                    <p className="text-sm text-gray-500">Get notified about task assignments and completions</p>
                  </div>
                  <Switch
                    id="taskNotifications"
                    checked={settings.notifications.tasks}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, tasks: checked }
                    }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring">
          <Card>
            <CardHeader>
              <CardTitle>Monitoring Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoBreaks">Automatic Breaks</Label>
                    <p className="text-sm text-gray-500">Automatically trigger breaks when fatigue is high</p>
                  </div>
                  <Switch
                    id="autoBreaks"
                    checked={settings.monitoring.autoBreaks}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      monitoring: { ...prev.monitoring, autoBreaks: checked }
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="keystrokeTracking">Keystroke Tracking</Label>
                    <p className="text-sm text-gray-500">Monitor typing patterns for fatigue detection</p>
                  </div>
                  <Switch
                    id="keystrokeTracking"
                    checked={settings.monitoring.keystrokeTracking}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      monitoring: { ...prev.monitoring, keystrokeTracking: checked }
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="screenTime">Screen Time Monitoring</Label>
                    <p className="text-sm text-gray-500">Track active screen time for wellness insights</p>
                  </div>
                  <Switch
                    id="screenTime"
                    checked={settings.monitoring.screenTime}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      monitoring: { ...prev.monitoring, screenTime: checked }
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="productivityScore">Productivity Scoring</Label>
                    <p className="text-sm text-gray-500">Calculate and display productivity metrics</p>
                  </div>
                  <Switch
                    id="productivityScore"
                    checked={settings.monitoring.productivityScore}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      monitoring: { ...prev.monitoring, productivityScore: checked }
                    }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security & Privacy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Data Retention</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Control how long your data is stored in the system.
                  </p>
                  <Select defaultValue="90">
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="180">6 months</SelectItem>
                      <SelectItem value="365">1 year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-2">Privacy Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Anonymous Analytics</Label>
                        <p className="text-sm text-gray-500">Help improve the platform with anonymous usage data</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Data Export</Label>
                        <p className="text-sm text-gray-500">Allow data export for compliance purposes</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-2">Danger Zone</h3>
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full md:w-auto">
                      Export All Data
                    </Button>
                    <Button variant="destructive" className="w-full md:w-auto">
                      Delete All Data
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-gradient-to-r from-blue-600 to-purple-600">
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
