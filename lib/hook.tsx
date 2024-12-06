import { useState, useEffect } from 'react';
import BizChain, { MergedContext } from './chain';

function useChain<U>(chainInstance: BizChain<U>) {
  const [currentTaskIndex, setCurrentTaskIndex] = useState<number | null>(null);
  const [context, setContext] = useState<MergedContext<U> | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [chainResult, setChainResult] = useState<{ success: boolean; errors?: any[]; result?: any } | null>(null);

  useEffect(() => {
    chainInstance.setOnTaskChange((taskIndex, ctx) => {
      setCurrentTaskIndex(taskIndex);
      setContext({ ...ctx });
      setIsRunning(ctx.isRunning);
    });

    chainInstance.setOnComplete((success, errors, result) => {
      setIsRunning(false);
      setChainResult({ success, errors, result });
      setCurrentTaskIndex(null);
      setContext((prev) => (prev ? { ...prev } : null));
    });
  }, [chainInstance]);

  const run = (userContext: U) => {
    setChainResult(null);
    return chainInstance.run(userContext);
  };

  const handleResolve = (output?: any) => {
    chainInstance.handleResolve(output);
  };

  const handleReject = (err: any) => {
    chainInstance.handleReject(err);
  };

  const Chain = () => {
    if (!isRunning || currentTaskIndex === null || !context) return null;

    const currentTask = chainInstance.getCurrentTask();
    if (!currentTask) return null;

    return (
      <currentTask.taskComponent
        context={context}
        onResolve={handleResolve}
        onReject={handleReject}
      />
    );
  };

  return { Chain, run, isRunning, chainResult, context };
}

export default useChain;