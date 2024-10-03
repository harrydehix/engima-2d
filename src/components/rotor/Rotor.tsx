import { ArcherContainer, ArcherElement } from "react-archer";
import styles from "./Rotor.module.css";
import { useEffect, useMemo } from "react";

type RotorProps = {
    mapping: number[];
    activeMappings: number[];
};

export default function Rotor(props: RotorProps) {
    return (
        <ArcherContainer
            className={styles.container}
            lineStyle="straight"
            offset={0}
            endMarker={false}
        >
            <div className={styles.rotor}>
                <div className={styles.leftBubbles}>
                    {props.mapping.map((val, index) => (
                        <div key={index} className={styles.leftBubbleContainer}>
                            <div className={styles.bubbleLabel}>
                                {String.fromCharCode(index + 65)}
                            </div>
                            <ArcherElement
                                id={`bubble_left_${index}`}
                                relations={[
                                    {
                                        targetId: `bubble_right_${val}`,
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
                            <ArcherElement id={`bubble_right_${source_index}`}>
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
        </ArcherContainer>
    );
}
