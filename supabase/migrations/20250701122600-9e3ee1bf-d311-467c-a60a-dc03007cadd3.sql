
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table for user management
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'employee' CHECK (role IN ('admin', 'manager', 'employee')),
  department TEXT,
  position TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create employees table
CREATE TABLE public.employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  employee_id TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  department TEXT NOT NULL,
  position TEXT NOT NULL,
  manager_id UUID REFERENCES public.employees(id),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave')),
  hire_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create fatigue sessions table
CREATE TABLE public.fatigue_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE NOT NULL,
  session_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_end TIMESTAMP WITH TIME ZONE,
  initial_fatigue_score INTEGER DEFAULT 0,
  final_fatigue_score INTEGER DEFAULT 0,
  keystrokes_count INTEGER DEFAULT 0,
  break_count INTEGER DEFAULT 0,
  total_break_time INTEGER DEFAULT 0, -- in minutes
  productivity_score DECIMAL(5,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create fatigue readings table for real-time monitoring
CREATE TABLE public.fatigue_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.fatigue_sessions(id) ON DELETE CASCADE NOT NULL,
  fatigue_score INTEGER NOT NULL CHECK (fatigue_score >= 0 AND fatigue_score <= 100),
  typing_speed INTEGER DEFAULT 0, -- WPM
  keystroke_pattern JSONB, -- Store typing patterns
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create breaks table
CREATE TABLE public.breaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.fatigue_sessions(id) ON DELETE CASCADE NOT NULL,
  break_type TEXT DEFAULT 'manual' CHECK (break_type IN ('manual', 'automatic', 'scheduled')),
  start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_time TIMESTAMP WITH TIME ZONE,
  duration INTEGER, -- in minutes
  reason TEXT
);

-- Create tasks table
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  due_date TIMESTAMP WITH TIME ZONE,
  estimated_hours DECIMAL(5,2),
  actual_hours DECIMAL(5,2),
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'warning', 'error', 'success')),
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create company settings table
CREATE TABLE public.company_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT DEFAULT 'Your Company',
  fatigue_threshold_warning INTEGER DEFAULT 70,
  fatigue_threshold_critical INTEGER DEFAULT 85,
  break_reminder_interval INTEGER DEFAULT 60, -- minutes
  max_work_hours_per_day INTEGER DEFAULT 8,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default company settings
INSERT INTO public.company_settings (company_name) VALUES ('Your Company');

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fatigue_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fatigue_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.breaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for employees (managers and admins can see their team)
CREATE POLICY "Users can view employees" ON public.employees FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND (profiles.role IN ('admin', 'manager') OR employees.user_id = auth.uid())
  )
);

CREATE POLICY "Managers can manage employees" ON public.employees FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('admin', 'manager')
  )
);

-- Create RLS policies for fatigue sessions
CREATE POLICY "Users can view fatigue sessions" ON public.fatigue_sessions FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.employees 
    WHERE employees.id = fatigue_sessions.employee_id 
    AND (employees.user_id = auth.uid() OR EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'manager')
    ))
  )
);

CREATE POLICY "Users can manage their fatigue sessions" ON public.fatigue_sessions FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.employees 
    WHERE employees.id = fatigue_sessions.employee_id 
    AND employees.user_id = auth.uid()
  )
);

-- Create RLS policies for fatigue readings
CREATE POLICY "Users can view fatigue readings" ON public.fatigue_readings FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.fatigue_sessions fs
    JOIN public.employees e ON e.id = fs.employee_id
    WHERE fs.id = fatigue_readings.session_id 
    AND (e.user_id = auth.uid() OR EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'manager')
    ))
  )
);

CREATE POLICY "Users can manage their fatigue readings" ON public.fatigue_readings FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.fatigue_sessions fs
    JOIN public.employees e ON e.id = fs.employee_id
    WHERE fs.id = fatigue_readings.session_id 
    AND e.user_id = auth.uid()
  )
);

-- Create RLS policies for breaks
CREATE POLICY "Users can view breaks" ON public.breaks FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.fatigue_sessions fs
    JOIN public.employees e ON e.id = fs.employee_id
    WHERE fs.id = breaks.session_id 
    AND (e.user_id = auth.uid() OR EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'manager')
    ))
  )
);

CREATE POLICY "Users can manage their breaks" ON public.breaks FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.fatigue_sessions fs
    JOIN public.employees e ON e.id = fs.employee_id
    WHERE fs.id = breaks.session_id 
    AND e.user_id = auth.uid()
  )
);

-- Create RLS policies for tasks
CREATE POLICY "Users can view tasks" ON public.tasks FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.employees 
    WHERE employees.id = tasks.employee_id 
    AND (employees.user_id = auth.uid() OR EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'manager')
    ))
  )
);

CREATE POLICY "Users can manage tasks" ON public.tasks FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('admin', 'manager')
  ) OR 
  EXISTS (
    SELECT 1 FROM public.employees 
    WHERE employees.id = tasks.employee_id 
    AND employees.user_id = auth.uid()
  )
);

-- Create RLS policies for notifications
CREATE POLICY "Users can view their notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can create notifications" ON public.notifications FOR INSERT WITH CHECK (true);

-- Create RLS policies for company settings
CREATE POLICY "Admins can manage company settings" ON public.company_settings FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Users can view company settings" ON public.company_settings FOR SELECT USING (true);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON public.employees FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_company_settings_updated_at BEFORE UPDATE ON public.company_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
