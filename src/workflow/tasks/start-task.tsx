import { WorkflowContext } from "..";
import { TaskComponent } from "../../../lib/types";

const StartTask: TaskComponent<WorkflowContext> = ({ context, onResolve, onReject }) => {
  // 假设启动节点不需要做什么复杂处理，直接继续
  const handleStart = () => {
    console.log("StartTask 开始执行, context:", context);
    onResolve(); // 继续下一个节点
  };

  return (
    <div style={{ padding: "10px", border: "1px solid #ccc" }}>
      <h3>开始节点</h3>
      <p>初始ID: {context.id}</p>
      <button onClick={handleStart}>开始</button>
    </div>
  );
};

export default StartTask;