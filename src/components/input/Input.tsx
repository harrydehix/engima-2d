import { ArcherContainer, ArcherElement } from "react-archer";
import styles from "./Input.module.css";
import { useEffect, useMemo } from "react";

type InputProps = {};

export default function Input(props: InputProps) {
    return (
        <div className={styles.breadboard}>
            <div className={styles.bubbles}>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(
                    (target_index, source_index) => {
                        return (
                            <div
                                key={source_index}
                                className={styles.bubbleContainer}
                            >
                                <div className={styles.bubbleLabel}>
                                    {String.fromCharCode(source_index + 65)}
                                </div>
                            </div>
                        );
                    }
                )}
            </div>
        </div>
    );
}
