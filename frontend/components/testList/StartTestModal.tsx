'use client'

interface StartTestModalProps {
    onAccept: () => void;
    onClose: () => void;
}

export default function StartTestModal({ onAccept, onClose }: StartTestModalProps) {
    return (
        <div
            id="static-modal"
            data-modal-backdrop="static"
            className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex justify-center items-center"
        >
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 max-w-2xl p-4">
                <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Test Instructions
                    </h3>
                    <button
                        type="button"
                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8"
                        onClick={onClose}
                    >
                        <span className="sr-only">Close modal</span>
                    </button>
                </div>

                <div className="p-5 space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h4 className="text-lg font-semibold text-blue-600">Test Instructions:</h4>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mt-2">
                            <li>Make sure you have a stable internet connection.</li>
                            <li>Once the test starts, you cannot pause or restart it.</li>
                            <li>Read all questions carefully before answering.</li>
                            <li>Avoid refreshing or closing the browser during the test.</li>
                        </ul>
                    </div>
                    <p className="text-base text-gray-500 dark:text-gray-400">
                        Are you sure you want to start this test?
                    </p>
                </div>

                <div className="flex items-center justify-between p-4">
                    <button
                        className="text-white bg-red-600 border border-red-200 rounded-lg px-5 py-2"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="text-white bg-blue-700 hover:bg-blue-800 rounded-lg px-5 py-2"
                        onClick={onAccept}
                    >
                        Start Test Now
                    </button>
                </div>
            </div>
        </div>
    );
}
