import React from 'react';
// @ts-ignore // suppress TS module resolution error
import { FaFolder, FaTerminal, FaGlobe, FaEnvelope, FaMusic, FaImage, FaChartLine, FaCalendarAlt, FaCog } from 'react-icons/fa';

/**
 * Official icon components using react-icons (FontAwesome).
 * Each component accepts an optional `size` prop (default 48) to control dimensions.
 */
export const FinderIcon = ({ size = 48 }: { size?: number }) => <FaFolder size={size} />;
export const TerminalIcon = ({ size = 48 }: { size?: number }) => <FaTerminal size={size} />;
export const SafariIcon = ({ size = 48 }: { size?: number }) => <FaGlobe size={size} />;
export const MailIcon = ({ size = 48 }: { size?: number }) => <FaEnvelope size={size} />;
export const MusicIcon = ({ size = 48 }: { size?: number }) => <FaMusic size={size} />;
export const PhotosIcon = ({ size = 48 }: { size?: number }) => <FaImage size={size} />;
export const ActivityMonitorIcon = ({ size = 48 }: { size?: number }) => <FaChartLine size={size} />;
export const CalendarIcon = ({ size = 48 }: { size?: number }) => <FaCalendarAlt size={size} />;
export const SettingsIcon = ({ size = 48 }: { size?: number }) => <FaCog size={size} />;
