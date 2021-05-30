import { useEffect, useState } from 'react';
import { Button, Intent, NumericInput } from '@blueprintjs/core';

import AbstractSolver, { ActionsIterator } from 'jugs-task-package/dist/types/AbstractSolver';
import InputParams from 'jugs-task-package/dist/types/InputParams';
import Visualization from './visualization';

import './App.scss';
import { solversMap, SolverType } from 'jugs-task-package/dist/utils/fetchSolution';
import ActionsLog from './ActionsLog';
import { IExecutionState } from './visualization/VisLoop';
import randomBetween from 'jugs-task-package/dist/utils/randomBetween';

function Header({ onUpdate }: { onUpdate: (params: InputParams ) => void }) {
    const [ X, setX ] = useState(2);
    const [ Y, setY ] = useState(10);
    const [ Z, setZ ] = useState(4);

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

function App() {
    const [ solverType, setSolverType ] = useState<SolverType>('fast');
    const [ params, setParams ] = useState({ X: 2, Y: 10, Z: 4 });
    const [ actionsIterator, setActionsIterator ] = useState<ActionsIterator | null>(null);
    const [ actionsLength, setActionsLength ] = useState(0);
    const [ stepDuration, setStepDuration ] = useState(50);
    const [ executionState, setExecutionState ] = useState<IExecutionState>({
        params,
        type: 'state',
        action: 'fX',
        state: { x: 0, y: 0 }
    });

    useEffect(() => {
        (async () => {
            const SolverClass = solversMap[solverType];
            const solver: AbstractSolver<any> = new SolverClass();
            const solution = await solver.getBestSolutionFromServer(params);
            setActionsLength(solver.getSolutionLength(solution));
            setActionsIterator(solver.iterateActions(solution));
        })();
    }, [params]);

    return (
        <div className="app">
            <Header onUpdate={setParams} />
            <div className="app-body">
                {actionsIterator ? (
                    <>
                        <Visualization
                            executionState={executionState}
                        />
                        <ActionsLog
                            actionsLength={actionsLength}
                            actionsIterator={actionsIterator}
                            params={params}
                            onStateChange={setExecutionState}
                            stepDuration={stepDuration}
                            onStepDurationChange={setStepDuration}
                        />
                    </>
                ) : (
                    <div>
                        Press "Solve" to get a solution
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
