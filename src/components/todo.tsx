import { useLiveQuery } from "@tanstack/react-db";
import { useForm } from "@tanstack/react-form";
import { useRef } from "react";
import { todosCollection } from "@/collections/todos.collection";
import { CreateTodoSchema, type Todo } from "@/schemas/todo.schema";
import { FieldInfo } from "./forms";
import {v4 } from "uuid"

export function TodoList() {
	const { data: todos, isLoading } = useLiveQuery((q) =>
		q
			.from({ todo: todosCollection })
			.orderBy(({ todo }) => todo.created_at, "desc"),
	);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<ul className="flex flex-col gap-4">
			{todos.map((todo) => (
				<li key={todo.id} className="w-full h-fit">
					<TodoItem todo={todo} />
				</li>
			))}
		</ul>
	);
}

export function TodoItem({ todo }: { todo: Todo }) {
	const inputRef = useRef<HTMLInputElement>(null);

	const toggleTodo = (todo: Todo) => {
		todosCollection.update(todo.id, (draft) => {
			draft.completed = draft.completed ? null : new Date();
		});
	};

	const deleteTodo = (todo: Todo) => {
		todosCollection.delete(todo.id);
	};

	return (
		<div className="flex items-center gap-4">
			<label
				htmlFor={todo.id}
				className="text-xl font-medium flex gap-4 items-center"
			>
				<input
					id={todo.id}
					ref={inputRef}
					onChange={() => toggleTodo(todo)}
					type="checkbox"
					defaultChecked={todo.completed !== null}
				/>
				{todo.title}
			</label>
			<button
				type="button"
				onClick={() => deleteTodo(todo)}
				className="bg-red-500 text-white rounded-md p-2 cursor-pointer"
			>
				Delete
			</button>
		</div>
	);
}

export function AddTodoForm() {
	const form = useForm({
		defaultValues: {
			title: "",
			description: "",
		},
		validators: {
			onChange: CreateTodoSchema,
		},
		onSubmit: async ({ value }) => {
			todosCollection.insert({
				id: v4(),
				title: value.title,
				description: null,
				completed: null,
				created_at: new Date(),
				updated_at: new Date(),
				deleted_at: null,
				url: "1"
			}, {
				metadata: {
					source: "web",
				}
			})

			form.reset();
		},
	});
	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				void form.handleSubmit();
			}}
		>
			<form.Field
				name="title"
				children={(field) => {
					return (
						<div className="flex flex-col gap-1">
							<label
								htmlFor={field.name}
								className="text-xl font-medium flex gap-4 items-center"
							>
								Title
							</label>
							<input
								id={field.name}
								name={field.name}
								type="text"
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								value={field.state.value}
								className="w-full rounded-md border-2 border-gray-300 p-2"
							/>
							<FieldInfo field={field} />
						</div>
					);
				}}
			/>
			<form.Subscribe
				selector={(state) => [state.canSubmit, state.isSubmitting]}
				children={([canSubmit, isSubmitting]) => (
					<button type="submit" disabled={!canSubmit}>
						{isSubmitting ? "..." : "Submit"}
					</button>
				)}
			/>
		</form>
	);
}
