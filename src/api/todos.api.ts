import { mutationOptions, queryOptions } from "@tanstack/react-query";
import type { CreateTodo, Todo, UpdateTodo } from "@/schemas/todo.schema";
import type { ApiPaginatedResponse } from "@/types/api-response.type";

export const todosAPI = {
	findAll: queryOptions({
		queryKey: ["todos"],
		queryFn: async (): Promise<ApiPaginatedResponse<Todo>> =>
			fetch(`http://localhost:3000/api/todos`).then((res) => res.json()),
	}),
	findOne: (id: Todo["id"]) =>
		queryOptions({
			queryKey: ["todos", id],
			queryFn: async (): Promise<Todo> =>
				fetch(`http://localhost:3000/api/todos/${id}`).then((res) =>
					res.json(),
				),
		}),
	create: mutationOptions({
		mutationFn: async (input: CreateTodo): Promise<Todo> => {
			return fetch(`http://localhost:3000/api/todos`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(input),
			}).then((res) => res.json());
		},
	}),
	update: mutationOptions({
		mutationFn: async (input: UpdateTodo): Promise<Todo> => {
			return fetch(`http://localhost:3000/api/todos/${input.id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(input),
			}).then((res) => res.json());
		},
	}),
	toggleCompleted: mutationOptions({
		mutationFn: async (id: Todo["id"]): Promise<Todo> => {
			return fetch(`http://localhost:3000/api/todos/${id}/toggle-completed`, {
				method: "PATCH",
				body: JSON.stringify({}),
			}).then((res) => res.json());
		},
	}),
	delete: mutationOptions({
		mutationFn: async (id: Todo["id"]): Promise<Todo> =>
			fetch(`http://localhost:3000/api/todos/${id}`, {
				method: "DELETE",
			}).then((res) => res.json()),
	}),
};
