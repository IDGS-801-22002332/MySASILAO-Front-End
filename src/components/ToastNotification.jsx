// src/components/ToastNotification.jsx
import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import './ToastNotification.css';

const ToastNotification = ({ message, type, onClose, duration = 4000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle size={20} color="#10b981" />;
            case 'error':
                return <XCircle size={20} color="#ef4444" />;
            case 'warning':
                return <AlertCircle size={20} color="#f59e0b" />;
            default:
                return <Info size={20} color="#3b82f6" />;
        }
    };

    const getClass = () => {
        return `toast-notification toast-${type}`;
    };

    return (
        <div className={getClass()}>
            <div className="toast-icon">{getIcon()}</div>
            <div className="toast-content">
                <p className="toast-message">{message}</p>
            </div>
            <button className="toast-close" onClick={onClose}>
                <X size={16} />
            </button>
        </div>
    );
};

export const ToastContainer = ({ notifications, removeNotification }) => {
    return (
        <div className="toast-container">
            {notifications.map((notif) => (
                <ToastNotification
                    key={notif.id}
                    message={notif.message}
                    type={notif.type}
                    onClose={() => removeNotification(notif.id)}
                    duration={notif.duration}
                />
            ))}
        </div>
    );
};