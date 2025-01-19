import { FaBug, FaPlay } from "react-icons/fa";
import { Button } from "../ui/button";
import { SidebarTrigger } from "../ui/sidebar";

export default function TopBar({ onPlayButtonClick }: { onPlayButtonClick: () => void }) {
  return (
    <div className="h-[52px] w-full bg-secondary-background shadow-sm flex items-center">
      <div className="flex justify-between w-full">
        <SidebarTrigger />
        <div className="flex items-center justify-center w-full space-x-2">
          <Button variant={'success'} onClick={onPlayButtonClick}>
            <FaPlay />
          </Button>
          <Button variant={'outline'} onClick={onPlayButtonClick}>
            <FaBug />
          </Button>
        </div>
      </div>
    </div>
  );
}
