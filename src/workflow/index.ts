import { WorkflowDefinition } from "../../lib/types";
import { Workflow } from "../../lib/workflow";
import EndTask from "./tasks/end-task";
import ProcessTask from "./tasks/process-task";
import StartTask from "./tasks/start-task";

export interface WorkflowContext {
  id: number;
}

// 定义组件映射表
const components = {
  "StartTask": StartTask,
  "ProcessTask": ProcessTask,
  "EndTask": EndTask
};

// 假设在此加载了JSON定义
const def: WorkflowDefinition = /* 从文件或服务加载 */ {
  startNodeId: "node-1",
  nodes: [
    { nodeId: "node-1", nodeName: "开始节点", componentName: "StartTask" },
    { nodeId: "node-2", nodeName: "处理节点", componentName: "ProcessTask" },
    { nodeId: "node-3", nodeName: "结束节点", componentName: "EndTask" }
  ],
  edges: [
    { from: "node-1", to: "node-2" },
    { from: "node-2", to: "node-3" }
  ]
};

const workflow = new Workflow<WorkflowContext>();
workflow.loadDefinition(def, components);

export default workflow;