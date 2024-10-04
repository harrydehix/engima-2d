import { ArcherContainer, ArcherElement } from "react-archer";
import styles from "./Breadboard.module.css";
import { useEffect, useMemo } from "react";

type BreadboardProps = {
    mapping: number[];
    activeMappings: number[];
};

export default function Breadboard(props: BreadboardProps) {
    console.log(props.mapping);
    return (
        <ArcherContainer
            className={styles.container}
            lineStyle="straight"
            endMarker={false}
        >
            <div className={styles.breadboard}>
                <div className={styles.bubbles}>
                    {props.mapping.map((target_index, source_index) => {
                        const isActiveMapping =
                            props.activeMappings.includes(source_index) ||
                            props.activeMappings.includes(target_index);
                        return (
                            <div
                                key={source_index}
                                className={styles.bubbleContainer}
                            >
                                <div className={styles.bubbleLabel}>
                                    {String.fromCharCode(source_index + 65)}
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "flex-start",
                                        alignItems: "flex-start",
                                        alignContent: "flex-start",
                                        marginTop: "1.3rem",
                                    }}
                                >
                                    <div
                                        style={{
                                            height: "1rem",
                                            width: "0.13rem",
                                            background: isActiveMapping
                                                ? "white"
                                                : "rgba(255, 255, 255, 0.15)",
                                        }}
                                    ></div>
                                    {props.mapping.map((_, index) => {
                                        const connectionLevel = Math.min(
                                            target_index,
                                            source_index
                                        );
                                        const relations: any[] = [];
                                        if (index === connectionLevel) {
                                            relations.push({
                                                targetId: `point_${target_index}_${index}`,
                                                targetAnchor: "top",
                                                sourceAnchor: "top",
                                                style: {
                                                    strokeColor: isActiveMapping
                                                        ? "white"
                                                        : "rgba(255, 255, 255, 0.15)",
                                                },
                                            });
                                        }
                                        return (
                                            <ArcherElement
                                                id={`point_${source_index}_${index}`}
                                                relations={relations}
                                            >
                                                <div
                                                    style={{
                                                        height: "0.42rem",
                                                        width: "0.13rem",
                                                        background:
                                                            connectionLevel <=
                                                            index
                                                                ? "transparent"
                                                                : isActiveMapping
                                                                ? "white"
                                                                : "rgba(255, 255, 255, 0.15)",
                                                    }}
                                                ></div>
                                            </ArcherElement>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </ArcherContainer>
    );
}
