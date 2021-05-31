import React, { useEffect, useState } from 'react';

import './App.scss';

import AbstractSolver, { ActionsIterator } from 'jugs-task-package/dist/types/AbstractSolver';
import Visualization from './components/Visualization';

import { solversMap, SolverType } from 'jugs-task-package/dist/utils/fetchSolution';
import ActionsLog from './components/ActionsLog';
import { IExecutionState } from './components/Visualization/VisLoop';
import Header from './components/Header';

function App() {
    const [ solverType, setSolverType ] = useState<SolverType>('fast');
    const [ params, setParams ] = useState({ X: 2, Y: 10, Z: 4 });
    const [ actionsIterator, setActionsIterator ] = useState<ActionsIterator | null>(null);
    const [ actionsLength, setActionsLength ] = useState(0);
    const [ stepDuration, setStepDuration ] = useState(600);
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
