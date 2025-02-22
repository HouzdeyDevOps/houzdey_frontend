"use client";
import { motion } from "framer-motion";
import { X } from "lucide-react";

interface ModalCardProps{
  modalOpen: boolean;
  modalType: "add" | "edit" | "delete" | null;
  note : string;
  setNote: (value: string) => void;
  setModalOpen: (value: boolean)=> void;
}


export default function Modal({
  modalOpen,
  modalType,
  note,
  setNote,
  setModalOpen

}:ModalCardProps){
    return(
        <div>
            {modalOpen && (
        <div className="fixed inset-0 flex items-end justify-center bg-black bg-opacity-50 z-50  min-w-[375px] min-h-[287px] ">
           <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
        >
          <div className={`bg-white p-11 rounded-3xl   shadow-lg relative`}>
            <button className="absolute top-2 right-2" onClick={() => setModalOpen(false)}>
              <X className="w-6 h-6 m-9" />
            </button>
            <div className="mt-11">
            <h2 className="text-3xl font-semibold mb-4">
              {modalType === "add" ? "Add Note" : modalType === "edit" ? "Edit Note" : "Confirm Deletion"}
            </h2>
                {modalType === "delete" ? (
                <p>Are you sure you want to delete this listing?</p>
                ) : (
                <textarea
                    className="w-full p-2 border rounded-lg"
                    rows={4}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder={modalType === "add" ? "Write your note here..." : "Edit your note..."}
                />
                )}
            </div>
            
            <div className="flex justify-between mt-20 gap-2 ">
              <button className="px-4 py-2 sm:min-w-[284px] sm:min-h-[44px] bg-gray-200 rounded" onClick={() => setModalOpen(false)}>Cancel</button>
              <button className={`px-4 py-2 sm:min-w-[284px] sm:min-h-[44px] ${ modalType === "delete" ? "bg-red-600" : "bg-blue-600"} text-white rounded`} onClick={() => setModalOpen(false)}>
                {modalType === "delete" ? "Delete" : "Save"}
              </button>
            </div>
          </div>
          </motion.div>
        </div>
      )}
        </div>
    )
}