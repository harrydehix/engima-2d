import { useEffect, useMemo, useState } from "react";
import Rotor from "../rotor/Rotor";
import Relector from "../reflector/Reflector";
import styles from "./Rotors.module.css";

function revertMapping(array: number[]) {
    const result = [];
    for (let i = 0; i < array.length; i++) {
        result[array[i]] = i;
    }
    return result;
}

function generateRandomPairMapping(): number[] {
    const mapping: number[] = [];
    let availableIndices = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        20, 21, 22, 23, 24, 25,
    ];

    for (let i = 0; i < 26; i++) {
        if (mapping[i] !== undefined) continue;
        let chosenIndex = i;
        do {
            chosenIndex =
                availableIndices[
                    Math.floor(Math.random() * availableIndices.length)
                ];
        } while (chosenIndex === i);

        mapping[chosenIndex] = i;
        mapping[i] = chosenIndex;
        availableIndices = availableIndices.filter(
            (val) => val !== chosenIndex && val !== i
        );
    }

    return mapping;
}

function generateRandomMapping(): number[] {
    const mapping: number[] = [];
    let availableIndices = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        20, 21, 22, 23, 24, 25,
    ];

    for (let i = 0; i < 26; i++) {
        const chosenIndex =
            availableIndices[
                Math.floor(Math.random() * availableIndices.length)
            ];
        mapping[chosenIndex] = i;
        availableIndices = availableIndices.filter(
            (val) => val !== chosenIndex
        );
    }

    return mapping;
}

export type RotorsProps = {
    pressedKey: number;
    step: number;
};

function shiftArrayInCircle(array: number[], steps: number): number[] {
    const arrayCopy: number[] = [];
    for (let i = 0; i < array.length; i++) arrayCopy[i] = array[i];

    for (let i = 0; i < array.length; i++) {
        const oldIndex = (i + steps) % array.length;
        const shift = -oldIndex + i;
        arrayCopy[i] = (array[oldIndex] + shift) % array.length;
        if (arrayCopy[i] < 0) {
            arrayCopy[i] = array.length + arrayCopy[i];
        }
    }
    return arrayCopy;
}

export function Rotors(props: RotorsProps) {
    const [rotor1Mapping, setRotor1Mapping] = useState(generateRandomMapping());
    const [rotor1ActualMapping, setRotor1ActualMapping] =
        useState(rotor1Mapping);
    const [rotor2Mapping, setRotor2Mapping] = useState(generateRandomMapping());
    const [rotor2ActualMapping, setRotor2ActualMapping] =
        useState(rotor2Mapping);
    const [rotor3Mapping, setRotor3Mapping] = useState(generateRandomMapping());
    const [rotor3ActualMapping, setRotor3ActualMapping] =
        useState(rotor3Mapping);
    const [reflectorMapping, setReflectorMapping] = useState(
        generateRandomPairMapping()
    );

    const rotor1Step = useMemo(() => {
        const step = props.step % 26;
        setRotor1ActualMapping(shiftArrayInCircle(rotor1Mapping, step));
        return step;
    }, [props.step]);
    const rotor2Step = useMemo(() => {
        const step = Math.floor(props.step / 26) % 26;
        setRotor2ActualMapping(shiftArrayInCircle(rotor2Mapping, step));
        return step;
    }, [props.step]);
    const rotor3Step = useMemo(() => {
        const step = Math.floor(props.step / 26 ** 2) % 26;
        setRotor3ActualMapping(shiftArrayInCircle(rotor3Mapping, step));
        return step;
    }, [props.step]);

    const activeMappings = useMemo(() => {
        const breadboardToRotor1 = props.pressedKey;
        const rotor1ToRotor2 = rotor1ActualMapping[breadboardToRotor1];
        const rotor2ToRotor3 = rotor2ActualMapping[rotor1ToRotor2];
        const rotor3ToReflector = rotor3ActualMapping[rotor2ToRotor3];
        const reflectorToRotor3 = reflectorMapping[rotor3ToReflector];
        const rotor3ToRotor2 =
            revertMapping(rotor3ActualMapping)[reflectorToRotor3];
        const rotor2ToRotor1 =
            revertMapping(rotor2ActualMapping)[rotor3ToRotor2];
        const rotor1ToBreadboard =
            revertMapping(rotor1ActualMapping)[rotor2ToRotor1];

        return {
            rotor1: [breadboardToRotor1, rotor1ToBreadboard],
            rotor2: [rotor1ToRotor2, rotor2ToRotor1],
            rotor3: [rotor2ToRotor3, rotor3ToRotor2],
            reflector: [rotor3ToReflector],
        };
    }, [
        props.pressedKey,
        rotor1ActualMapping,
        rotor2ActualMapping,
        rotor3ActualMapping,
    ]);

    return (
        <table>
            <td>
                <Rotor
                    mapping={rotor1ActualMapping}
                    activeMappings={activeMappings.rotor1}
                />
            </td>
            <td>
                <Rotor
                    mapping={rotor2ActualMapping}
                    activeMappings={activeMappings.rotor2}
                />
            </td>
            <td>
                <Rotor
                    mapping={rotor3ActualMapping}
                    activeMappings={activeMappings.rotor3}
                />
            </td>
            <td>
                <Relector
                    activeMappings={activeMappings.reflector}
                    mapping={reflectorMapping}
                />
            </td>
        </table>
    );
}
