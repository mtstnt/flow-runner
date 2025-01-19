import React from "react";

export type DraggedData = {
    type: string;
    data: any;
};

export const DnDContext = React.createContext<[DraggedData | null, React.Dispatch<React.SetStateAction<DraggedData | null>>]>([null, () => {}]);

export const DnDProvider = ({ children }: { children: React.ReactNode }) => {
    const [draggedData, setDraggedData] = React.useState<DraggedData | null>(null);
    return <DnDContext.Provider value={[draggedData, setDraggedData]}>{children}</DnDContext.Provider>;
}