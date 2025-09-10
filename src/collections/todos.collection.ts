import { createCollection } from "@tanstack/react-db";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { TodoSchema, type Todo } from "@/schemas/todo.schema";
import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

export const todosCollection = createCollection(
	queryCollectionOptions({
		queryClient: queryClient,
		queryKey: ["todos"],
		queryFn: async (): Promise<Todo[]> => {
			const response = await fetch(`http://localhost:3000/api/todos`);
			const data = await response.json();
			return data.results;
		},
		getKey: (item) => item.id,
        schema: TodoSchema,
		onInsert: async ({ transaction }) => {
			const { modified: newTodo } = transaction.mutations[0];
			await fetch("http://localhost:3000/api/todos", {
				method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
				body: JSON.stringify(newTodo),
			});
		},
		onUpdate: async ({ transaction }) => {
			const { original, changes } = transaction.mutations[0];
			await fetch(`http://localhost:3000/api/todos/${original.id}`, {
				method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
				body: JSON.stringify(changes),
			});
		},
		onDelete: async ({ transaction }) => {
			const { original } = transaction.mutations[0];
			await fetch(`http://localhost:3000/api/todos/${original.id}`, { method: "DELETE" });
		},
	}),
);
