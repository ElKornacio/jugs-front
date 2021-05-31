import React, { useCallback, useState } from "react";

import { Alert, Button, Intent, NumericInput, Toaster } from "@blueprintjs/core";

import InputParams from "jugs-task-package/dist/types/InputParams";
import randomBetween from "jugs-task-package/dist/utils/randomBetween";

import './style.scss';

const toaster = Toaster.create({ position: "bottom" });

export default function Header({ onUpdate }: { onUpdate: (params: InputParams) => void }) {
    const [X, setX] = useState('2');
    const [Y, setY] = useState('10');
    const [Z, setZ] = useState('4');

    const onSolveClick = useCallback(() => {
        if (isNaN(Number(X)) || isNaN(Number(Y)) || isNaN(Number(Z)) || (Number(X) < 1) || (Number(Y) < 1) || (Number(Z) < 1)) {
            toaster.show({
                intent: Intent.DANGER,
                message: 'Invalid input',
            });
            return;
        }
        console.log(X, Y, Z);
        onUpdate({ X: Number(X), Y: Number(Y), Z: Number(Z) });
    }, [X, Y, Z]);

    return (
        <div className="header">
            <Button
                intent={Intent.NONE}
                className="generate-btn"
                onClick={() => {
                    const X = randomBetween(20, 5000);
                    const Y = randomBetween(20, 5000);
                    const Z = randomBetween(1, Math.min(X, Y));
                    setX(String(X));
                    setY(String(Y));
                    setZ(String(Z));
                    onUpdate({ X, Y, Z })
                }}
                icon="random"
            >
                Random
            </Button>
            <NumericInput clampValueOnBlur min={1} className="param-input" placeholder="X" value={X} onValueChange={(v, s) => setX(s)} />
            <NumericInput clampValueOnBlur min={1} className="param-input" placeholder="Y" value={Y} onValueChange={(v, s) => setY(s)} />
            <NumericInput clampValueOnBlur min={1} className="param-input" placeholder="Z" value={Z} onValueChange={(v, s) => setZ(s)} />
            <Button
                intent={Intent.PRIMARY}
                className="solve-btn"
                onClick={onSolveClick}
                icon="cog"
            >
                Solve
            </Button>
        </div>
    )
}