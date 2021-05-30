import { useState, useEffect } from "react";

import { ExecutionStep } from "jugs-task-package/dist/ActionExecutor";
import { ActionsIterator } from "jugs-task-package/dist/types/AbstractSolver";
import InputParams from "jugs-task-package/dist/types/InputParams";
import { IExecutionState } from "../visualization/VisLoop";

export interface IActionsLogProps {
    stepDuration: number,
    params: InputParams;
    actionsLength: number;
    actionsIterator: ActionsIterator;
    onStateChange: (state: IExecutionState) => void;
    onStepDurationChange: (stepDuration: number) => void;
}

function usePlayer(props: IActionsLogProps, stepDuration: number, executionSteps: ExecutionStep[]) {
    const [playState, setPlayState] = useState<'play' | 'pause'>('pause');
    const [playPosition, setPlayPosition] = useState(0);

    useEffect(() => {
        props.onStateChange({
            params: props.params,
            type: 'state',
            ...(!executionSteps[playPosition - 1] ? {
                action: 'fX', state: { x: 0, y: 0 },
            } : executionSteps[playPosition - 1]),
        });
    }, [playPosition, props.params, executionSteps]);

    useEffect(() => {
        let timeout: any = null;
        if (playState === 'play') {
            if (playPosition >= props.actionsLength) {
                timeout = setTimeout(() => {
                    setPlayState('pause');
                }, 1000);
            } else {
                timeout = setTimeout(() => {
                    setPlayPosition(playPosition + 1);
                }, stepDuration);
            }
        }
        return () => {
            if (timeout) {
                clearTimeout(timeout);
            }
        }
    }, [playPosition, playState]);

    const play = () => {
        if (playPosition >= props.actionsLength) {
            setPlayPosition(0);
        }
        setPlayState('play');
    }

    const pause = () => {
        setPlayState('pause')
    }

    const stop = () => {
        setPlayState('pause');
        setPlayPosition(0);
    }

    const replay = () => {
        setPlayPosition(0);
        setPlayState('play');
    }

    return { replay, play, pause, stop, playState, playPosition, setPlayPosition };
}

export default usePlayer;