import React, { useEffect, useRef, useState } from "react";
import { Button, ButtonGroup, Intent, Slider } from "@blueprintjs/core";

import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List } from 'react-window';

import ActionExecutor, { ExecutionStep } from "jugs-task-package/dist/ActionExecutor";

import usePlayer, { IActionsLogProps } from "./usePlayer";
import ActionRow from "./ActionRow";

import './style.scss';

function ActionsLog(props: IActionsLogProps) {
    const listRef = useRef<List<ExecutionStep>>(null);
    const { stepDuration, params, actionsLength, actionsIterator, onStepDurationChange } = props;
    const [ executionSteps, setExecutionSteps ] = useState<ExecutionStep[]>([]);
    const { replay, play, pause, stop, playState, playPosition, setPlayPosition } = usePlayer(props, stepDuration, executionSteps);

    useEffect(() => executionSteps.length ? replay() : stop(), [executionSteps]); // stop when no solution

    useEffect(() => {
        const actionExecutor = new ActionExecutor(params);
        setExecutionSteps([...actionExecutor.executionIterator(actionsIterator)]);
    }, [params, actionsLength, actionsIterator]);

    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollToItem(playPosition, 'center');
        }
    }, [playPosition]);

    if (!executionSteps.length) {
        return (
            <div className="actions-log no-solution">
                No solution for this params
            </div>
        );
    }

    return (
        <div className="actions-log">
            <div className="log-block">
                <ButtonGroup>
                    <Button icon="play" disabled={playState === 'play'} intent={Intent.PRIMARY} onClick={play}>Play</Button>
                    <Button icon="pause" disabled={playState === 'pause'} intent={Intent.WARNING} onClick={pause}>Pause</Button>
                    <Button icon="stop" disabled={playState === 'pause' && (playPosition === 0 || playPosition === actionsLength)} intent={Intent.DANGER} onClick={stop}>Stop</Button>
                </ButtonGroup>
            </div>
            <div className="log-block step-duration-block">
                <div style={{ textAlign: 'center', marginBottom: 10 }}>Action duration:</div>
                <Slider
                    max={5000}
                    min={20}
                    labelValues={[20, 1000, 2000, 3000, 4000, 5000]}
                    value={stepDuration}
                    onChange={onStepDurationChange}
                />
            </div>
            <div className="execution-log">
                <div className="el-head">
                    <div className="el-name">Name</div>
                    <div className="el-x el-state">X</div>
                    <div className="el-y el-state">Y</div>
                </div>
                <div className="el-body">
                    <AutoSizer>
                        {({ width, height }) => (
                            <List
                                ref={listRef}
                                width={width}
                                height={height}
                                itemSize={30}
                                itemCount={actionsLength + 1}
                            >
                                {({ data, index, style }) => {
                                    return (
                                        <ActionRow
                                            style={style}
                                            index={index}
                                            step={index ? executionSteps[index - 1] : null}
                                            actionsLength={actionsLength}
                                            params={params}

                                            playPosition={playPosition}
                                            setPlayPosition={setPlayPosition}
                                        />
                                    );
                                }}
                            </List>
                        )}
                    </AutoSizer>
                </div>
            </div>
        </div>
    )
}

export default ActionsLog;