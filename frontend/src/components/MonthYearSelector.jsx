import { useState, useEffect, useCallback, useMemo } from "react";
import { Calendar, ChevronDown, X } from "lucide-react";

// Componente de Autocompletado para Mes y Año
export default function MonthYearSelector({ onMonthYearSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [inputValue, setInputValue] = useState("");

  const months = useMemo(() => [
    { value: 1, label: "Enero" },
    { value: 2, label: "Febrero" },
    { value: 3, label: "Marzo" },
    { value: 4, label: "Abril" },
    { value: 5, label: "Mayo" },
    { value: 6, label: "Junio" },
    { value: 7, label: "Julio" },
    { value: 8, label: "Agosto" },
    { value: 9, label: "Septiembre" },
    { value: 10, label: "Octubre" },
    { value: 11, label: "Noviembre" },
    { value: 12, label: "Diciembre" }
  ], []);

  const currentYear = new Date().getFullYear();
  const years = useMemo(() => Array.from({ length: 10 }, (_, i) => currentYear - i), [currentYear]);

  const handleSelectionChange = useCallback(() => {
    if (selectedMonth && selectedYear) {
      const month = months.find(m => m.value === parseInt(selectedMonth));
      setInputValue(`${month.label} ${selectedYear}`);
      onMonthYearSelect(parseInt(selectedYear), parseInt(selectedMonth));
      setIsOpen(false);
    } else if (!selectedMonth && !selectedYear) {
      setInputValue("");
      onMonthYearSelect(null, null);
    }
  }, [selectedMonth, selectedYear, months, onMonthYearSelect]);

  useEffect(() => {
    handleSelectionChange();
  }, [handleSelectionChange]);

  const handleMonthSelect = (monthValue) => {
    setSelectedMonth(monthValue);
  };

  const handleYearSelect = (yearValue) => {
    setSelectedYear(yearValue);
  };

  const clearSelection = () => {
    setSelectedMonth("");
    setSelectedYear("");
    setInputValue("");
    onMonthYearSelect(null, null);
    setIsOpen(false);
  };

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdown = document.getElementById('month-year-dropdown');
      if (dropdown && !dropdown.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative w-72" id="month-year-dropdown">
      {/* Input con diseño mejorado */}
      <div 
        className="flex items-center justify-between px-4 py-3 transition-all duration-200 bg-white border-2 border-gray-200 cursor-pointer rounded-xl hover:border-blue-400 hover:shadow-md focus-within:border-blue-500 focus-within:shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <Calendar size={20} className="text-blue-500" />
          <span className={`text-sm font-medium ${inputValue ? "text-gray-800" : "text-gray-400"}`}>
            {inputValue || "Seleccionar mes y año"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {inputValue && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                clearSelection();
              }}
              className="p-1 text-gray-400 transition-colors rounded-full hover:text-red-500 hover:bg-red-50"
              aria-label="Limpiar selección"
            >
              <X size={16} />
            </button>
          )}
          <ChevronDown 
            size={18} 
            className={`text-gray-400 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          />
        </div>
      </div>

      {/* Dropdown mejorado */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 duration-200 bg-white border-2 border-gray-200 shadow-2xl rounded-xl animate-in fade-in slide-in-from-top-2">
          <div className="grid grid-cols-2 gap-6 p-5">
            {/* Selector de Mes */}
            <div>
              <h3 className="mb-3 text-xs font-bold tracking-wide text-gray-500 uppercase">
                Mes
              </h3>
              <div className="space-y-1 overflow-y-auto max-h-64 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {months.map((month) => (
                  <div
                    key={month.value}
                    className={`px-3 py-2.5 cursor-pointer rounded-lg text-sm font-medium transition-all duration-150 ${
                      selectedMonth === month.value.toString()
                        ? "bg-blue-500 text-white shadow-md scale-[1.02]"
                        : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                    onClick={() => handleMonthSelect(month.value.toString())}
                  >
                    {month.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Selector de Año */}
            <div>
              <h3 className="mb-3 text-xs font-bold tracking-wide text-gray-500 uppercase">
                Año
              </h3>
              <div className="space-y-1 overflow-y-auto max-h-64 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {years.map((year) => (
                  <div
                    key={year}
                    className={`px-3 py-2.5 cursor-pointer rounded-lg text-sm font-medium transition-all duration-150 ${
                      selectedYear === year.toString()
                        ? "bg-blue-500 text-white shadow-md scale-[1.02]"
                        : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                    onClick={() => handleYearSelect(year.toString())}
                  >
                    {year}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer con indicador de selección */}
          {(selectedMonth || selectedYear) && (
            <div className="px-5 py-3 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">
                  {selectedMonth && selectedYear 
                    ? "✓ Selección completa" 
                    : "⚠ Selecciona mes y año"}
                </span>
                {selectedMonth && selectedYear && (
                  <span className="font-semibold text-blue-600">
                    {months.find(m => m.value === parseInt(selectedMonth))?.label} {selectedYear}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
