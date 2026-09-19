import React from 'react';
import { useIOSStore, IOSAppId } from '../../../store/iosStore';
import { person } from '../../../data/person';
import { AvatarUploader } from '../../common/AvatarUploader';
import {
  FinderIcon, TerminalIcon, SafariIcon, MailIcon,
  MusicIcon, PhotosIcon, ActivityMonitorIcon, CalendarIcon, SettingsIcon
} from '../../../icons/AppIcons';
import './HomeScreen.css';

interface GridApp {
  id: IOSAppId;
  label: string;
  Icon: React.ComponentType<{ size?: number }>;
}

const GRID_APPS: GridApp[] = [
  { id: 'finder',          label: 'Finder',    Icon: FinderIcon },
  { id: 'terminal',        label: 'Terminal',  Icon: TerminalIcon },
  { id: 'safari',          label: 'Safari',    Icon: SafariIcon },
  { id: 'mail',            label: 'Mail',      Icon: MailIcon },
  { id: 'music',           label: 'Music',     Icon: MusicIcon },
  { id: 'photos',          label: 'Photos',    Icon: PhotosIcon },
  { id: 'activitymonitor', label: 'Activity',  Icon: ActivityMonitorIcon },
  { id: 'calendar',        label: 'Calendar',  Icon: CalendarIcon },
  { id: 'settings',        label: 'Settings',  Icon: SettingsIcon },
];

const DOCK_APPS: GridApp[] = [
  { id: 'finder',   label: 'Finder',   Icon: FinderIcon },
  { id: 'terminal', label: 'Terminal', Icon: TerminalIcon },
  { id: 'safari',   label: 'Safari',   Icon: SafariIcon },
  { id: 'mail',     label: 'Mail',     Icon: MailIcon },
];

export function HomeScreen() {
  const launchApp = useIOSStore(s => s.launchApp);

  return (
    <div className="ios-homescreen">
      {/* Wallpaper */}
      <div className="ios-homescreen-bg" />

      {/* Identity widget */}
      <div className="ios-widget">
        <AvatarUploader defaultSrc={person.avatar} alt={person.name} size={140} />
        <div>
          <p className="ios-widget-name">{person.name}</p>
          <p className="ios-widget-title">{person.title}</p>
        </div>
      </div>

      {/* App grid */}
      <div className="ios-app-grid">
        {GRID_APPS.map((app) => (
          <AppIcon key={app.id} app={app} onTap={() => launchApp(app.id)} />
        ))}
      </div>

      {/* iOS Dock */}
      <div className="ios-dock">
        <div className="ios-dock-tray">
          {DOCK_APPS.map((app) => (
            <AppIcon key={app.id} app={app} onTap={() => launchApp(app.id)} inDock />
          ))}
        </div>
      </div>
    </div>
  );
}

interface AppIconProps {
  app: GridApp;
  onTap: () => void;
  inDock?: boolean;
}

function AppIcon({ app, onTap, inDock = false }: AppIconProps) {
  const [pressed, setPressed] = React.useState(false);

  const handlePress = () => {
    setPressed(true);
    setTimeout(() => { setPressed(false); onTap(); }, 150);
  };

  return (
    <div
      className={`ios-app-icon ${inDock ? 'ios-app-icon--dock' : ''} ${pressed ? 'ios-app-icon--pressed' : ''}`}
      onClick={handlePress}
      role="button"
      aria-label={`Open ${app.label}`}
    >
      <div className="ios-app-icon-img">
        <app.Icon size={60} />
      </div>
      {!inDock && <span className="ios-app-label">{app.label}</span>}
    </div>
  );
}
