import { useState, useEffect } from 'react';

import styles from './Message.module.css';

function Message({ type, text }) {
    const [visible, setVisible] = useState(false);

    // Show the message when text is provided
    useEffect(() => {
        if(!text){
            setVisible(false);
            return;
        }
        setVisible(true);

        // Hide the message after 3 seconds
        const timer = setTimeout(() => {
            setVisible(false);
        }, 3000); // Hide after 3 seconds

        // Cleanup the timer on unmount or when text changes
        return () => clearTimeout(timer);
    }, [text]);

    return (
        <>
            {visible && <div className={`${styles.message} ${styles[type]}`}>{text}</div>}
        </>
        
    )
}

export default Message;