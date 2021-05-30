import { CSSProperties } from "react";

import classNames from "classnames";

import { ExecutionStep } from "jugs-task-package/dist/ActionExecutor";
import InputParams from "jugs-task-package/dist/types/InputParams";
import JugAction from "jugs-task-package/dist/types/JugAction";

interface IActionRowProps {
    style: CSSProperties;
    index: number;
    step: ExecutionStep | null;
    actionsLength: number;
    params: InputParams;

    playPosition: number;
    setPlayPosition: (v: number) => void;
}

function actionText(action: JugAction) {
    return {
        'fX': 'Fill X',
        'fY': 'Fill Y',
        'eX': 'Empty X',
        'eY': 'Empty Y',
        'X2Y': 'Transfer X to Y',
        'Y2X': 'Transfer Y to X',
    }[action];
}

export default function ActionRow(props: IActionRowProps) {
    const e = props.step;
    const isLast = props.index === props.actionsLength;
    const isFinal = (isX: boolean) => e ? { final: isLast && (isX ? e.state.x : e.state.y) === props.params.Z } : void 0;
    return (
        <div
            key={props.index}
            style={props.style}
            className={classNames("el-row", { active: props.playPosition === props.index })}
            onClick={() => props.setPlayPosition(props.index)}
        >
            <div className="el-name">{e ? actionText(e.action) : 'Start'}</div>
            <div className={classNames('el-x el-state', isFinal(true))}>{e ? e.state.x : 0}</div>
            <div className={classNames('el-y el-state', isFinal(false))}>{e ? e.state.y : 0}</div>
        </div>
    );
}