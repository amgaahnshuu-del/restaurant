import bcrypt from "bcryptjs";
import { signToken } from "@/lib/jwt";
import { ConflictError, UnauthorizedError } from "@/lib/errors";
import { userRepository } from "@server/repositories/user.repository";
import type { LoginInput, RegisterInput } from "@/lib/schemas";

const BCRYPT_ROUNDS = 10;

export const authService = {
  async register(input: RegisterInput) {
    const email = input.email.toLowerCase().trim();

    const exists = await userRepository.exists(email);
    if (exists) throw new ConflictError("An account with that email already exists");

    const hashed = await bcrypt.hash(input.password, BCRYPT_ROUNDS);

    const user = await userRepository.create({
      name: input.name.trim(),
      email,
      password: hashed,
      role: "CUSTOMER",
    });

    const token = await signToken({ userId: user.id, email: user.email, role: user.role });

    return { user, token };
  },

  async login(input: LoginInput) {
    const email = input.email.toLowerCase().trim();

    const user = await userRepository.findByEmail(email);
    if (!user) throw new UnauthorizedError("Invalid email or password");

    const valid = await bcrypt.compare(input.password, user.password);
    if (!valid) throw new UnauthorizedError("Invalid email or password");

    const token = await signToken({ userId: user.id, email: user.email, role: user.role });

    return {
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token,
    };
  },

  async me(userId: string) {
    const user = await userRepository.findByIdSafe(userId);
    if (!user) throw new UnauthorizedError("User not found");
    return user;
  },
};
