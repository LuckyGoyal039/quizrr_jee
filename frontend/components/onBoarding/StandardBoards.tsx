export function StandardSelector({ setVal }) {
    const standards = ["Class 11", "Class 12", "First Time Dropper", "Second Time Dropper"];
    
    return (
        <div className="flex justify-center gap-4">
            {standards.map((standard) => (
                <Input
                    key={standard}
                    value={standard}
                    readOnly
                    className="hover:border-black"
                    onClick={() => setVal(standard)}
                />
            ))}
        </div>
    );
}

const boards = [
    "Central Board of Secondary Education (CBSE)",
    "Indian School Certificate (ISC)",
    // ... add all other boards
];

export function BoardSelector({ onChange }) {
    return (
        <Select onValueChange={onChange}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Board" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {boards.map((board) => (
                        <SelectItem key={board} value={board}>{board}</SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}