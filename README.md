# **react-hook-chain**

A lightweight and flexible framework for building task execution chains in React applications. With `react-hook-chain`, you can define, manage, and execute sequential tasks (responsibility chains) with ease.

## **Features**
*	Flexible task registration system.
* Context sharing across tasks with built-in state management.
*	Reactive task chaining with hooks.
*	Error handling and progress tracking.
*	Supports React functional components for task definitions.

## **Installation**
```bash
npm install bizchain
```

## **Basic Usage**

1. **Create a Context Interface**
```tsx
// myContext.ts
export interface MyContext {
  id: number;
}
```

2. **Define Tasks**
```tsx
// task.tsx
import { TaskComponent } from "bizchain";

const ExampleTask: TaskComponent<MyContext> = ({ context, onResolve, onReject }) => {
  const handleContinue = () => {
    onResolve(); // Proceed to the next task
  };

  const handleError = () => {
    onReject("An error occurred!"); // Stop the chain
  };

  return (
    <div>
      <p>Task for ID: {context.id}</p>
      <button onClick={handleContinue}>Continue</button>
      <button onClick={handleError}>Reject</button>
    </div>
  );
};

export default ExampleTask;
```

3. **Register Tasks**
Use BizChain to define a sequence of tasks.

```tsx
// chain.tsx

import Chain from "@aleksichen/react-hook-chain";
import ExampleTask from "./ExampleTask";
import { MyContext } from "./myContext";

const mychain = new Chain<MyContext>();

mychain.register("task-1", "Example Task", ExampleTask);

export default mychain;
```

4. **Use the Chain**
Leverage useChain to execute tasks reactively in your component.

```tsx
// app.tsx
import React from "react";
import { useChain } from "@aleksichen/react-hook-chain";
import mychain from "./chain";
import { MyContext } from "./myContext";

const App: React.FC = () => {
  const { Chain, run, chainResult } = useChain(chain);

  const handleStart = async () => {
    const { success, errors } = await run({ id: 123 });
    if (success) {
      console.log("All tasks completed successfully!");
    } else {
      console.error("Errors:", errors);
    }
  };

  return (
    <div>
      <button onClick={handleStart}>Start Task Chain</button>
      <Chain />
    </div>
  );
};

export default App;
```