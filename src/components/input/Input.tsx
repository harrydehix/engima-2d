import { ArcherContainer, ArcherElement } from "react-archer";
import styles from "./Input.module.css";
import { useEffect, useMemo } from "react";
import { numberToLetter } from "../../utils/utils";

type InputProps = {
    pressedKey: number
};

export default function Input(props: InputProps) {
    return (
        <div className={styles.input}>
            <div className={styles.pressedKey}>
                {numberToLetter(props.pressedKey)}
            </div>
            <div className={styles.bubbles}>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25].map(
                    (letter_number) => {
                        const relations: any[] = [];
                        if(letter_number === props.pressedKey){
                            relations.push({sourceAnchor: "bottom", targetAnchor: "top", targetId: `breadboard_${props.pressedKey}`, style: {
                                strokeColor: "white", endShape: {
                                    arrow: {
                                      arrowLength: 10,
                                      arrowThickness: 20
                                    }
                                  }, }});
                        }
                        return (
                            <div
                                key={letter_number}
                                className={styles.bubbleContainer}
                            >
                                <div className={styles.bubbleLabel}>
                                    {String.fromCharCode(letter_number + 65)}
                                </div>
                                <ArcherElement id={`input_${letter_number}`} relations={relations}>
                                    <div></div>
                                </ArcherElement>
                            </div>
                        );
                    }
                )}
            </div>
        </div>
    );
}
