"use client";

import { useEffect, useMemo, useState } from "react";
import { LoaderCircle, Plus, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { api, type TableRecord, type TableStatusValue } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

const emptyForm = {
  tableNumber: "",
  capacity: "",
  status: "AVAILABLE" as TableStatusValue,
};

export default function TableManagement() {
  const [tables, setTables] = useState<TableRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingTableId, setEditingTableId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const loadTables = async () => {
    setIsLoading(true);

    try {
      const data = await api.getTables();
      setTables(data.tables);
    } catch (error) {
      toast({
        title: "Unable to load tables",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadTables();
  }, []);

  const summary = useMemo(
    () => ({
      total: tables.length,
      available: tables.filter((table) => table.status === "AVAILABLE").length,
      reserved: tables.filter((table) => table.status === "RESERVED").length,
      occupied: tables.filter((table) => table.status === "OCCUPIED").length,
    }),
    [tables],
  );

  const startEdit = (table: TableRecord) => {
    setEditingTableId(table.id);
    setForm({
      tableNumber: String(table.tableNumber),
      capacity: String(table.capacity),
      status: table.status,
    });
  };

  const resetForm = () => {
    setEditingTableId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async () => {
    if (!form.tableNumber || !form.capacity) {
      toast({
        title: "Missing fields",
        description: "Table number and capacity are required.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const payload = {
        tableNumber: Number(form.tableNumber),
        capacity: Number(form.capacity),
        status: form.status,
      };

      if (editingTableId) {
        await api.updateTable(editingTableId, payload);
        toast({
          title: "Table updated",
          description: `Table ${form.tableNumber} was updated successfully.`,
        });
      } else {
        await api.createTable(payload);
        toast({
          title: "Table created",
          description: `Table ${form.tableNumber} was added successfully.`,
        });
      }

      resetForm();
      await loadTables();
    } catch (error) {
      toast({
        title: "Table save failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (table: TableRecord) => {
    const confirmed = window.confirm(`Delete table ${table.tableNumber}?`);

    if (!confirmed) {
      return;
    }

    try {
      await api.deleteTable(table.id);
      toast({
        title: "Table deleted",
        description: `Table ${table.tableNumber} was removed.`,
      });
      if (editingTableId === table.id) {
        resetForm();
      }
      await loadTables();
    } catch (error) {
      toast({
        title: "Table delete failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Total tables", value: summary.total },
          { label: "Available", value: summary.available },
          { label: "Reserved", value: summary.reserved },
          { label: "Occupied", value: summary.occupied },
        ].map((item) => (
          <div key={item.label} className="rounded-[1.75rem] border border-primary/10 bg-white/10 p-5 shadow-sm">
            <div className="font-sans text-[11px] uppercase tracking-[0.24em] text-muted-foreground">{item.label}</div>
            <div className="mt-3 text-4xl text-foreground">{item.value}</div>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-[2rem] border border-primary/10 bg-white/10 p-6 shadow-sm">
          <div className="font-sans text-[11px] uppercase tracking-[0.24em] text-primary/70">
            {editingTableId ? "Edit table" : "Add table"}
          </div>
          <h2 className="mt-2 text-3xl text-foreground">{editingTableId ? "Update a table" : "Create a new table"}</h2>

          <div className="mt-6 space-y-4">
            <label className="block space-y-2">
              <span className="font-sans text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Table number</span>
              <input
                type="number"
                min="1"
                value={form.tableNumber}
                onChange={(event) => setForm((current) => ({ ...current, tableNumber: event.target.value }))}
                className="w-full rounded-2xl border border-border/70 bg-background/70 px-4 py-3 font-sans text-sm text-foreground outline-none transition focus:border-primary/40"
              />
            </label>

            <label className="block space-y-2">
              <span className="font-sans text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Capacity</span>
              <input
                type="number"
                min="1"
                value={form.capacity}
                onChange={(event) => setForm((current) => ({ ...current, capacity: event.target.value }))}
                className="w-full rounded-2xl border border-border/70 bg-background/70 px-4 py-3 font-sans text-sm text-foreground outline-none transition focus:border-primary/40"
              />
            </label>

            <label className="block space-y-2">
              <span className="font-sans text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Status</span>
              <select
                value={form.status}
                onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as TableStatusValue }))}
                className="w-full rounded-2xl border border-border/70 bg-background/70 px-4 py-3 font-sans text-sm text-foreground outline-none transition focus:border-primary/40"
              >
                <option value="AVAILABLE">Available</option>
                <option value="RESERVED">Reserved</option>
                <option value="OCCUPIED">Occupied</option>
              </select>
            </label>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 font-sans text-[11px] uppercase tracking-[0.2em] text-primary-foreground transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? <LoaderCircle className="size-4 animate-spin" /> : <Plus className="size-4" />}
              {editingTableId ? "Save changes" : "Add table"}
            </button>
            {editingTableId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-full border border-border/70 bg-background/70 px-4 py-2.5 font-sans text-[11px] uppercase tracking-[0.2em] text-foreground transition hover:border-primary/25 hover:bg-primary/5"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        <div className="rounded-[2rem] border border-primary/10 bg-white/10 p-6 shadow-sm">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="font-sans text-[11px] uppercase tracking-[0.24em] text-primary/70">Table list</div>
              <h2 className="mt-2 text-3xl text-foreground">Manage dining tables</h2>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {isLoading ? (
              <div className="rounded-2xl border border-dashed border-border/70 px-6 py-10 text-center text-sm text-muted-foreground">
                <LoaderCircle className="mx-auto mb-3 size-5 animate-spin" />
                Loading tables...
              </div>
            ) : tables.length ? (
              tables.map((table) => (
                <div
                  key={table.id}
                  className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-background/50 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="text-lg text-foreground">Table {table.tableNumber}</div>
                      <Badge variant="secondary" className="capitalize">
                        {table.status}
                      </Badge>
                    </div>
                    <div className="font-sans text-sm text-muted-foreground">{table.capacity} seats</div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(table)}
                      className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background px-4 py-2 font-sans text-[11px] uppercase tracking-[0.2em] transition hover:border-primary/25 hover:bg-primary/5"
                    >
                      <Pencil className="size-4" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(table)}
                      className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 font-sans text-[11px] uppercase tracking-[0.2em] text-red-300 transition hover:bg-red-500/20"
                    >
                      <Trash2 className="size-4" />
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-border/70 px-6 py-10 text-center text-sm text-muted-foreground">
                No tables have been created yet.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
