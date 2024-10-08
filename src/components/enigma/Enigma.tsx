import { useEffect, useMemo, useState } from "react";
import Rotor from "../rotor/Rotor";
import Relector from "../reflector/Reflector";
import styles from "./Enigma.module.css";
import { RotorStepSelector } from "../rotorStepSelector/RotorStepSelector";
import Breadboard from "../breadboard/Breadboard";
import { ArcherContainer } from "react-archer";
import Input from "../input/Input";
import Output from "../output/Output";

function revertMapping(array: number[]) {
    const result = [];
    for (let i = 0; i < array.length; i++) {
        result[array[i]] = i;
    }
    return result;
}

function generateBreadboardMapping(): number[] {
    const mapping: number[] = [];
    let availableIndices = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        20, 21, 22, 23, 24, 25,
    ];

    // Choose 10 mappings
    for (let i = 0; i < 10; i++) {
        let firstIndex =
            availableIndices[
                Math.floor(Math.random() * availableIndices.length)
            ];
        availableIndices = availableIndices.filter((val) => val !== firstIndex);

        let secondIndex =
            availableIndices[
                Math.floor(Math.random() * availableIndices.length)
            ];
        availableIndices = availableIndices.filter(
            (val) => val !== secondIndex
        );

        mapping[firstIndex] = secondIndex;
        mapping[secondIndex] = firstIndex;
    }

    for (let i = 0; i < 26; i++) {
        if (mapping[i] === undefined) mapping[i] = i;
    }
    return mapping;
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
        generateBreadboardMapping()
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
        const breadboardToRotor1 = breadboardMapping[props.pressedKey];
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
        const output = revertMapping(breadboardMapping)[rotor1ToBreadboard];

        return {
            rotor1: [breadboardToRotor1, rotor1ToBreadboard],
            rotor2: [rotor1ToRotor2, rotor2ToRotor1],
            rotor3: [rotor2ToRotor3, rotor3ToRotor2],
            reflector: [rotor3ToReflector],
            breadboard: {
                inputLetter: props.pressedKey,
                letterFromRotor1: rotor1ToBreadboard
            },
            output,
        };
    }, [
        props.pressedKey,
        rotor1ActualMapping,
        rotor2ActualMapping,
        rotor3ActualMapping,
    ]);

    return (
        <ArcherContainer lineStyle="straight"
        endMarker={false}>
        <table className={styles.table}>
            <tr>
                <td></td>
                <td>
                    <Input pressedKey={props.pressedKey} />
                </td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td>
                    <Output outputKey={activeMappings.output} />
                </td>
                <td></td>
                <td>
                    <Rotor
                        mapping={rotor1ActualMapping}
                        activeMappings={activeMappings.rotor1}
                        rotorId={1}
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
                        rotorId={2}
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
                        rotorId={3}
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
            </tr>
            <tr>
                <td></td>
                <td>
                    <Breadboard
                        mapping={breadboardMapping}
                        inputLetter={activeMappings.breadboard.inputLetter}
                        letterFromRotor1={activeMappings.breadboard.letterFromRotor1}
                    />
                </td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        </table>
        </ArcherContainer>
    );
}
