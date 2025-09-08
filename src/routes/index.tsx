import { createFileRoute } from "@tanstack/react-router";
import { AddTodoForm, TodoList } from "@/components/todo";

export const Route = createFileRoute("/")({
	component: App,
});

function App() {
	return (
		<main className="bg-slate-800 min-h-screen flex flex-col items-center gap-8 p-8  text-white">
			<header>
				<h1 className="text-4xl">Todo APP</h1>
			</header>

			<div className="flex flex-col items-center justify-center gap-4">
				<TodoList />
				<AddTodoForm />
			</div>
		</main>
	);
}
