import React, { useEffect, useState } from "react";
import "./App.css";
import Rotor from "./components/rotor/Rotor";
import { Rotors } from "./components/rotors/Rotors";

function letterToNumber(letter: string) {
    return letter.charCodeAt(0) - 97;
}

function App() {
    const [step, setState] = useState(0);
    const [pressedKey, setPressedKey] = useState("");

    function nextStep() {
        setState((state) => state + 1);
    }

    useEffect(() => {
        document.addEventListener("keydown", (e: KeyboardEvent) => {
            if (
                [
                    "a",
                    "b",
                    "c",
                    "d",
                    "e",
                    "f",
                    "g",
                    "h",
                    "i",
                    "j",
                    "k",
                    "l",
                    "m",
                    "n",
                    "o",
                    "p",
                    "q",
                    "r",
                    "s",
                    "t",
                    "u",
                    "v",
                    "w",
                    "x",
                    "y",
                    "z",
                ].includes(e.key)
            ) {
                setPressedKey(e.key);
                nextStep();
            }
        });
    }, []);
    return (
        <div className="main" onKeyDown={(event) => setPressedKey(event.key)}>
            <Rotors pressedKey={letterToNumber(pressedKey)} step={step} />
        </div>
    );
}

export default App;
