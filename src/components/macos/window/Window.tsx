import React, { useRef, useCallback } from 'react';
import { useWindowStore, WindowId } from '../../../store/windowStore';
import './Window.css';

interface WindowProps {
  id: WindowId;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  maximized: boolean;
  minimized: boolean;
  animatingOut?: boolean;
  animatingIn?: boolean;
  children: React.ReactNode;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
}

export function Window({
  id, title, x, y, width, height, zIndex, maximized, animatingOut, animatingIn,
  children, onClose, onMinimize, onMaximize, onFocus,
}: WindowProps) {
  const { moveWindow, resizeWindow } = useWindowStore();
  const isDragging  = useRef(false);
  const isResizing  = useRef(false);
  const dragStart   = useRef({ x: 0, y: 0, winX: 0, winY: 0 });
  const resizeStart = useRef({ x: 0, y: 0, w: 0, h: 0 });

  const handleTitleBarMouseDown = useCallback((e: React.MouseEvent) => {
    if (maximized) return;
    e.preventDefault();
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY, winX: x, winY: y };

    const onMove = (ev: MouseEvent) => {
      if (!isDragging.current) return;
      const nx = dragStart.current.winX + ev.clientX - dragStart.current.x;
      const ny = Math.max(28, dragStart.current.winY + ev.clientY - dragStart.current.y);
      moveWindow(id, nx, ny);
    };
    const onUp = () => {
      isDragging.current = false;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [id, x, y, maximized, moveWindow]);

  const handleResizeMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    isResizing.current = true;
    resizeStart.current = { x: e.clientX, y: e.clientY, w: width, h: height };

    const onMove = (ev: MouseEvent) => {
      if (!isResizing.current) return;
      const nw = Math.max(480, resizeStart.current.w + ev.clientX - resizeStart.current.x);
      const nh = Math.max(320, resizeStart.current.h + ev.clientY - resizeStart.current.y);
      resizeWindow(id, nw, nh);
    };
    const onUp = () => {
      isResizing.current = false;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [id, width, height, resizeWindow]);

  const style: React.CSSProperties = maximized
    ? { position: 'fixed', left: 0, top: 28, right: 0, bottom: 0, width: '100%', height: 'calc(100% - 28px)', zIndex, borderRadius: 0 }
    : { position: 'fixed', left: x, top: y, width, height, zIndex };

  /* Determine animation class */
  let animClass = '';
  if (animatingIn)  animClass = 'window--scale-in';
  if (animatingOut) animClass = 'window--scale-out';

  return (
    <div
      className={`window ${animClass}`}
      style={style}
      onMouseDown={onFocus}
    >
      {/* Title bar */}
      <div className="window-titlebar" onMouseDown={handleTitleBarMouseDown}>
        <div className="window-controls">
          <button
            className="window-btn window-btn-close"
            onClick={e => { e.stopPropagation(); onClose(); }}
            aria-label="Close"
          />
          <button
            className="window-btn window-btn-minimize"
            onClick={e => { e.stopPropagation(); onMinimize(); }}
            aria-label="Minimize"
          />
          <button
            className="window-btn window-btn-maximize"
            onClick={e => { e.stopPropagation(); onMaximize(); }}
            aria-label="Maximize"
          />
        </div>
        <span className="window-title">{title}</span>
      </div>

      {/* Content */}
      <div className="window-content">
        {children}
      </div>

      {/* Resize handle */}
      {!maximized && (
        <div className="window-resize-handle" onMouseDown={handleResizeMouseDown} />
      )}
    </div>
  );
}
