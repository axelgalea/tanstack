import { mutationOptions, queryOptions } from "@tanstack/react-query";
import type { CreateTodo, Todo, UpdateTodo } from "@/schemas/todo.schema";
import type { ApiPaginatedResponse } from "@/types/api-response.type";

const API_URL = "http://148.113.196.207:3000/api";

export const todosAPI = {
	findAll: queryOptions({
		queryKey: ["todos"],
		queryFn: async (): Promise<ApiPaginatedResponse<Todo>> =>
			fetch(`${API_URL}/todos`).then((res) => res.json()),
	}),
	findOne: (id: Todo["id"]) =>
		queryOptions({
			queryKey: ["todos", id],
			queryFn: async (): Promise<Todo> =>
				fetch(`${API_URL}/todos/${id}`).then((res) => res.json()),
		}),
	create: mutationOptions({
		mutationFn: async (input: CreateTodo): Promise<Todo> => {
			return fetch(`${API_URL}/todos`, {
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
			return fetch(`${API_URL}/todos/${input.id}`, {
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
			return fetch(`${API_URL}/todos/${id}/toggle-completed`, {
				method: "PATCH",
				body: JSON.stringify({}),
			}).then((res) => res.json());
		},
	}),
	delete: mutationOptions({
		mutationFn: async (id: Todo["id"]): Promise<Todo> =>
			fetch(`${API_URL}/todos/${id}`, {
				method: "DELETE",
			}).then((res) => res.json()),
	}),
};
