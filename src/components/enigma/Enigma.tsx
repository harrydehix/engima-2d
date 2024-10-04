import { useEffect, useMemo, useState } from "react";
import Rotor from "../rotor/Rotor";
import Relector from "../reflector/Reflector";
import styles from "./Enigma.module.css";
import { RotorStepSelector } from "../rotorStepSelector/RotorStepSelector";
import Breadboard from "../breadboard/Breadboard";
import { Matrix } from "../matrix/Matrix";

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

    steps = steps % array.length;
    for (let i = 0; i < array.length; i++) {
        let sourceIndex = (i - steps) % array.length;
        if (sourceIndex < 0) {
            sourceIndex = array.length + sourceIndex;
        }

        const shift = -sourceIndex + i;
        arrayCopy[i] = (array[sourceIndex] + shift) % array.length;
        if (arrayCopy[i] < 0) {
            arrayCopy[i] = array.length + arrayCopy[i];
        }
    }
    console.log(`Steps: ${steps} => ${arrayCopy}`);
    return arrayCopy;
}

export default function Enigma(props: RotorsProps) {
    // Mappings
    const [breadboardMapping, setBreadboardMapping] = useState(
        generateRandomPairMapping()
    );
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

    // Initial offset (configuration)
    const [rotor1InitialOffset, setRotor1InitialOffset] = useState(0);
    const [rotor2InitialOffset, setRotor2InitialOffset] = useState(0);
    const [rotor3InitialOffset, setRotor3InitialOffset] = useState(0);

    // Current simulated step
    const rotor1Step = useMemo(() => {
        const step = (props.step + rotor1InitialOffset) % 26;
        setRotor1ActualMapping(shiftArrayInCircle(rotor1Mapping, step));
        return step;
    }, [props.step, rotor1InitialOffset]);
    const rotor2Step = useMemo(() => {
        const step =
            (Math.floor((props.step + rotor1InitialOffset) / 26) +
                rotor2InitialOffset) %
            26;
        setRotor2ActualMapping(shiftArrayInCircle(rotor2Mapping, step));
        return step;
    }, [props.step, rotor2InitialOffset]);
    const rotor3Step = useMemo(() => {
        const step =
            (Math.floor(
                (props.step + rotor1InitialOffset + 26 * rotor2InitialOffset) /
                    26 ** 2
            ) +
                rotor3InitialOffset) %
            26;
        setRotor3ActualMapping(shiftArrayInCircle(rotor3Mapping, step));
        return step;
    }, [props.step, rotor3InitialOffset]);

    // Active paths (turn white)
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
        <table className={styles.table}>
            <td style={{ background: "red" }}>
                <Matrix
                    activeInput={props.pressedKey}
                    activeOutput={3}
                    activeBreadboardToRotors={[2, 4]}
                />
                <Breadboard mapping={breadboardMapping} activeMappings={[]} />
            </td>
            <td>
                <Rotor
                    mapping={rotor1ActualMapping}
                    activeMappings={activeMappings.rotor1}
                />
                <RotorStepSelector
                    rotorStep={rotor1Step}
                    setRotorInitialOffset={setRotor1InitialOffset}
                    rotorInitialOffset={rotor1InitialOffset}
                />
            </td>
            <td>
                <Rotor
                    mapping={rotor2ActualMapping}
                    activeMappings={activeMappings.rotor2}
                />
                <RotorStepSelector
                    rotorStep={rotor2Step}
                    setRotorInitialOffset={setRotor2InitialOffset}
                    rotorInitialOffset={rotor2InitialOffset}
                />
            </td>
            <td>
                <Rotor
                    mapping={rotor3ActualMapping}
                    activeMappings={activeMappings.rotor3}
                />
                <RotorStepSelector
                    rotorStep={rotor3Step}
                    setRotorInitialOffset={setRotor3InitialOffset}
                    rotorInitialOffset={rotor3InitialOffset}
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
