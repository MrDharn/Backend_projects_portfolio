import { createContext, useState } from "react";

export const LayoutContext = createContext()
export const LayoutProvider = ({children})=>{
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = ()=>{
        setIsSidebarOpen((prev)=> !prev)
    }

    const closeSidebar = ()=>{
        setIsSidebarOpen(false)
    }

    return(
        <LayoutContext.Provider value={{isSidebarOpen, closeSidebar, toggleSidebar}}>
            {children}
        </LayoutContext.Provider>
    )
}

