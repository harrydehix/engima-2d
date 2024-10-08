import { ArcherContainer, ArcherElement } from "react-archer";
import styles from "./Rotor.module.css";
import { useEffect, useMemo } from "react";

type RotorProps = {
    mapping: number[];
    activeMappings: number[];
    rotorId: number;
};

export default function Rotor(props: RotorProps) {
    return (
            <div className={styles.rotor}>
                <div className={styles.leftBubbles}>
                    {props.mapping.map((val, index) => (
                        <div key={index} className={styles.leftBubbleContainer}>
                            <ArcherElement id={`bubble_left_left_${index}_rotor_${props.rotorId}`}>
                                <div></div>
                            </ArcherElement>
                            <div className={styles.bubbleLabel}>
                                {String.fromCharCode(index + 65)}
                            </div>
                            <ArcherElement
                                id={`bubble_left_${index}_rotor_${props.rotorId}`}
                                relations={[
                                    {
                                        targetId: `bubble_right_${val}_rotor_${props.rotorId}`,
                                        targetAnchor: "left",
                                        sourceAnchor: "right",
                                        style: {
                                            strokeColor:
                                                props.activeMappings.includes(
                                                    index
                                                )
                                                    ? "white"
                                                    : "rgba(255, 255, 255, 0.1)",
                                        },
                                    },
                                ]}
                            >
                                <div className={styles.bubble}></div>
                            </ArcherElement>
                        </div>
                    ))}
                </div>
                <div className={styles.rightBubbles}>
                    {props.mapping.map((target_index, source_index) => (
                        <div
                            key={source_index}
                            className={styles.rightBubbleContainer}
                        >
                            <ArcherElement id={`bubble_right_${source_index}_rotor_${props.rotorId}`}>
                                <div className={styles.bubble}></div>
                            </ArcherElement>
                            <div className={styles.bubbleLabel}>
                                {String.fromCharCode(source_index + 65)}
                            </div>
                            <div
                                style={{
                                    position: "absolute",
                                    left: "2.6rem",
                                    width: "2.3rem",
                                    height: ".13rem",
                                    background: props.activeMappings
                                        .map((input) => props.mapping[input])
                                        .includes(source_index)
                                        ? "white"
                                        : "rgba(255, 255, 255, 0.1)",
                                }}
                            ></div>
                        </div>
                    ))}
                </div>
            </div>
    );
}
