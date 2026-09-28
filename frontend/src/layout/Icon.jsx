import React from 'react';
import {
  Star,
  ClipboardList,
  CheckCircle2,
  Compass,
  MessageSquare,
  User,
  Settings,
  Award,
  Search,
  Send,
  LogOut,
  Bell,
  Clock,
  ArrowRight,
  Plus,
  Repeat
} from 'lucide-react';

// Simple Icon Helper Component
export default function Icon({ name, size = 18, color, className, fill }) {
  const iconMap = {
    star: Star,
    clipboard: ClipboardList,
    check: CheckCircle2,
    compass: Compass,
    message: MessageSquare,
    user: User,
    settings: Settings,
    award: Award,
    search: Search,
    send: Send,
    logout: LogOut,
    bell: Bell,
    clock: Clock,
    arrowRight: ArrowRight,
    plus: Plus,
    logo: Repeat
  };

  const Component = iconMap[name] || Star;
  return <Component size={size} color={color} className={className} fill={fill || 'none'} />;
}
