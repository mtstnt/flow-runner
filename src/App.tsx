import { DragEvent, Fragment, MouseEvent, useCallback, useContext, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  Node,
  Edge,
  Connection,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import EditorSidebar from './components/custom/EditorSidebar';
import { DnDContext } from './contexts/DnDContext';
import TopBar from './components/custom/TopBar';
import CanvasContextMenu from './components/custom/CanvasContextMenu';
import { nodeTypes } from './components/nodes/BaseNode';
import { evaluate } from './lib/evaluator';

type ContextMenuData = {
  type: 'node' | 'edge';
  node?: Node;
  edge?: Edge;
  position: { x: number, y: number };
};

const initialNodes: Node[] = [
  { id: 'start', position: { x: 0, y: 0 }, data: { label: 'Start' }, type: 'start', draggable: false },
];

type NodeTree = {
  node: Node;
  children: NodeTree[];
};

const getNodeTree = (nodes: Node[], edges: Edge[]): NodeTree => {
  const startNode = nodes.find(node => node.id === 'start');
  if (!startNode) return { node: nodes[0], children: [] };

  const buildTree = (currentNode: Node): NodeTree => {
    const childEdges = edges.filter(edge => edge.source === currentNode.id);
    const children = childEdges
      .map(edge => nodes.find(node => node.id === edge.target))
      .filter((node): node is Node => node !== undefined)
      .map(node => buildTree(node));

    return {
      node: currentNode,
      children
    };
  };

  return buildTree(startNode);
};


export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const { screenToFlowPosition } = useReactFlow();
  const [draggedType, setDraggedType] = useContext(DnDContext);
  const [contextMenu, setContextMenu] = useState<ContextMenuData | null>(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => {
      eds = eds.filter(v => v.sourceHandle !== params.sourceHandle);
      eds = addEdge({
        ...params,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: '#FF0072',
        },
        style: {
          strokeWidth: 2,
          stroke: '#FF0072',
        },
      }, eds);
      return eds;
    }),
    [setEdges],
  );

  const onDropEventHandler = useCallback((event: DragEvent<HTMLElement>) => {
    const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
    const newNode = {
      id: `new-${draggedType?.type}-${Date.now()}`,
      type: draggedType?.type,
      position,
      data: {
        label: draggedType?.type ?? 'untyped',
      },
    };
    setNodes(prev => [...prev, newNode]);
    setDraggedType(null);
  }, [screenToFlowPosition, draggedType]);

  const onDragOver = useCallback((event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onNodeContextMenu = useCallback((event: MouseEvent, node: Node) => {
    event.preventDefault();
    if (contextMenu) {
      setContextMenu(null);
    } else {
      const position = { x: event.clientX, y: event.clientY };
      setContextMenu({ type: 'node', node, position });
    }
  }, []);

  const onEdgeContextMenu = useCallback((event: MouseEvent, edge: Edge) => {
    event.preventDefault();
    const position = { x: event.clientX, y: event.clientY };
    setContextMenu({ type: 'edge', edge, position });
  }, []);

  const onPlayButtonClick = () => {
    const nodeTree = getNodeTree(nodes, edges);
    console.log(nodeTree);
    evaluate(new Map(), nodeTree);
  };

  return (
    <Fragment>
      <EditorSidebar />
      <div className="flex flex-col w-full">
        <TopBar onPlayButtonClick={onPlayButtonClick} />
        <div className="w-full h-[calc(100vh-52px)]">
          <ReactFlow
            nodeTypes={nodeTypes}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDropEventHandler}
            onDragOver={onDragOver}
            onEdgeContextMenu={onEdgeContextMenu}
            onNodeContextMenu={onNodeContextMenu}
            onPaneClick={() => setContextMenu(null)}
          >
            <Controls />
            <MiniMap />
            <Background gap={12} size={1} />
          </ReactFlow>
          {contextMenu && <CanvasContextMenu close={() => setContextMenu(null)} position={contextMenu.position} type={contextMenu.type} node={contextMenu.node} edge={contextMenu.edge} />}
        </div>
      </div>
    </Fragment>
  );
}
