import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { todosAPI } from "@/api/todos.api";
import { CreateTodoSchema, type Todo } from "@/schemas/todo.schema";
import { Spinner } from "./spinner";

export function TodoList() {
	const { data, isPending, error } = useQuery(todosAPI.findAll);

	if (isPending) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error {error.message}</div>;
	}

	return (
		<ul className="flex flex-col gap-4">
			{data.results.map((todo) => (
				<li key={todo.id} className="w-full h-fit">
					<TodoItem todo={todo} />
				</li>
			))}
		</ul>
	);
}

export function TodoItem({ todo }: { todo: Todo }) {
	const inputRef = useRef<HTMLInputElement>(null);
	const queryClient = useQueryClient();

	const { mutate: toggleCompleted, isPending } = useMutation({
		mutationFn: todosAPI.toggleCompleted.mutationFn,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [todosAPI.findAll.queryKey],
			});
		},
		onError: () => {
			alert("Something went wrong");
			inputRef.current!.checked = !inputRef.current!.checked;
		},
	});

	return (
		<div className="flex items-center gap-4">
			<label
				htmlFor={todo.id}
				className="text-xl font-medium flex gap-4 items-center"
			>
				<input
					id={todo.id}
					ref={inputRef}
					onChange={() => toggleCompleted(todo.id)}
					type="checkbox"
					defaultChecked={todo.completed !== null}
				/>
				{todo.title}
			</label>
			{isPending ? <Spinner className="w-4 h-4 fill-white" /> : null}
		</div>
	);
}

export function AddTodoForm() {
	const queryClient = useQueryClient();
	const { mutate: createTodo } = useMutation({
		mutationFn: todosAPI.create.mutationFn,
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: todosAPI.findAll.queryKey,
			});
		},
		onError: (error) => {
			console.log(error);
		},
	});

	const form = useForm({
		defaultValues: {
			title: "",
			description: "",
		},
		validators: {
			onChange: CreateTodoSchema,
		},
		onSubmit: async ({ value }) => {
			createTodo(value, {
				onSuccess: () => {
					form.reset();
				},
			});
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
							{field.state.meta.errors.length > 0 ? (
								<em className="text-red-500 text-sm font-semibold">
									{field.state.meta.errors[0]?.message}
								</em>
							) : null}
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
