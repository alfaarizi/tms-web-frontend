import { CanvasSyncLevel } from 'resources/instructor/CanvasSyncLevel';

export interface CanvasSetupData {
    canvasCourse: number;
    canvasSection: number;
    syncLevel: CanvasSyncLevel[];
}
