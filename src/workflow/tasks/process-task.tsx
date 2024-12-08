import { useEffect } from "react";
import { TaskComponent } from "../../../lib/types";
import { WorkflowContext } from "..";

const ProcessTask: TaskComponent<WorkflowContext> = ({ context, onResolve, onReject }) => {
  useEffect(() => {
    console.log("ProcessTask 开始处理...");

    // 模拟异步处理
    const timer = setTimeout(() => {
      // 假设处理成功
      console.log("ProcessTask 处理完成");
      // 将处理结果作为输出传递下去
      const resultData = { processedId: context.id * 2 };
      onResolve(resultData);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ padding: "10px", border: "1px solid #ccc" }}>
      <h3>处理节点</h3>
      <p>当前ID: {context.id}</p>
      <p>正在处理，请稍候...</p>
    </div>
  );
};

export default ProcessTask;