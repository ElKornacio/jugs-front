import React, { useState } from "react";

import { Button, Intent, NumericInput } from "@blueprintjs/core";

import InputParams from "jugs-task-package/dist/types/InputParams";
import randomBetween from "jugs-task-package/dist/utils/randomBetween";

import './style.scss';

export default function Header({ onUpdate }: { onUpdate: (params: InputParams) => void }) {
    const [X, setX] = useState(2);
    const [Y, setY] = useState(10);
    const [Z, setZ] = useState(4);

    return (
        <div className="header">
            <Button
                intent={Intent.NONE}
                className="generate-btn"
                onClick={() => {
                    const X = randomBetween(20, 5000);
                    const Y = randomBetween(20, 5000);
                    const Z = randomBetween(1, Math.min(X, Y));
                    setX(X);
                    setY(Y);
                    setZ(Z);
                    onUpdate({ X, Y, Z })
                }}
                icon="random"
            >
                Random
            </Button>
            <NumericInput className="param-input" placeholder="X" value={X} onValueChange={v => setX(v)} />
            <NumericInput className="param-input" placeholder="Y" value={Y} onValueChange={v => setY(v)} />
            <NumericInput className="param-input" placeholder="Z" value={Z} onValueChange={v => setZ(v)} />
            <Button
                intent={Intent.PRIMARY}
                className="solve-btn"
                onClick={() => onUpdate({ X, Y, Z })}
                icon="cog"
            >
                Solve
            </Button>
        </div>
    )
}