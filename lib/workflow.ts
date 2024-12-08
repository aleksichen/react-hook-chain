// workflow.ts
import { ChainContextBase } from './types';
import { WorkflowNode, WorkflowEdge, WorkflowDefinition } from './types';

type OnWorkflowComplete = (success: boolean, errors?: any[], result?: any) => void;
type OnWorkflowNodeChange<U> = (nodeId: string | number | null, ctx: U & ChainContextBase) => void;

export class Workflow<U> {
  private nodes: Map<string|number, WorkflowNode<U>> = new Map();
  private edges: WorkflowEdge<U>[] = [];
  private context: (U & ChainContextBase) | null = null;
  private currentNodeId: string|number|null = null;
  private resolveWorkflow?: (value: { success: boolean; errors?: any[]; result?: any }) => void;
  private onComplete?: OnWorkflowComplete;
  private onNodeChange?: OnWorkflowNodeChange<U>;

  private startNodeId: string|number|null = null;

  registerNode(node: WorkflowNode<U>) {
    this.nodes.set(node.nodeId, node);
  }

  addEdge(edge: WorkflowEdge<U>) {
    this.edges.push(edge);
  }

  setStartNodeId(nodeId: string|number) {
    this.startNodeId = nodeId;
  }

  setOnComplete(callback: OnWorkflowComplete) {
    this.onComplete = callback;
  }

  setOnNodeChange(callback: OnWorkflowNodeChange<U>) {
    this.onNodeChange = callback;
  }

  run(userContext: U): Promise<{ success: boolean; errors?: any[]; result?: any }> {
    if (this.startNodeId === null) {
      throw new Error("No startNodeId set for Workflow");
    }
    this.initContext(userContext);
    this.currentNodeId = this.startNodeId;
    this.notifyNodeChange();
    return new Promise((resolve) => {
      this.resolveWorkflow = resolve;
    });
  }

  handleResolve(output?: any) {
    if (this.currentNodeId === null || this.context === null) return;

    const currentNode = this.nodes.get(this.currentNodeId);
    if (!currentNode) return;

    this.context.setResult(this.currentNodeId, output);
    this.context.prevTaskId = this.currentNodeId;
    this.context.prevTaskOutput = output;

    // 根据 edges 找下一个节点
    const nextNodeId = this.findNextNodeId(this.currentNodeId, this.context);
    if (nextNodeId) {
      this.currentNodeId = nextNodeId;
      this.context.currentTaskId = nextNodeId;
      this.notifyNodeChange();
    } else {
      // 没有后续节点则结束
      this.context.isRunning = false;
      this.finishWorkflow(true, this.context.prevTaskOutput);
    }
  }

  handleReject(err: any) {
    if (this.currentNodeId === null || this.context === null) return;

    const currentNode = this.nodes.get(this.currentNodeId);
    if (!currentNode) return;

    this.context.addError(this.currentNodeId, currentNode.nodeName, err);
    this.context.isRunning = false;

    this.finishWorkflow(false);
  }

  getCurrentNode(): WorkflowNode<U> | null {
    if (this.currentNodeId === null) return null;
    return this.nodes.get(this.currentNodeId) || null;
  }

  private initContext(userContext: U) {
    const base: ChainContextBase = {
      isRunning: true,
      errors: [],
      results: {},
      currentTaskId: undefined,
      prevTaskId: undefined,
      prevTaskOutput: undefined,

      getResult(taskId: string | number) {
        return this.results[taskId];
      },
      setResult(taskId: string | number, output: any) {
        this.results[taskId] = output;
      },
      getCurrentTaskId() {
        return this.currentTaskId;
      },
      getPrevTaskOutput() {
        return this.prevTaskOutput;
      },
      addError(taskId: string | number, taskName: string, error: any) {
        this.errors.push({ taskId, taskName, error });
      },
    };

    this.context = { ...userContext, ...base } as U & ChainContextBase;
  }

  private notifyNodeChange() {
    if (this.onNodeChange && this.context !== null) {
      this.onNodeChange(this.currentNodeId, this.context);
    }
  }

  private finishWorkflow(success: boolean, result?: any) {
    if (this.resolveWorkflow && this.context) {
      this.resolveWorkflow({ success, errors: this.context.errors, result });
    }
    if (this.onComplete && this.context) {
      this.onComplete(success, this.context.errors, result);
    }
    this.currentNodeId = null;
  }

  private findNextNodeId(fromNodeId: string|number, ctx: U & ChainContextBase): string|number|null {
    const outgoingEdges = this.edges.filter(e => e.from === fromNodeId);
    for (const edge of outgoingEdges) {
      if (!edge.condition || edge.condition(ctx)) {
        return edge.to;
      }
    }
    return null;
  }

  // 从JSON定义中加载
  loadDefinition(def: WorkflowDefinition, components: Record<string, TaskComponent<U>>) {
    this.setStartNodeId(def.startNodeId);

    for (const n of def.nodes) {
      const comp = components[n.componentName];
      if (!comp) {
        throw new Error(`Component ${n.componentName} not found in components map`);
      }
      this.registerNode({
        nodeId: n.nodeId,
        nodeName: n.nodeName,
        taskComponent: comp,
      });
    }

    for (const e of def.edges) {
      // 如果需要更复杂的condition解析，可以在这里将e.condition转化成函数
      this.addEdge({
        from: e.from,
        to: e.to,
        condition: undefined, // 简化处理,可以根据e.condition字符串动态生成函数
      });
    }
  }
}