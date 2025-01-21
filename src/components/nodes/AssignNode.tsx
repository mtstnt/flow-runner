import { Handle, NodeProps, Position } from "@xyflow/react";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { FaPlus, FaTrash } from "react-icons/fa";
import { HandleStyles, SettingsToolbar } from "./BaseNode";

export function AssignNode(props: NodeProps) {
  const [assignments, setAssignments] = useState<VariableAssignment[]>((props.data['assignments'] ?? []) as VariableAssignment[]);

  const onSaveButtonClicked = (newAssignments: VariableAssignment[]) => {
    setAssignments(newAssignments);
    props.data['assignments'] = newAssignments;
  };

  return (
    <div className="flex flex-row bg-white border-2 border-black w-[260px] rounded shadow">
      <SettingsToolbar id={props.id} />
      <Handle type="target" id={props.id + "_0"} style={HandleStyles} position={Position.Left} />
      <div className="w-full p-3 rounded-l">
        <h1 className="mb-2 text-lg font-bold">Assign</h1>
        {assignments.length > 0 && (
          <pre className="w-full p-3 mb-3 text-sm border rounded">
            {assignments.map((element, index) => {
              return <p key={index}><b>{element.name}</b> = {element.value}</p>
            })}
          </pre>
        )}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full" variant="default">Edit</Button>
          </DialogTrigger>
          <AssignNodeModal assignments={assignments} onSaveButtonClicked={onSaveButtonClicked} />
        </Dialog>
      </div>
      <div className="w-1/4 bg-red-600 rounded-r">
        <Handle type="source" id={props.id + "_1"} style={HandleStyles} position={Position.Right} />
      </div>
    </div>
  );
}

export type VariableAssignment = {
  name: string;
  value: string;
}

type AssignNodeModalProps = {
  assignments: VariableAssignment[];
  onSaveButtonClicked: (newAssignments: VariableAssignment[]) => void;
}

function AssignNodeModal({ assignments, onSaveButtonClicked }: AssignNodeModalProps) {
  const [localAssignments, setLocalAssignments] = useState<VariableAssignment[]>(assignments);

  const editVariableValue = (index: number, key: string, value: string) => {
    setLocalAssignments(prev => {
      const currentVariable = prev[index];
      const removedValue = prev.filter((_, i) => i !== index);
      currentVariable[key as keyof VariableAssignment] = value as "string" | "number" | "boolean";
      return [...removedValue, currentVariable];
    })
  };

  const onSaveClicked = () => onSaveButtonClicked(localAssignments);

  return (
    <DialogContent className="w-screen">
      <DialogHeader>
        <DialogTitle>Variable Declarations</DialogTitle>
      </DialogHeader>
      <Button variant="outline" className="mb-2" onClick={() => setLocalAssignments([...localAssignments, { name: '', value: '' }])}><FaPlus /> Add Variable</Button>
      <div className="flex flex-col space-y-2">
        {localAssignments.map((assignment, index) => (
          <div key={index} className="w-full">
            <div className="flex flex-row w-full gap-2">
              <Input id="name" placeholder="Variable Name" value={assignment.name} className="w-full" onChange={(e) => editVariableValue(index, 'name', e.target.value)} />
              <Input id="value" placeholder="Value to Assign" value={assignment.value} className="w-full" onChange={(e) => editVariableValue(index, 'value', e.target.value)} />
              <Button variant="destructive" onClick={() => setLocalAssignments(localAssignments.filter((_, i) => i !== index))}><FaTrash /></Button>
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
