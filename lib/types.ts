export interface ChainContextBase {
  currentTaskId?: string | number;
  prevTaskId?: string | number;
  prevTaskOutput?: any;
  results: Record<string | number, any>;
  isRunning: boolean;
  errors: Array<{ taskId: string | number; taskName: string; error: any }>;

  getResult(taskId: string | number): any;
  setResult(taskId: string | number, output: any): void;
  getCurrentTaskId(): string | number | undefined;
  getPrevTaskOutput(): any;
  addError(taskId: string | number, taskName: string, error: any): void;
}

export type TaskComponent<U> = React.FC<{
  context: U;
  onResolve: (output?: any) => void;
  onReject: (error: any) => void;
}>;

export interface TaskItem<U> {
  taskId: string | number;
  taskName: string;
  taskComponent: TaskComponent<U>;
}

export interface WorkflowNode<U> {
  nodeId: string | number;
  nodeName: string;
  taskComponent: TaskComponent<U>;
}

export interface WorkflowEdge<U> {
  from: string | number;
  to: string | number;
  condition?: (context: U) => boolean;
}

export interface WorkflowDefinition {
  startNodeId: string | number;
  nodes: Array<{
    nodeId: string | number;
    nodeName: string;
    componentName: string;
  }>;
  edges: Array<{
    from: string | number;
    to: string | number;
    condition?: string;
  }>;
}