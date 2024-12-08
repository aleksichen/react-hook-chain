import useChain from '../lib/hook';
import useWorkflow from '../lib/use-workflow';
import chain from './chain';
import workflow from './workflow';

function App() {
  const { Chain, run: runChain } = useChain(chain);
  const { Workflow, run: runWorkflow } = useWorkflow(workflow);

  const startChain = async () => {
    const { success, errors } = await runChain({ id: 123 });
    console.log({ success, errors })
    if (success) {
      console.log("All tasks completed successfully!");
    } else {
      console.error("Errors:", errors);
    }
  };

  const startWorkflow = async () => {
    const { success, errors, result } = await runWorkflow({ id: 123 });
    if (success) {
      console.log("工作流完成，最终结果：", result);
    } else {
      console.error("工作流中断，错误：", errors);
    }
  };

  return (
    <div>
      <button onClick={startChain}>Start Task Chain</button>
      <button onClick={startWorkflow}>Start Task Workflow</button>

      <Chain />
      <Workflow />
    </div>
  );
}

export default App
