import { RefObject, useRef, useEffect, useState } from "react";

import VisLoop, { IDimensions, IExecutionState } from "./VisLoop";

import './style.scss';

function getDimensions(ref: HTMLElement) {
    return {
        width: ref.clientWidth,
        height: ref.clientHeight,
    };
}

function useElementResize(ref: RefObject<HTMLElement>): IDimensions {
    const [elementSize, setElementSize] = useState<IDimensions>({ width: 800, height: 600 });

    useEffect(() => {
        setElementSize(getDimensions(ref.current!));

        const handler = () => {
            setElementSize(getDimensions(ref.current!));
        };

        window.addEventListener('resize', handler);
        return () => window.removeEventListener('resize', handler);
    }, []);

    return elementSize;
}

function Visualization({ executionState }: { executionState: IExecutionState }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasSize = useElementResize(canvasRef);
    const [ visLoop, setVisLoop ] = useState<VisLoop | null>(null);

    useEffect(() => {
        const newVisLoop = new VisLoop(canvasRef.current!, canvasSize, executionState);
        newVisLoop.start();
        setVisLoop(newVisLoop);
        return () => newVisLoop.stop();
    }, []);

    useEffect(() => {
        if (!visLoop) {
            return;
        }
        visLoop.setExecutionState(executionState);
        visLoop.setSize(canvasSize);
    }, [visLoop, executionState, canvasSize]);

    return (
        <div className="visualization">
            <canvas
                ref={canvasRef}
                className="vis-canvas"
                width={canvasSize.width}
                height={canvasSize.height}
            />
        </div>
    )
}

export default Visualization;