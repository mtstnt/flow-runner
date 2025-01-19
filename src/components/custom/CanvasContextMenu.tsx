import { Edge, Node, useReactFlow } from "@xyflow/react";

export default function CanvasContextMenu({ type, node, edge, position, close }: { type: 'node' | 'edge', node?: Node, edge?: Edge, position: { x: number, y: number }, close: () => void }) {
  const { setNodes, setEdges } = useReactFlow();
  const onDeleteEdge = () => {
    if (edge) {
      setEdges(edges => edges.filter(e => e.id !== edge.id));
    }
    close();
  }
  const onDeleteNode = () => {
    if (node) {
      setNodes(nodes => nodes.filter(n => n.id !== node.id));
    }
    close();
  }
  return (
    <div className="absolute z-50 text-white" style={{
      left: position.x,
      top: position.y,
    }}>
      <div className="z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2">
        <button onClick={type == 'node' ? onDeleteNode : onDeleteEdge} className="w-full cursor-pointer hover:bg-accent hover:text-accent-foreground relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50">Delete</button>
      </div>
    </div>
  );
}
