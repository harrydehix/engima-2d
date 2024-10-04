import styles from "./RotorStepSelector.module.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

type RotorStepSelectorProps = {
    setRotorInitialOffset: (val: number) => void;
    rotorStep: number;
    rotorInitialOffset: number;
};

export function RotorStepSelector(props: RotorStepSelectorProps) {
    function decrease() {
        let newOffset = props.rotorInitialOffset - 1;
        if (newOffset < 0) newOffset = 25;
        props.setRotorInitialOffset(newOffset);
    }

    function increase() {
        let newOffset = (props.rotorInitialOffset + 1) % 26;
        props.setRotorInitialOffset(newOffset);
    }
    return (
        <div className={styles.container}>
            <button className={styles.leftButton} onClick={decrease}>
                <FaChevronLeft color="white" />
            </button>
            <div className={styles.step}>{props.rotorStep}</div>
            <button className={styles.rightButton} onClick={increase}>
                <FaChevronRight color="white" />
            </button>
        </div>
    );
}
