import { WorkflowContext } from "..";
import { TaskComponent } from "../../../lib/types";

const EndTask: TaskComponent<WorkflowContext> = ({ context, onResolve, onReject }) => {
  // 在此节点中可以访问 context.prevTaskOutput 中的最终处理结果
  const finalData = context.getPrevTaskOutput();

  const handleFinish = () => {
    console.log("EndTask 结束节点执行完成，最终数据：", finalData);
    onResolve(); // 标记工作流结束
  };

  return (
    <div style={{ padding: "10px", border: "1px solid #ccc" }}>
      <h3>结束节点</h3>
      <p>最终数据: {finalData ? JSON.stringify(finalData) : "无"}</p>
      <button onClick={handleFinish}>完成</button>
    </div>
  );
};

export default EndTask;