import { useState, useEffect } from 'react';
import { Workflow } from './workflow';
import { ChainContextBase } from './types';

type WorkflowResult = { success: boolean; errors?: any[]; result?: any };

function useWorkflow<U>(workflowInstance: Workflow<U>) {
  const [currentNodeId, setCurrentNodeId] = useState<string|number|null>(null);
  const [context, setContext] = useState<(U & ChainContextBase)|null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [workflowResult, setWorkflowResult] = useState<WorkflowResult|null>(null);

  useEffect(() => {
    workflowInstance.setOnNodeChange((nodeId, ctx) => {
      setCurrentNodeId(nodeId);
      setContext({ ...ctx });
      setIsRunning(ctx.isRunning);
    });

    workflowInstance.setOnComplete((success, errors, result) => {
      setIsRunning(false);
      setWorkflowResult({ success, errors, result });
      setCurrentNodeId(null);
      setContext(prev => prev ? { ...prev } : null);
    });
  }, [workflowInstance]);

  const run = (userContext: U) => {
    setWorkflowResult(null);
    return workflowInstance.run(userContext);
  };

  const handleResolve = (output?: any) => {
    workflowInstance.handleResolve(output);
  };

  const handleReject = (err: any) => {
    workflowInstance.handleReject(err);
  };

  const WorkflowComponent = () => {
    if (!isRunning || currentNodeId === null || !context) return null;

    const currentNode = workflowInstance.getCurrentNode();
    if (!currentNode) return null;

    return (
      <currentNode.taskComponent
        context={context}
        onResolve={handleResolve}
        onReject={handleReject}
      />
    );
  };

  return { Workflow: WorkflowComponent, run, isRunning, workflowResult, context };
}

export default useWorkflow;