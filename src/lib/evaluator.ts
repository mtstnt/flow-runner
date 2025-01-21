import { VariableAssignment } from "@/components/nodes/AssignNode";
import { VariableDeclaration } from "@/components/nodes/DeclareNode";
import { Node } from "@xyflow/react"

type VariableStore = {
  value: unknown;
  type: "string" | "number" | "boolean";
}

type NodeIterator = {
  node: Node,
  children: NodeIterator[]
};

export function evaluate(context: Map<string, VariableStore>, root: NodeIterator) {
  const currentNode = root.node;
  switch (currentNode.type) {
    case "start": return evaluateStart(context, root);
    case "declare": return evaluateDeclare(context, root);
    case "assign": return evaluateAssign(context, root);
    case "print": return evaluatePrint(context, root);
  }
}

// NO-OP
function evaluateStart(context: Map<string, VariableStore>, root: NodeIterator): void {
  if (root.children.length === 0) return;
  evaluate(context, root.children[0]);
}

function evaluateDeclare(context: Map<string, VariableStore>, root: NodeIterator): void {
  const data = root.node.data;
  const variables = data.variables as VariableDeclaration[];
  for (const variable of variables) {
    context.set(variable.name, {
      value: emptyValueOfType(variable.type),
      type: variable.type
    });
  }
  if (root.children.length === 0) return;
  evaluate(context, root.children[0]);
}

function evaluateAssign(context: Map<string, VariableStore>, root: NodeIterator): void {
  const data = root.node.data;
  const assignments = data.assignments as VariableAssignment[];
  for (const assignment of assignments) {
    const variable = context.get(assignment.name);
    if (variable) {
      switch (variable.type) {
        case "string": variable.value = String(assignment.value); break;
        case "number": variable.value = Number(assignment.value); break;
        case "boolean": variable.value = Boolean(assignment.value); break;
      }
    } else {
      alert(`Error: Variable "${assignment.name}" not found`);
      return;
    }
  }
  if (root.children.length === 0) return;
  evaluate(context, root.children[0]);
}

function evaluatePrint(context: Map<string, VariableStore>, root: NodeIterator): void {
  const data = root.node.data;
  const value = data.value as string;
  const object: { [key: string]: unknown } = {};
  for (const [key, value] of context.entries()) {
    object[key] = value.value;
  }
  const result = new Function(`with(this) { return ${value} }`).call(object);
  alert(String(result));
  if (root.children.length === 0) return;
  evaluate(context, root.children[0]);
}

function emptyValueOfType(type: "string" | "number" | "boolean"): string | number | boolean {
  switch (type) {
    case "string": return "";
    case "number": return 0;
    case "boolean": return false;
  }
}
