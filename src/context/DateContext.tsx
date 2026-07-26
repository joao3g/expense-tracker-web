import { createContext, useState, type ReactNode } from "react"

type DateContextType = {
    currentDate: Date
    setCurrentDate: React.Dispatch<React.SetStateAction<Date>>
}

export const DateContext = createContext<DateContextType | null>(null)

export function DateProvider({ children }: { children: ReactNode }) {
    const [currentDate, setCurrentDate] = useState(new Date());

    return (
        <DateContext.Provider value={{ currentDate, setCurrentDate }}>
            {children}
        </DateContext.Provider>
    )
}