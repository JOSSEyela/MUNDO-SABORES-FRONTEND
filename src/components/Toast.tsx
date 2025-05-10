import React, { useEffect } from 'react';
import styles from '../styles/Toast.module.css';

interface ToastProps {
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`${styles.toast} ${styles[type]}`}>
            {message}
        </div>
    );
};

export const ToastContainer: React.FC<{ toasts: ToastProps[] }> = ({ toasts }) => (
    <div className={styles.toastContainer}>
        {toasts.map((toast, index) => (
            <Toast key={index} {...toast} />
        ))}
    </div>
);