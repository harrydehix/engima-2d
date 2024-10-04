import styles from "./Matrix.module.css";

type MatrixProps = {
    activeInput: number;
    activeOutput: number;
    activeBreadboardToRotors: [number, number];
};

const array: number[] = [];
for (let i = 0; i < 26; i++) array[i] = i;

export function Matrix(props: MatrixProps) {
    return (
        <div className={styles.matrix}>
            <div className={styles.rows}>
                {array.map((index) => {
                    const activeOutputLine = index === props.activeOutput;
                    return (
                        <div className={styles.row}>
                            {array.map((inner_index) => (
                                <div
                                    style={{
                                        height: "0.13rem",
                                        width: ".8rem",
                                        background: activeOutputLine
                                            ? "white"
                                            : inner_index % 2 == 0
                                            ? "grey"
                                            : "blue",
                                    }}
                                ></div>
                            ))}
                        </div>
                    );
                })}
            </div>
            {
                <div className={styles.columns}>
                    {array.map((index) => {
                        const activeInputLine = index === props.activeInput;
                        return (
                            <div className={styles.column}>
                                {array.map((inner_index) => (
                                    <div
                                        style={{
                                            width: "0.13rem",
                                            height: "1.026rem",
                                            background: activeInputLine
                                                ? "white"
                                                : inner_index % 2 != 0
                                                ? "grey"
                                                : "blue",
                                        }}
                                    ></div>
                                ))}
                            </div>
                        );
                    })}
                </div>
            }
        </div>
    );
}
