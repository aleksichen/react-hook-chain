import Chain from "../../lib/chain";
import { TaskComponent } from "../../lib/types";

export interface ChainContext {
  id: number;
}

const Task1: TaskComponent<ChainContext> = ({ context, onResolve, onReject }) => {
  const handleContinue = () => {
    onResolve(); // Proceed to the next task
  };

  const handleError = () => {
    onReject("An error occurred!"); // Stop the chain
  };

  return (
    <div>
      <p>Task for ID: {context.getCurrentTaskId()}</p>
      <button onClick={handleContinue}>Continue</button>
      <button onClick={handleError}>Reject</button>
    </div>
  );
};

const Task2: TaskComponent<ChainContext> = ({ context, onResolve, onReject }) => {
  const handleContinue = () => {
    onResolve(); // Proceed to the next task
  };

  const handleError = () => {
    onReject("An error occurred!"); // Stop the chain
  };

  return (
    <div>
      <p>Task for ID: {context.getCurrentTaskId()}</p>
      <button onClick={handleContinue}>Continue</button>
      <button onClick={handleError}>Reject</button>
    </div>
  );
};

const startBiz = new Chain<ChainContext>();

startBiz.register("task-1", "task-1", Task1);
startBiz.register("task-2", "task-2", Task2);

export default startBiz;
