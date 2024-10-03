import styles from "./Rotor.module.css";

type RotorProps = {
    mapping: number[];
};

export default function Rotor(props: RotorProps) {
    return (
        <div className={styles.rotor}>
            <div className={styles.leftBubbles}>
                {props.mapping.map((val, index) => (
                    <div key={index} className={styles.leftBubbleContainer}>
                        <div className={styles.bubbleLabel}>
                            {String.fromCharCode(index + 65)}
                        </div>
                        <div className={styles.bubble}></div>
                    </div>
                ))}
            </div>
            <div className={styles.rightBubbles}>
                {props.mapping.map((val, index) => (
                    <div key={index} className={styles.rightBubbleContainer}>
                        <div className={styles.bubble}></div>
                        <div className={styles.bubbleLabel}>
                            {String.fromCharCode(index + 65)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
