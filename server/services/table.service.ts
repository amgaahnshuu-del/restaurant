import { tableRepository } from "@server/repositories/table.repository";
import { prisma } from "@/lib/prisma";
import { ConflictError, NotFoundError } from "@/lib/errors";
import type { CreateTableInput, UpdateTableInput } from "@/lib/schemas";

export const tableService = {
  async getAll() {
    return tableRepository.findAll();
  },

  async getAllWithAvailability(date?: string, time?: string) {
    const tables = await tableRepository.findAll();

    if (!date || !time) {
      const enriched = tables.map((t) => ({
        ...t,
        capacity_label: `${t.capacity} guests`,
        availableForRequestedSlot: t.status === "AVAILABLE",
        reservedTimes: [] as string[],
      }));
      return {
        tables: enriched,
        availableTableIds: enriched.filter((t) => t.availableForRequestedSlot).map((t) => t.id),
        requestedSlot: null as string | null,
      };
    }

    const [h, m] = time.split(":").map(Number);
    const slotStart = new Date(
      `${date}T${String(h).padStart(2, "0")}:${String(m ?? 0).padStart(2, "0")}:00.000Z`,
    );
    const slotEnd = new Date(slotStart.getTime() + 2 * 3_600_000);

    const overlapping = await prisma.reservation.findMany({
      where: {
        status: { notIn: ["CANCELLED"] },
        startTime: { lt: slotEnd },
        endTime: { gt: slotStart },
      },
      select: { tableId: true, startTime: true },
    });

    const byTable = new Map<string, string[]>();
    for (const r of overlapping) {
      const hh = String(r.startTime.getUTCHours()).padStart(2, "0");
      const mm = String(r.startTime.getUTCMinutes()).padStart(2, "0");
      const list = byTable.get(r.tableId) ?? [];
      list.push(`${hh}:${mm}`);
      byTable.set(r.tableId, list);
    }

    const enriched = tables.map((t) => ({
      ...t,
      capacity_label: `${t.capacity} guests`,
      availableForRequestedSlot: !byTable.has(t.id),
      reservedTimes: byTable.get(t.id) ?? [],
    }));

    return {
      tables: enriched,
      availableTableIds: enriched.filter((t) => t.availableForRequestedSlot).map((t) => t.id),
      requestedSlot: slotStart.toISOString(),
    };
  },

  async getById(id: string) {
    const table = await tableRepository.findById(id);
    if (!table) throw new NotFoundError("Table");
    return table;
  },

  async create(input: CreateTableInput) {
    const existing = await tableRepository.findByNumber(input.tableNumber);
    if (existing) throw new ConflictError(`Table number ${input.tableNumber} already exists`);

    return tableRepository.create({
      tableNumber: input.tableNumber,
      capacity: input.capacity,
      status: input.status,
    });
  },

  async update(id: string, input: UpdateTableInput) {
    const table = await tableRepository.findById(id);
    if (!table) throw new NotFoundError("Table");

    if (input.tableNumber !== undefined && input.tableNumber !== table.tableNumber) {
      const conflict = await tableRepository.findByNumber(input.tableNumber);
      if (conflict) throw new ConflictError(`Table number ${input.tableNumber} already exists`);
    }

    return tableRepository.update(id, input);
  },

  async delete(id: string) {
    const table = await tableRepository.findById(id);
    if (!table) throw new NotFoundError("Table");

    try {
      await tableRepository.delete(id);
    } catch (err: unknown) {
      if ((err as { code?: string }).code === "P2003") {
        throw new ConflictError("Cannot delete a table that has existing reservations");
      }
      throw err;
    }
  },
};
