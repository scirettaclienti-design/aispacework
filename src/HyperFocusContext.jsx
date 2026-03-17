import { createContext, useContext, useState } from 'react';

const HyperFocusContext = createContext();

export function HyperFocusProvider({ children }) {
    // hyperFocus state can be null (inactive) or 1, 2, 3, 4 (active station)
    const [hyperFocus, setHyperFocus] = useState(null);

    return (
        <HyperFocusContext.Provider value={{ hyperFocus, setHyperFocus }}>
            {children}
        </HyperFocusContext.Provider>
    );
}

export function useHyperFocus() {
    return useContext(HyperFocusContext);
}
