import { autobind } from "core-decorators";
import { ActionsIterator } from "jugs-task-package/dist/types/AbstractSolver";
import InputParams from "jugs-task-package/dist/types/InputParams";
import JugAction from "jugs-task-package/dist/types/JugAction";
import JugsState from "jugs-task-package/dist/types/JugsState";
import safeNull from "jugs-task-package/dist/utils/safeNull";

export interface IDimensions {
    readonly width: number;
    readonly height: number;
}

export interface IExecutionState {
    params: InputParams;
    type: 'action' | 'state';
    action: JugAction;
    state: JugsState;
}

export default class VisLoop {

    private isStopped: boolean = true;
    private readonly canvas: HTMLCanvasElement;
    private size: IDimensions;
    private readonly ctx: CanvasRenderingContext2D;
    private executionState: IExecutionState;

    private bucketPath: Path2D = new Path2D('M213.14 250.752L246.332 0H0L33.1916 250.752C33.9384 256.396 36.3446 261.537 39.9771 265.249C43.6096 268.96 48.2302 271 53.0076 271H193.324C198.102 271 202.722 268.96 206.355 265.249C209.987 261.537 212.394 256.396 213.14 250.752ZM11.4109 10L43.1051 249.44C43.5972 253.159 45.1507 256.238 47.124 258.254C49.0567 260.229 51.1685 261 53.008 261H193.324C195.164 261 197.275 260.229 199.208 258.254C201.181 256.238 202.735 253.159 203.227 249.44L234.921 10H11.4109Z');
    private waterPath: Path2D = new Path2D('M5 4L36.7994 247.35C37.515 252.828 39.8201 257.816 43.3003 261.418C46.7805 265.021 51.2072 267 55.7842 267H190.216C194.793 267 199.22 265.021 202.7 261.418C206.18 257.816 208.485 252.828 209.201 247.35L241 4H5Z');

    constructor(canvas: HTMLCanvasElement, size: IDimensions, initiailExecutionState: IExecutionState) {
        this.canvas = canvas;
        this.size = size;
        this.ctx = safeNull(canvas.getContext('2d'));
        this.executionState = initiailExecutionState;
    }

    setExecutionState(executionState: IExecutionState) {
        this.executionState = executionState;
    }

    setSize(size: IDimensions) {
        this.size = size;
    }

    start() {
        this.isStopped = false;
        this.loop();
    }

    stop() {
        this.isStopped = true;
    }

    @autobind
    loop() {
        this.render();

        if (!this.isStopped) {
            requestAnimationFrame(this.loop)
        }
    }

    drawBucket(x: number, y: number, size: number, fill: number) {
        const ctx = this.ctx;

        const w = 247;
        const h = 270;

        size = 0.3 + 0.7 * size;
        
        ctx.save();
        ctx.translate(x - w / 2 * size, y - h * size);
        ctx.scale(size, size);
        ctx.fillStyle = '#16D0DC';
        ctx.fill(this.waterPath, 'evenodd');

        ctx.clearRect(0, 0, w, h * (1 - (0.05 + fill * 0.915)));
        ctx.restore();

        ctx.save();
        ctx.translate(x - w / 2 * size, y - h * size);
        ctx.scale(size, size);
        ctx.fillStyle = 'black';
        ctx.fill(this.bucketPath, 'evenodd');
        ctx.restore();
    }

    render() {
        const ctx = this.ctx;

        ctx.clearRect(0, 0, this.size.width, this.size.height);

        ctx.save();
        ctx.translate(0, 0);
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, this.size.width, this.size.height);

        const maxSize = Math.max(this.executionState.params.X, this.executionState.params.Y);
        const xSize = this.executionState.params.X / maxSize;
        const ySize = this.executionState.params.Y / maxSize;
        const xFill = this.executionState.state.x / this.executionState.params.X;
        const yFill = this.executionState.state.y / this.executionState.params.Y;

        this.drawBucket(this.size.width * (3 / 9), this.size.height * (3 / 4), xSize, xFill);
        this.drawBucket(this.size.width * (6 / 9), this.size.height * (3 / 4), ySize, yFill);

        ctx.font = '50px sans-serif';
        ctx.textBaseline = 'top';
        ctx.textAlign = 'center';
        
        ctx.save();
        ctx.fillStyle = (this.executionState.state.x === this.executionState.params.Z) ? 'green' : 'black';
        if (this.executionState.state.x === this.executionState.params.Z) {
            ctx.shadowColor = 'lime';
            ctx.shadowBlur = 30;
        }
        ctx.fillText(String(this.executionState.state.x), this.size.width * (3 / 9), this.size.height * (3 / 4) + 50);
        ctx.restore();

        ctx.save();
        ctx.fillStyle = (this.executionState.state.y === this.executionState.params.Z) ? 'green' : 'black';
        if (this.executionState.state.y === this.executionState.params.Z) {
            ctx.shadowColor = 'lime';
            ctx.shadowBlur = 30;
        }
        ctx.fillText(String(this.executionState.state.y), this.size.width * (6 / 9), this.size.height * (3 / 4) + 50);
        ctx.restore();

        ctx.restore();
        
    }

}