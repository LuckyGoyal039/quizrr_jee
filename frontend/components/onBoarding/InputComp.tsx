

interface InputComponentprops {
    stepNo: number
}

export default function InputComponent({ stepNo }: InputComponentprops) {
    return (
        <>
            <p>{stepNo}</p>
        </>
    )
}