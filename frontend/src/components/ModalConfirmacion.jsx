import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

export default function ModalConfirmacion({ isOpen, onClose, onConfirm }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[1000]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center relative"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            transition={{ type: "spring", duration: 0.4 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center mb-4">
              <AlertTriangle className="w-12 h-12 text-yellow-500" />
            </div>

            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              ¿Seguro que deseas eliminar este producto?
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Esta acción no se puede deshacer.
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg font-semibold text-gray-800 transition"
              >
                Cancelar
              </button>
              <button
                onClick={onConfirm}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold shadow-md transition"
              >
                Sí, eliminar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
