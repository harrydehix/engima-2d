import { ArcherContainer, ArcherElement } from "react-archer";
import styles from "./Breadboard.module.css";
import { useEffect, useMemo } from "react";
import { letterToNumber } from "../../utils/utils";

type BreadboardProps = {
    mapping: number[];
    inputLetter: number;
    letterFromRotor1: number;
};

export default function Breadboard(props: BreadboardProps) {
    console.log(props.mapping);
    return (
        
            <div className={styles.breadboard}>
                <div className={styles.bubbles}>
                    {props.mapping.map((target_index, source_index) => {
                        const isActiveMapping =
                            source_index === props.inputLetter || source_index === props.letterFromRotor1 || target_index === props.inputLetter || target_index === props.letterFromRotor1;

                        const relationsToRotor1: any[] = [];
                        if(source_index === props.letterFromRotor1 || source_index === props.mapping[props.inputLetter]){
                            relationsToRotor1.push({sourceAnchor: "top", targetAnchor: "left", targetId: `bubble_left_left_${source_index}_rotor_${1}`, style: {
                                strokeColor: "white", lineStyle: "curve", endShape: {
                                    arrow: {
                                      arrowLength: 10,
                                      arrowThickness: 20
                                    }
                                  }, }}) // `bubble_left_left_${index}_rotor_${props.rotorId}`
                        }
                        return (
                            <div
                                key={source_index}
                                className={styles.bubbleContainer}
                            >
                                <ArcherElement id={`breadboard_${source_index}`} relations={relationsToRotor1}>
                                    <div></div>
                                </ArcherElement>
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
    );
}
