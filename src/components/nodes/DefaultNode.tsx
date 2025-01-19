import { Handle, Node } from "@xyflow/react";
import { NodeProps, NodeToolbar, Position, useReactFlow } from "@xyflow/react";
import { Input } from "../ui/input";
import { useState } from "react";
import { Button } from "../ui/button";
import { FaCog, FaCopy, FaTrash } from "react-icons/fa";
import { HandleStyles } from "./BaseNode";
import DeclareNode from "./DeclareNode";
import IfNode from "./IfNode";

export const nodeTypes = {
  start: StartNode,
  standard: PrintNode,
  declare: DeclareNode,
  if: IfNode,
};

export function PrintNode(props: NodeProps) {
  const rf = useReactFlow();
  const [input, setInput] = useState((props.data['value'] ?? '') as string);

  const onDuplicateNode = () => {
    const thisNode: Node = rf.getNode(props.id)!;
    const duplicateNode: Node = {
      ...thisNode,
      id: `${thisNode.id}-duplicate`,
      selected: false,
      position: {
        x: thisNode.position.x + 100,
        y: thisNode.position.y + 100,
      },
    }
    rf.setNodes(prev => [...prev, duplicateNode])
  };
  const onDeleteNode = () => {
    rf.setNodes(rf.getNodes().filter(n => n.id !== props.id));
    rf.setEdges(rf.getEdges().filter(e => !e.source.startsWith(props.id) && !e.target.startsWith(props.id)));
  }

  return (
    <div className="flex flex-row bg-white border-2 border-black w-[260px] rounded shadow">
      <NodeToolbar offset={0} className="flex flex-row items-center p-1 space-x-2 bg-black rounded-t-lg rounded-br-lg" position={Position.Top} align={"end"}>
        <div className="px-1">
          <FaCog color={"white"} />
        </div>
        <Button size={"icon"} variant={'secondary'} onClick={onDuplicateNode}><FaCopy /></Button>
        <Button size={"icon"} variant={'destructive'} onClick={onDeleteNode}><FaTrash /></Button>
      </NodeToolbar>
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