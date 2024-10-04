import React, { useEffect, useState } from "react";
import "./App.css";
import Enigma from "./components/enigma/Enigma";
import { letterToNumber } from "./utils/utils";

function App() {
    const [step, setStep] = useState(0);
    const [pressedKey, setPressedKey] = useState("");

    function nextStep() {
        setStep((step) => step + 1);
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
                console.log("Pressed key!");
                setPressedKey(e.key);
                nextStep();
            }
        });
    }, []);
    return (
        <div className="main" onKeyDown={(event) => setPressedKey(event.key)}>
            <Enigma pressedKey={letterToNumber(pressedKey)} step={step} />
        </div>
    );
}

export default App;
