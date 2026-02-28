"use client";

import { useState, useEffect } from "react";
import {
  Camera,
  CheckCircle2,
  Circle,
  RotateCcw,
  Plus,
  Trash2,
  Pencil,
  X,
  Check,
  ListChecks,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Item {
  id: string;
  label: string;
}

// ─── Default template ────────────────────────────────────────────────────────

const DEFAULT_TEMPLATE: Item[] = [
  { id: "1", label: "Cámara" },
  { id: "2", label: "Lente(s)" },
  { id: "3", label: "Tripié" },
  { id: "4", label: "Fondo / backdrop" },
  { id: "5", label: "Soporte de fondo" },
  { id: "6", label: "Iluminación" },
  { id: "7", label: "Cables y extensiones" },
  { id: "8", label: "Laptop / tablet" },
  { id: "9", label: "Impresora" },
  { id: "10", label: "Papel fotográfico" },
  { id: "11", label: "Tinta / cartuchos" },
  { id: "12", label: "Props / accesorios" },
  { id: "13", label: "Router / internet" },
  { id: "14", label: "Pantalla de vista previa" },
  { id: "15", label: "Baterías / cargadores" },
  { id: "16", label: "Control remoto" },
];

// ─── Storage helpers ──────────────────────────────────────────────────────────

const STORAGE_KEYS = {
  template: "cabina_template",
  checked: "cabina_checked",
};

function loadTemplate(): Item[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.template);
    return raw ? JSON.parse(raw) : DEFAULT_TEMPLATE;
  } catch {
    return DEFAULT_TEMPLATE;
  }
}

function loadChecked(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.checked);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [editMode, setEditMode] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState("");
  const [mounted, setMounted] = useState(false);
  const [showReset, setShowReset] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setItems(loadTemplate());
    setChecked(loadChecked());
    setMounted(true);
  }, []);

  // Persist template
  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEYS.template, JSON.stringify(items));
    }
  }, [items, mounted]);

  // Persist checked
  useEffect(() => {
    if (mounted) {
      localStorage.setItem(
        STORAGE_KEYS.checked,
        JSON.stringify(Array.from(checked))
      );
    }
  }, [checked, mounted]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  function toggleItem(id: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function resetChecks() {
    setChecked(new Set());
    setShowReset(false);
  }

  function addItem() {
    const label = newLabel.trim();
    if (!label) return;
    const id = Date.now().toString();
    setItems((prev) => [...prev, { id, label }]);
    setNewLabel("");
  }

  function deleteItem(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
    setChecked((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }

  function startEditing(item: Item) {
    setEditingId(item.id);
    setEditingLabel(item.label);
  }

  function saveEdit() {
    const label = editingLabel.trim();
    if (!label || !editingId) return;
    setItems((prev) =>
      prev.map((item) =>
        item.id === editingId ? { ...item, label } : item
      )
    );
    setEditingId(null);
  }

  // ── Derived ───────────────────────────────────────────────────────────────

  const checkedCount = items.filter((item) => checked.has(item.id)).length;
  const total = items.length;
  const progress = total === 0 ? 0 : Math.round((checkedCount / total) * 100);
  const allDone = total > 0 && checkedCount === total;

  if (!mounted) return null;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <main className="min-h-dvh flex flex-col max-w-md mx-auto px-4 pb-8">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#f5f3ff] pt-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-brand flex items-center justify-center shadow-sm">
              <Camera className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">
                Cabina Checklist
              </h1>
              <p className="text-xs text-gray-500">
                {new Date().toLocaleDateString("es-MX", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </p>
            </div>
          </div>

          <button
            onClick={() => setEditMode((v) => !v)}
            className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
              editMode
                ? "bg-brand text-white"
                : "bg-white text-brand border border-brand/30"
            }`}
          >
            {editMode ? "Listo" : "Editar lista"}
          </button>
        </div>

        {/* Progress bar */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-purple-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              {allDone ? "¡Todo listo! 🎉" : "Progreso"}
            </span>
            <span className="text-sm font-bold text-brand">
              {checkedCount} / {total}
            </span>
          </div>
          <div className="w-full bg-purple-100 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-300 ${
                allDone ? "bg-green-500" : "bg-brand"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Checklist */}
      <div className="flex flex-col gap-2 flex-1">
        {items.map((item) => {
          const isChecked = checked.has(item.id);
          const isEditing = editingId === item.id;

          return (
            <div
              key={item.id}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-all ${
                isChecked && !editMode
                  ? "bg-purple-50 border border-purple-200"
                  : "bg-white border border-gray-100 shadow-sm"
              }`}
            >
              {/* Checkbox / edit actions */}
              {editMode ? (
                <div className="flex items-center gap-2 flex-1">
                  {isEditing ? (
                    <>
                      <input
                        autoFocus
                        value={editingLabel}
                        onChange={(e) => setEditingLabel(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveEdit();
                          if (e.key === "Escape") setEditingId(null);
                        }}
                        className="flex-1 text-sm border border-brand rounded-lg px-2 py-1 outline-none"
                      />
                      <button
                        onClick={saveEdit}
                        className="text-green-600 hover:text-green-700"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="flex-1 text-sm text-gray-800">
                        {item.label}
                      </span>
                      <button
                        onClick={() => startEditing(item)}
                        className="text-gray-400 hover:text-brand"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => toggleItem(item.id)}
                  className="flex items-center gap-3 flex-1 text-left"
                >
                  {isChecked ? (
                    <CheckCircle2 className="w-6 h-6 text-brand flex-shrink-0" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-300 flex-shrink-0" />
                  )}
                  <span
                    className={`text-sm font-medium transition-colors ${
                      isChecked ? "text-brand line-through" : "text-gray-800"
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              )}
            </div>
          );
        })}

        {/* Add item form (edit mode) */}
        {editMode && (
          <div className="flex gap-2 mt-1">
            <input
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addItem()}
              placeholder="Nuevo item..."
              className="flex-1 text-sm border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-brand bg-white"
            />
            <button
              onClick={addItem}
              disabled={!newLabel.trim()}
              className="w-12 h-12 rounded-xl bg-brand text-white flex items-center justify-center disabled:opacity-40 flex-shrink-0"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Reset button */}
      {!editMode && (
        <div className="sticky bottom-0 pt-4 pb-2">
          {showReset ? (
            <div className="bg-white border border-red-200 rounded-2xl p-4 shadow-lg">
              <p className="text-sm text-gray-700 text-center mb-3">
                ¿Reiniciar todos los checks para el próximo evento?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowReset(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={resetChecks}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium"
                >
                  Sí, reiniciar
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowReset(true)}
              className="w-full py-3.5 rounded-2xl bg-white border border-gray-200 text-sm font-medium text-gray-600 flex items-center justify-center gap-2 shadow-sm"
            >
              <RotateCcw className="w-4 h-4" />
              Reiniciar para nuevo evento
            </button>
          )}
        </div>
      )}

      {/* Empty state */}
      {items.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-16 text-gray-400">
          <ListChecks className="w-12 h-12 mb-3 opacity-40" />
          <p className="text-sm">
            No hay items en la lista.
            <br />
            Toca &quot;Editar lista&quot; para agregar.
          </p>
        </div>
      )}
    </main>
  );
}
