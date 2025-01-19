import { Handle, Node, NodeProps, NodeToolbar, Position, useReactFlow } from "@xyflow/react";
import { FaCog, FaCopy, FaPlus, FaTrash } from "react-icons/fa";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ComboBox } from "../custom/ComboBox";
import { HandleStyles } from "./BaseNode";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { DialogFooter } from "../ui/dialog";

export type VariableDeclaration = {
  name: string;
  type: "string" | "number" | "boolean";
}

export default function DeclareNode(props: NodeProps) {
  const rf = useReactFlow();
  const [variables, setVariables] = useState<VariableDeclaration[]>((props.data['variables'] ?? []) as VariableDeclaration[]);

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
        <h1 className="mb-2 text-lg font-bold">Declare</h1>
        {/* Render the declared variables as table */}
        {variables.length > 0 && (
          <pre className="w-full p-3 mb-3 text-sm border rounded">
            {variables.map((element, index) => {
              return <p key={index}><b>{element.type}</b> {element.name}</p>
            })}
          </pre>
        )}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full" variant="default">Edit</Button>
          </DialogTrigger>
          <DeclareNodeModal variables={variables} setVariables={setVariables} />
        </Dialog>
      </div>
      <div className="w-1/4 bg-yellow-600 rounded-r">
        <Handle type="source" id={props.id + "_1"} style={HandleStyles} position={Position.Right} />
      </div>
    </div>
  );
}

type DeclareNodeModalProps = {
  variables: VariableDeclaration[];
  setVariables: React.Dispatch<React.SetStateAction<VariableDeclaration[]>>;
}

const variableTypeOptions = [
  { label: 'String', value: 'string' },
  { label: 'Number', value: 'number' },
  { label: 'Boolean', value: 'boolean' },
];

function DeclareNodeModal({ variables, setVariables }: DeclareNodeModalProps) {
  const [localVariables, setLocalVariables] = useState<VariableDeclaration[]>(variables);

  const editVariableValue = (index: number, key: string, value: string) => {
    setLocalVariables(prev => {
      const currentVariable = prev[index];
      const removedValue = prev.filter((_, i) => i !== index);
      currentVariable[key as keyof VariableDeclaration] = value as any;
      return [...removedValue, currentVariable];
    })
  };
  
  const onSaveClicked = () => {
    setVariables(localVariables);
  }

  return (
    <DialogContent className="w-screen">
      <DialogHeader>
        <DialogTitle>Variable Declarations</DialogTitle>
      </DialogHeader>
      <Button variant="outline" className="mb-2" onClick={() => setLocalVariables([...localVariables, { name: '', type: 'string' }])}><FaPlus /> Add Variable</Button>
      <div className="flex flex-col space-y-2">
        {localVariables.map((variable, index) => (
          <div key={index} className="w-full">
            <div className="flex flex-row w-full gap-2">
              <ComboBox options={variableTypeOptions} onOptionSelected={(value) => editVariableValue(index, 'type', value as "string" | "number" | "boolean")} />
              <Input id="name" placeholder="Variable Name" value={variable.name} className="w-full" onChange={(e) => editVariableValue(index, 'name', e.target.value)} />
              <Button variant="destructive" onClick={() => setLocalVariables(localVariables.filter((_, i) => i !== index))}><FaTrash /></Button>
            </div>
          </div>
        ))}
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="default" onClick={onSaveClicked}>Save</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  )
}

