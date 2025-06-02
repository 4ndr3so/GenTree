import { Children } from "react";
import { Canvas } from "konva/lib/Canvas";
import { CanvasMenu } from "./CanvasMenu";
import { SidebarItem } from "./SidebarItem";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import { addPerson } from "../../store/personSlice";
import { Button } from "@mui/material";
import PersonForm from "../PersonForm";


// AppLayout.tsx
export default function AppLayout({ children }: { children: React.ReactNode }) {
      const people = useSelector((state: RootState) => state.person.people);
  const dispatch = useDispatch<AppDispatch>();

  const addPersonHandler = () => {

  }
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-600 text-white flex flex-col">
        <div className="p-4 text-2xl font-bold">🌊</div>
        <nav className="flex-1 px-4 space-y-2">

          <div className="mt-8 text-xs uppercase text-gray-300">Modify Tree</div>
          
           <Button variant="contained" className="" 
           onClick={() => dispatch(addPerson({ id: crypto.randomUUID(), name: 'New', age: 30 }))}>
                    Add Person
                </Button>
            <PersonForm onSubmit={addPersonHandler} >

            </PersonForm>
            <div className="mt-8 text-xs uppercase text-gray-300">Other options</div>
          <SidebarItem icon="H" text="Heroicons" team />
          <SidebarItem icon="T" text="Tailwind Labs" team />
          <SidebarItem icon="W" text="Workcation" team />

        </nav>
        <div className="p-4 mt-auto">
          <SidebarItem icon="⚙️" text="Settings" />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="flex items-center justify-between bg-white px-6 py-4 shadow-sm">
          <input
            type="text"
            placeholder="Search"
            className="w-1/3 px-3 py-2 rounded-md border text-sm"
          />
          <div className="flex items-center gap-4">
            <button className="text-gray-500">🔔</button>
            <div className="flex items-center border rounded px-2 py-1">
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                className="w-8 h-8 rounded-full"
                alt="profile"
              />
              <span className="ml-2 font-medium">Tom Cook</span>
              <span className="ml-1">▼</span>
            </div>
          </div>
        </header>

        {/* Content area */}
        <section className="flex-1 m-6 rounded-lg border border-dashed bg-white">{children}</section>
      </main>
    </div>
  );
}

