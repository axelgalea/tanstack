import * as z from "zod";
import type { EntityTimestamps } from "@/types/entity-timestamps.type";

export const TodoSchema = z.object({
	id: z.uuidv4(),
	title: z.string(),
	description: z.string().nullable(),
	completed: z.date().nullable(),
});

export const CreateTodoSchema = z.object({
	title: z.string().min(1),
	description: z.string(),
});

export const UpdateTodoSchema = TodoSchema.partial().required({
	id: true,
});

export type Todo = z.infer<typeof TodoSchema> &
	EntityTimestamps & { url: string };
export type CreateTodo = z.infer<typeof CreateTodoSchema>;
export type UpdateTodo = z.infer<typeof UpdateTodoSchema>;
