import { Handle } from "@xyflow/react";
import { NodeProps, Position } from "@xyflow/react";
import { Input } from "../ui/input";
import { useState } from "react";
import { HandleStyles, SettingsToolbar } from "./BaseNode";

export function PrintNode(props: NodeProps) {
  const [input, setInput] = useState((props.data['value'] ?? '') as string);

  return (
    <div className="flex flex-row bg-white border-2 border-black w-[260px] rounded shadow">
      <SettingsToolbar id={props.id} />
      <Handle type="target" id={props.id + "_0"} style={HandleStyles} position={Position.Left} />
      <div className="w-full p-3 rounded-l">
        <h1 className="mb-2 text-lg font-bold">Print</h1>
        <Input placeholder="Input" className="w-full" value={input} onChange={(e) => { setInput(e.target.value); props.data['value'] = e.target.value }} />
      </div>
      <div className="w-1/4 bg-green-600 rounded-r">
        <Handle type="source" id={props.id + "_1"} style={HandleStyles} position={Position.Right} />
      </div>
    </div>
  );
}

export function StartNode() {
  return (
    <div className="h-full p-3 bg-yellow-500 border-2 border-black rounded shadow w-36">
      <h1 className="mb-2 text-lg font-bold">Start Node</h1>
      <p className="text-sm">This is where your program will start.</p>
      <Handle type="source" id={"start"} style={HandleStyles} position={Position.Right} />
    </div>
  )
}
