
import React, { useState } from 'react';
import { Plus, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'completed';
  dueDate: string;
  estimatedHours: number;
  fatigueImpact: number;
}

const TaskManager = () => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Implement user authentication',
      description: 'Set up login and registration system',
      assignedTo: 'John Doe',
      priority: 'high',
      status: 'in-progress',
      dueDate: '2024-01-15',
      estimatedHours: 8,
      fatigueImpact: 7
    },
    {
      id: '2',
      title: 'Design landing page',
      description: 'Create responsive landing page design',
      assignedTo: 'Jane Smith',
      priority: 'medium',
      status: 'todo',
      dueDate: '2024-01-20',
      estimatedHours: 6,
      fatigueImpact: 5
    },
    {
      id: '3',
      title: 'Database optimization',
      description: 'Optimize database queries for better performance',
      assignedTo: 'Mike Johnson',
      priority: 'high',
      status: 'completed',
      dueDate: '2024-01-10',
      estimatedHours: 4,
      fatigueImpact: 8
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    dueDate: '',
    estimatedHours: 0,
    fatigueImpact: 5
  });

  const employees = ['John Doe', 'Jane Smith', 'Mike Johnson'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newTask: Task = {
      id: Date.now().toString(),
      ...formData,
      status: 'todo'
    };
    
    setTasks(prev => [...prev, newTask]);
    setFormData({
      title: '',
      description: '',
      assignedTo: '',
      priority: 'medium',
      dueDate: '',
      estimatedHours: 0,
      fatigueImpact: 5
    });
    setIsDialogOpen(false);
    
    toast({
      title: "Task Created",
      description: "New task has been successfully created.",
    });
  };

  const updateTaskStatus = (taskId: string, newStatus: Task['status']) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in-progress': return <Clock className="w-4 h-4 text-blue-600" />;
      case 'todo': return <AlertCircle className="w-4 h-4 text-gray-600" />;
      default: return null;
    }
  };

  const groupedTasks = {
    todo: tasks.filter(task => task.status === 'todo'),
    'in-progress': tasks.filter(task => task.status === 'in-progress'),
    completed: tasks.filter(task => task.status === 'completed')
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Task Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Task Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="assignedTo">Assign To</Label>
                  <Select value={formData.assignedTo} onValueChange={(value) => setFormData(prev => ({ ...prev, assignedTo: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map(employee => (
                        <SelectItem key={employee} value={employee}>{employee}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={formData.priority} onValueChange={(value: 'low' | 'medium' | 'high') => setFormData(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="estimatedHours">Est. Hours</Label>
                  <Input
                    id="estimatedHours"
                    type="number"
                    value={formData.estimatedHours}
                    onChange={(e) => setFormData(prev => ({ ...prev, estimatedHours: parseInt(e.target.value) }))}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="fatigueImpact">Fatigue Impact (1-10)</Label>
                <Input
                  id="fatigueImpact"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.fatigueImpact}
                  onChange={(e) => setFormData(prev => ({ ...prev, fatigueImpact: parseInt(e.target.value) }))}
                  required
                />
              </div>

              <Button type="submit" className="w-full">Create Task</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(groupedTasks).map(([status, statusTasks]) => (
          <div key={status} className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 capitalize">
              {status.replace('-', ' ')} ({statusTasks.length})
            </h3>
            <div className="space-y-3">
              {statusTasks.map((task) => (
                <Card key={task.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base">{task.title}</CardTitle>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(task.status)}
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Assigned to:</span>
                        <span className="font-medium">{task.assignedTo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Due:</span>
                        <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Est. Hours:</span>
                        <span>{task.estimatedHours}h</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Fatigue Impact:</span>
                        <span className="font-medium">{task.fatigueImpact}/10</span>
                      </div>
                    </div>
                    
                    {task.status !== 'completed' && (
                      <div className="mt-3 flex space-x-2">
                        {task.status === 'todo' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateTaskStatus(task.id, 'in-progress')}
                          >
                            Start
                          </Button>
                        )}
                        {task.status === 'in-progress' && (
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => updateTaskStatus(task.id, 'completed')}
                          >
                            Complete
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskManager;
