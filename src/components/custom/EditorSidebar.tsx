import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton } from "../ui/sidebar";
import { DnDContext, DraggedData } from "../../contexts/DnDContext";
import { DragEvent, useContext } from "react";
import { useReactFlow } from "@xyflow/react";
import { nodeTypes } from "../nodes/BaseNode";
import { FaCodeBranch, FaPrint } from "react-icons/fa";

const sidebarMenus = [
  {
    label: "Print",
    icon: <FaPrint />,
    type: "print",
  },
  {
    label: "Declare",
    icon: <FaPrint />,
    type: "declare",
  },
  {
    label: "If",
    icon: <FaPrint />,
    type: "if",
  },
  {
    label: "Assign",
    icon: <FaPrint />,
    type: "assign",
  },
];

export default function EditorSidebar() {
  const rf = useReactFlow();
  const [_, setDraggedType] = useContext(DnDContext);
  const onDragStart = (event: DragEvent<HTMLSpanElement>, nodeType: DraggedData) => {
    setDraggedType(nodeType);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setDragImage(new Image(), 0, 0);
  };

  const onCreateNode = (nodeType: keyof typeof nodeTypes) => {
    return (_: React.MouseEvent<HTMLElement>) => {
      rf.addNodes({
        id: `node-${nodeType}-${Date.now()}`,
        type: nodeType,
        position: { x: 0, y: 0 },
        data: { label: nodeType },
      });
    }
  }

  return (
    <Sidebar>
      <SidebarHeader className="flex flex-row items-center justify-center space-x-2">
        <FaCodeBranch size={24} color={"green"} />
        <h1 className="text-3xl font-bold text-green-800">Flow Runner</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Components</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarMenus.map((menu, index) => (
                <SidebarMenuButton key={index} onClick={onCreateNode(menu.type as keyof typeof nodeTypes)} onDragStart={(event) => onDragStart(event, { type: menu.type, data: {} })} onDragEnd={() => setDraggedType(null)} draggable>
                    <div className="flex items-center space-x-2">{menu.icon}
                      <span className="text-sm">{menu.label}</span>
                  </div>
                </SidebarMenuButton>
              ))}
            </SidebarMenu>
            {/* <Collapsible defaultOpen className="group/collapsible">
              <CollapsibleTrigger>
                <SidebarMenuButton>SidebarMenuCollapse</SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenu>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuButton>
                        <span onDragStart={(event) => onDragStart(event, { type: "print", data: {} })} draggable>Print</span>
                      </SidebarMenuButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </SidebarMenu>
              </CollapsibleContent>
            </Collapsible> */}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
