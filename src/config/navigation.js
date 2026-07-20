// src/config/navigation.js
export const MODE_HOME = {
  guided: '/starter-kit',
  explore: '/',
};

export const NAV_BY_MODE = {
  guided: [
    { path: '/starter-kit', label: 'Start Here', iconKey: 'Package' },
    { path: '/essentials', label: 'Essentials', iconKey: 'BookOpen' },
    { path: '/documents', label: 'Documents', iconKey: 'FolderDown' },
    { path: '/scenarios', label: 'Scenarios', iconKey: 'LayoutTemplate' },
    { path: '/more', label: 'More', iconKey: 'MoreHorizontal' },
  ],
  explore: [
    { path: '/', label: 'Discover', iconKey: 'Home' },
    { path: '/resources', label: 'Resources', iconKey: 'Wrench' },
    { path: '/documents', label: 'Documents', iconKey: 'FolderDown' },
    { path: '/scenarios', label: 'Scenarios', iconKey: 'LayoutTemplate' },
    { path: '/community', label: 'Community', iconKey: 'Users' },
  ],
};

export const MORE_LINKS_GUIDED = [
  { path: '/resources?tab=gigs', label: 'Gigs Boards', iconKey: 'Briefcase' },
  { path: '/community', label: 'Communities', iconKey: 'Users' },
  { path: '/contributors', label: 'Contributors', iconKey: 'UserCircle' },
  { path: '/feedback', label: 'Feedback', iconKey: 'MessageSquare' },
];

export const ROUTE_AVAILABILITY = {
  '/essentials': ['guided'],
  '/resources': ['explore'],
  '/community': ['explore'],
  '/more': ['guided'],
};

export function getNavForMode(mode) {
  return NAV_BY_MODE[mode] ?? NAV_BY_MODE.explore;
}

export function isRouteAvailable(pathname, mode) {
  const base = pathname.split('?')[0];
  const allowed = ROUTE_AVAILABILITY[base];
  if (!allowed) return true;
  return allowed.includes(mode);
}
