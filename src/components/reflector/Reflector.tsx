import { ArcherContainer, ArcherElement } from "react-archer";
import styles from "./Reflector.module.css";
import { useEffect, useMemo } from "react";

type ReflectorProps = {
    mapping: number[];
    activeMappings: number[];
};

export default function Relector(props: ReflectorProps) {
    console.log(props.mapping);
    return (
        <ArcherContainer
            className={styles.container}
            lineStyle="straight"
            endMarker={false}
        >
            <div className={styles.reflector}>
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
                                        flexDirection: "row",
                                        justifyContent: "flex-start",
                                        alignItems: "flex-start",
                                        alignContent: "flex-start",
                                        marginLeft: "1.3rem",
                                    }}
                                >
                                    <div
                                        style={{
                                            width: "1rem",
                                            height: "0.13rem",
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
                                                targetAnchor: "left",
                                                sourceAnchor: "left",
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
                                                        width: "0.92rem",
                                                        height: "0.13rem",
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
