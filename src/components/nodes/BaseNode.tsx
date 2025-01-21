import { Node, NodeToolbar, Position, useReactFlow } from "@xyflow/react";
import { FaCog, FaCopy, FaTrash } from "react-icons/fa";
import { Button } from "../ui/button";
import DeclareNode from "./DeclareNode";
import { PrintNode, StartNode } from "./DefaultNode";
import IfNode from "./IfNode";
import { AssignNode } from "./AssignNode";

export const HandleStyles = { width: 10, height: 10 };

export const nodeTypes = {
    start: StartNode,
    print: PrintNode,
    declare: DeclareNode,
    if: IfNode,
    assign: AssignNode,
};

type SettingsToolbarProps = {
  id: string;
}

export function SettingsToolbar(props: SettingsToolbarProps) {
  const rf = useReactFlow();

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
    <NodeToolbar offset={0} className="flex flex-row items-center p-1 space-x-2 bg-black rounded-t-lg rounded-br-lg" position={Position.Top} align={"end"}>
      <div className="px-1">
        <FaCog color={"white"} />
      </div>
      <Button size={"icon"} variant={'secondary'} onClick={onDuplicateNode}><FaCopy /></Button>
      <Button size={"icon"} variant={'destructive'} onClick={onDeleteNode}><FaTrash /></Button>
    </NodeToolbar>
  )
}
