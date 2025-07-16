import styles from './Slider.module.css';
import { useState } from 'react';

function Slider({
    label,
    name,
    min,
    max,
    step,
    defaultValue,
    onChange
}) {
    const [value, setValue] = useState(defaultValue);

    const handleChange = (e) => {
        setValue(e.target.value);
        if (onChange) onChange(e);
    };

    return (
        <div className={styles.slider_control}>
            <label htmlFor={name} className={styles.slider_label}>{label}</label>
            <input
                type="range"
                id={name}
                name={name}
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={handleChange}
            />
            <span className={styles.slider_value}>{value} %</span>
        </div>
    );
}

export default Slider;