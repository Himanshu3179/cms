import React from 'react';
import { Globe, Trophy, Newspaper, Calendar } from 'lucide-react';
import { mockWebpages } from '../components/CalendarView';

export const getWebpageIcon = (webpageName: string) => {
  const webpage = mockWebpages.find(w => w.name === webpageName);
  switch (webpage?.icon) {
    case 'football':
      return <Globe className="h-4 w-4 text-green-600" />;
    case 'trophy':
      return <Trophy className="h-4 w-4 text-yellow-600" />;
    case 'refresh-cw':
      return <Newspaper className="h-4 w-4 text-blue-600" />;
    case 'bar-chart':
      return <Calendar className="h-4 w-4 text-purple-600" />;
    case 'flag':
      return <Globe className="h-4 w-4 text-red-600" />;
    case 'sun':
      return <Globe className="h-4 w-4 text-orange-600" />;
    case 'shield':
      return <Globe className="h-4 w-4 text-indigo-600" />;
    default:
      return <Globe className="h-4 w-4 text-gray-600" />;
  }
};