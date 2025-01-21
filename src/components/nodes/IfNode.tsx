import { Handle, NodeProps, Position } from "@xyflow/react";
import { useState } from "react";
import { HandleStyles, SettingsToolbar } from "./BaseNode";
import { Input } from "../ui/input";

export default function IfNode(props: NodeProps) {
    const [input, setInput] = useState((props.data['value'] ?? '') as string);

    return (
      <div className="flex flex-row bg-white border-2 border-black w-[260px] rounded shadow">
        <SettingsToolbar id={props.id} />
        <Handle type="target" id={props.id + "_0"} style={HandleStyles} position={Position.Left} />
        <div className="w-full p-3 rounded-l">
          <h1 className="mb-2 text-lg font-bold">If</h1>
          <Input placeholder="Input" className="w-full" value={input} onChange={(e) => { setInput(e.target.value); props.data['value'] = e.target.value }} />
        </div>
        <div className="relative w-1/4 bg-blue-600 rounded-r">
          <div className="absolute top-[10%] px-2 text-xs text-white">true</div>
          <div className="absolute bottom-[10%] px-2 text-xs text-white">false</div>
          <Handle id={props.id + "_1"} style={{ ...HandleStyles, top: '20%'}} type="source" position={Position.Right} />
          <Handle id={props.id + "_2"} style={{ ...HandleStyles, top: '80%'}} type="source" position={Position.Right} />
        </div>
      </div>
    );
}
