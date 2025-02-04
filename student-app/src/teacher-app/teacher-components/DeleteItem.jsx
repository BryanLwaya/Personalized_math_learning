import React from "react";
import { IoClose } from "react-icons/io5";

const DeleteItem = ({ itemName, onDelete, onCancel }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 h-screen">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Delete Confirmation</h2>
                    <button
                        onClick={onCancel}
                        className="text-primary"
                    >
                        <IoClose className="text-4xl" />
                    </button>
                </div>

                <p className="text-gray-600 mb-6">
                    Are you sure you want to delete <strong>{itemName}</strong>?
                    This action cannot be undone.
                </p>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={onCancel}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onDelete}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteItem;
