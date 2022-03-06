import { useEffect } from "react";

export function useCloseComponent(ref: React.RefObject<HTMLElement>, cb: () => void) {
    useEffect(() => {
        function handleClickOutside(event: any) {
            if (ref.current && !ref.current.contains(event.target)) {
                cb();
            }
        }

        function handleClickEsc(event: any) {
            if (event.keyCode === 27) {
                cb();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleClickEsc);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleClickEsc);
        };
    }, [ref, cb]);
}
