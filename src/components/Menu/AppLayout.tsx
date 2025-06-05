import { Children, useState } from "react";

import { SidebarItem } from "./SidebarItem";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import AddRelationButtons from "../AddRelationButtonsProps";
import type { PersonGedCom } from "../../types/types";
import PersonForm from "../PersonForm";
import NewPersonModal from "../NewPersonModal";
import { useAddRelationLogic } from "../../hooks/useAddRelationLogic";
 // ajusta el path si es necesario




// AppLayout.tsx
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [relationType, setRelationType] = useState<'partner' | 'child' | 'sibling' | 'parent'>('partner');
  const selected = useSelector((state: RootState) => state.selectedPerson);
  const [modalOpen, setModalOpen] = useState(false);
  const { handleAddRelation } = useAddRelationLogic();

  //const { people, addPerson, addTreeSaved, loadSavedTree } = useFamilyTree();
  //  console.log("Selected:", selected);
  const dispatch = useDispatch<AppDispatch>();

  const addPersonHandlerModal = (data: PersonGedCom) => {
    console.log("Adding person:", data);
    //root
    //not root
    //const person = new Person(data.firstName, data.lastName, crypto.randomUUID(), data.gender, data.birthDate);
    // addPerson(person, "pareja");
     handleAddRelation(relationType, data);
  setModalOpen(false); // Cierra el modal si lo usas así

  }
  const addRelacion = (tipo: string) => {
    setRelationType(tipo as 'partner' | 'child' | 'sibling' | 'parent');
    setModalOpen(true);
    
  }
   const addPersonHandler = (data: PersonGedCom) => {
    console.log("Adding person:", data);
    //root
    //not root


  }

  return (
    <>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <aside className="w-64 bg-indigo-600 text-white flex flex-col">
          <div className="p-4 text-2xl font-bold">🌊</div>
          <nav className="flex-1 px-4 space-y-2">

            <div className="mt-8 text-xs uppercase text-gray-300">Modify Tree</div>


            <PersonForm onSubmit={addPersonHandler} person={selected ?? { firstName: '', lastName: '', birthDate: '', gender: 'U' }} />

            <AddRelationButtons onAdd={(a) => addRelacion(a)} />
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
      <NewPersonModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSubmit={addPersonHandlerModal} /></>
  );
}

