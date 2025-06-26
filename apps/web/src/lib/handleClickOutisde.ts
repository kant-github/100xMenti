import { Dispatch, SetStateAction } from "react";


export const handleClickOutside = (
    event: MouseEvent,
    menuRef: React.RefObject<HTMLDivElement>,
    setIsOpen: Dispatch<SetStateAction<boolean>>
) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
    }
};
