"use client"

const onBoarding: React.FC = () => {
    const user='lucky@gmail.com'
    return (
        <div className="flex flex-col items-center border relative p-6 w-[50%]">
            <div className="-mt-16">
                <div className="bg-[#bf360c] w-fit py-4 px-7 rounded-[100%]">
                    <h1 className="text-white text-5xl">
                        {user?.email?.[0].toUpperCase()}
                    </h1>
                </div>
            </div>
            {/* <div className="flex flex-col items-center mt-4">
                {loading ? (
                    <div>
                        <Loader />
                    </div>
                ) : (
                    <>
                        {selin?.[step - 1] && (
                            <h1 className="text-xl pb-2">{selin[step - 1].title}</h1>
                        )}
                        {selin?.[step - 1] && <p>{selin[step - 1].subtitle}</p>}
                        <div className="mt-3 w-full flex justify-center">
                            {selin?.[step - 1] &&
                                selin[step - 1].comp(
                                    step === 3
                                        ? country ?? []
                                        : step === 4
                                            ? state
                                            : step === 5
                                                ? city
                                                : []
                                )}

                        </div>
                    </>
                )}
            </div>
            <div className="mt-4">
                <Button onClick={handleClick}>Save & Next</Button>
            </div> */}
        </div>

    )
}

export default onBoarding