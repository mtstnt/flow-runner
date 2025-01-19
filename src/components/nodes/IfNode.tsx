import { FaCopy } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { Handle, Node, NodeProps, NodeToolbar, Position, useReactFlow } from "@xyflow/react";
import { useState } from "react";
import { FaCog } from "react-icons/fa";
import { Button } from "../ui/button";
import { HandleStyles } from "./BaseNode";
import { Input } from "../ui/input";

export default function IfNode(props: NodeProps) {
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
    };
  
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
