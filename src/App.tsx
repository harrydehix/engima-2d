import React, { useState } from "react";
import "./App.css";
import Rotor from "./components/rotor/Rotor";

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

    console.log(mapping);

    return mapping;
}

function App() {
    const [rotor1Mapping, setRotor1Mapping] = useState(generateRandomMapping());
    const [rotor2Mapping, setRotor2Mapping] = useState(generateRandomMapping());
    const [rotor3Mapping, setRotor3Mapping] = useState(generateRandomMapping());

    return (
        <div>
            <Rotor mapping={rotor1Mapping}></Rotor>
        </div>
    );
}

export default App;
