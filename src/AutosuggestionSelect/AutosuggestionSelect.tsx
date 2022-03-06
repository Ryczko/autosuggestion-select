import React, { useEffect, useRef, useState } from "react";
import Loader from "../utilities/Loader/Loader";
import "./AutosuggestionSelect.scss";
import { useCloseComponent } from "../Hooks/useCloseComponent";
import { University } from "./University.model";

interface AutosuggestionSelectProps {
    name: string;
    actionOnChange: (values: string[]) => void;
}

function AutosuggestionSelect({ name, actionOnChange }: AutosuggestionSelectProps) {
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [searchedItems, setSearchedItems] = useState<string[]>([]);
    const [isDropdownOpened, setIsDropdownOpened] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [searchedValue, setSearchedValue] = useState<string>("");

    const timeoutID = useRef<any>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const runCallback = useRef(false);

    useCloseComponent(wrapperRef, () => setIsDropdownOpened(false));

    useEffect(() => {
        setIsLoading(true);
        if (timeoutID.current) clearTimeout(timeoutID.current);
        if (searchedValue.trim() === "") {
            setSearchedItems([]);
            setIsLoading(false);
        } else {
            timeoutID.current = setTimeout(() => updateSearchResult(searchedValue), 200);
        }
        return () => {
            if (timeoutID.current) clearTimeout(timeoutID.current);
        };
    }, [searchedValue]);

    useEffect(() => {
        if (runCallback.current) {
            actionOnChange(selectedItems);
        }
        runCallback.current = true;
    }, [selectedItems, actionOnChange]);

    const handleReset = () => {
        setSelectedItems([]);
    };

    const handleExpand = () => {
        setIsDropdownOpened((dropDownState) => !dropDownState);
    };

    const handleChangeInput = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setSearchedValue(newValue);
    };

    const updateSearchResult = async (name: string) => {
        const response = await fetch(`http://universities.hipolabs.com/search?name=${name}`);
        const universitiesData: University[] = await response.json();
        setSearchedItems(universitiesData.map((el: any) => el.name));
        setIsLoading(false);
    };

    const handleToggleItem = (event: React.MouseEvent<HTMLLIElement>) => {
        const clickedElement = event.target as HTMLElement;
        if (selectedItems.includes(clickedElement.textContent!)) {
            setSelectedItems((selectedItems) => selectedItems.filter((el) => el !== clickedElement.textContent));
        } else {
            setSelectedItems((selectedItems) => [...selectedItems, clickedElement.textContent!]);
        }
    };

    const isSearchValueEmpty = searchedValue.trim() === "";

    return (
        <div ref={wrapperRef} className={"autosuggestion-select" + (isDropdownOpened ? " opened" : "")}>
            <button className="expand-btn" onClick={handleExpand}>
                <div className="content">
                    <div className="name">{name}</div>
                    <div className="counter">{selectedItems.length}</div>
                </div>
                <div className="arrow">▴</div>
            </button>

            {isDropdownOpened && (
                <div className="searching-field">
                    <input type="search" placeholder="Search..." onChange={handleChangeInput} value={searchedValue} />

                    <div className="results-wrapper">
                        {!isSearchValueEmpty && isLoading && <Loader />}
                        {isSearchValueEmpty ? (
                            selectedItems.length > 0 ? (
                                <ul className="items">
                                    {selectedItems.map((item, index) => (
                                        <li key={index} onClick={handleToggleItem} className="selected">
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="no-data">No field was selected</p>
                            )
                        ) : searchedItems.length > 0 ? (
                            <ul className="items">
                                {searchedItems.map((item, index) => (
                                    <li
                                        key={index}
                                        onClick={handleToggleItem}
                                        className={selectedItems.includes(item) ? "selected" : ""}
                                    >
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            !isLoading && <p className="no-data">No results</p>
                        )}
                    </div>

                    <button className="reset-button" onClick={handleReset}>
                        Reset
                    </button>
                </div>
            )}
        </div>
    );
}

export default AutosuggestionSelect;
