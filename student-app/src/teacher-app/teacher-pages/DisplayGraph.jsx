import React from "react";
import { IoClose } from "react-icons/io5";
import DrawGraph from "../teacher-components/DrawGraph";

const DisplayGraph = ({ title, datasets, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-[90%] md:w-[70%] p-6 rounded-lg shadow-lg relative">
                {/* Close Button */}
                <button
                    className="absolute top-4 right-4 text-gray-700 hover:text-red-500"
                    onClick={onClose}
                >
                    <IoClose size={24} />
                </button>

                {/* Graph Title */}
                <h2 className="text-2xl font-bold mb-6 text-center">{title}</h2>

                {/* Graph */}
                <DrawGraph title={title} labels={datasets[0]?.data.map((point) => point.x.toDateString())} datasets={datasets} />
            </div>
        </div>
    );
};

export default DisplayGraph;
