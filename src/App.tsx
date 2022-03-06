import AutosuggestionSelect from "./AutosuggestionSelect/AutosuggestionSelect";

function App() {
    const onSelectionChange = (options: string[]) => {
        console.log(options);
    };

    return (
        <div>
            <AutosuggestionSelect actionOnChange={onSelectionChange} name="Universities"></AutosuggestionSelect>
        </div>
    );
}

export default App;
