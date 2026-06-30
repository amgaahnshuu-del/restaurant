import bcrypt from "bcryptjs";
import type { UserRole } from "@prisma/client";
import { userRepository } from "@server/repositories/user.repository";
import { ConflictError, ForbiddenError, NotFoundError, ValidationError } from "@/lib/errors";
import type { CreateStaffInput, UserListQuery } from "@/lib/schemas";

export const userService = {
  async getAll(query: UserListQuery) {
    return userRepository.findAll({
      role: query.role,
      search: query.search,
      page: query.page,
      limit: query.limit,
    });
  },

  async getById(id: string) {
    const user = await userRepository.findByIdSafe(id);
    if (!user) throw new NotFoundError("User");
    return user;
  },

  async createStaff(input: CreateStaffInput) {
    const exists = await userRepository.exists(input.email.toLowerCase().trim());
    if (exists) throw new ConflictError("Email is already in use");

    const hashed = await bcrypt.hash(input.password, 10);
    return userRepository.create({
      name: input.name.trim(),
      email: input.email.toLowerCase().trim(),
      password: hashed,
      role: "STAFF",
    });
  },

  async updateRole(id: string, role: UserRole, requestingUserId: string) {
    if (id === requestingUserId) {
      throw new ForbiddenError("Cannot change your own role");
    }
    const user = await userRepository.findByIdSafe(id);
    if (!user) throw new NotFoundError("User");
    return userRepository.updateRole(id, role);
  },

  async delete(id: string, requestingUserId: string) {
    if (id === requestingUserId) {
      throw new ValidationError("Cannot delete your own account");
    }
    const user = await userRepository.findByIdSafe(id);
    if (!user) throw new NotFoundError("User");
    await userRepository.delete(id);
  },
};
