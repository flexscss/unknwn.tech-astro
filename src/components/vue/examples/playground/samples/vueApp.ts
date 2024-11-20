export default {
  htmlCode: `
<script src="https://cdn.tailwindcss.com"></script>
<div id="app"></div>
	`,
  cssCode: `
html, body {
	background: none;
}
	`,
  jcCode: `
import { createApp, ref, computed } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js"
const todoComponent = {
	setup() {
		const todos = ref([])
		const newTodo = ref("")
		const filter = ref("all") // 'all', 'active', 'completed'
		
		const filteredTodos = computed(() => {
			switch(filter.value) {
				case "active":
					return todos.value.filter(todo => !todo.completed)
				case "completed":
					return todos.value.filter(todo => todo.completed)
				default:
					return todos.value
			}
		})

		const addTodo = () => {
			if (newTodo.value.trim()) {
				todos.value.push({
					id: Date.now(),
					text: newTodo.value.trim(),
					completed: false,
					timestamp: new Date().toLocaleString()
				})
				newTodo.value = ""
			}
		}

		const toggleComplete = (todo) => {
			todo.completed = !todo.completed
		}

		const deleteTodo = (id) => {
			todos.value = todos.value.filter(todo => todo.id !== id)
		}

		const clearCompleted = () => {
			todos.value = todos.value.filter(todo => !todo.completed)
		}

		const remainingTodos = computed(() => {
			return todos.value.filter(todo => !todo.completed).length
		})

		return {
			todos,
			newTodo,
			filter,
			filteredTodos,
			addTodo,
			toggleComplete,
			deleteTodo,
			clearCompleted,
			remainingTodos
		}
	},
	template: \`
		<div class="max-w-2xl mx-auto p-6 bg-gray-800 rounded-xl shadow-2xl">
			<h2 class="text-3xl font-bold mb-6 text-purple-400 text-center">Task Master</h2>
			
			<!-- Input Section -->
			<div class="flex mb-6 gap-2">
				<input 
					v-model="newTodo" 
					@keyup.enter="addTodo" 
					class="w-full px-4 py-3 bg-gray-700 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
					placeholder="What needs to be done?"
				/>
				<button 
					@click="addTodo" 
					class="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
				>
					Add
				</button>
			</div>

			<!-- Filters -->
			<div class="flex justify-center space-x-4 mb-6">
				<button 
					v-for="option in ['all', 'active', 'completed']"
					@click="filter = option"
					:key="option"
					:class="[
						'px-4 py-2 rounded-lg capitalize transition-colors duration-200',
						filter === option 
							? 'bg-purple-600 text-white' 
							: 'bg-gray-700 text-gray-300 hover:bg-gray-600'
					]"
				>
					{{ option }}
				</button>
			</div>

			<!-- Todo List -->
			<div class="space-y-3">
				<div 
					v-for="todo in filteredTodos" 
					:key="todo.id" 
					class="group flex items-center justify-between p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200"
				>
					<div class="flex items-center space-x-3">
						<input 
							type="checkbox" 
							:checked="todo.completed"
							@change="toggleComplete(todo)"
							class="w-5 h-5 rounded-full border-2 border-purple-500 focus:ring-purple-500"
						/>
						<div>
							<span 
								:class="['text-gray-100', todo.completed ? 'line-through text-gray-400' : '']"
							>
								{{ todo.text }}
							</span>
							<div class="text-xs text-gray-400">{{ todo.timestamp }}</div>
						</div>
					</div>
					
					<button 
						@click="deleteTodo(todo.id)"
						class="opacity-0 group-hover:opacity-100 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200"
					>
						Delete
					</button>
				</div>
			</div>

			<!-- Footer -->
			<div class="mt-6 flex justify-between items-center text-gray-400">
				<span>{{ remainingTodos }} items left</span>
				<button 
					@click="clearCompleted"
					class="text-purple-400 hover:text-purple-300 transition-colors duration-200"
				>
					Clear completed
				</button>
			</div>
		</div>
	\`
}

createApp({
	components: { todoComponent },
	setup() {
		const message = ref("Organize Your Day")
		return { message }
	},
	template: \`
		<div class="min-h-screen flex items-center justify-center bg-gray-900 p-4">
			<div class="w-full">
				<h1 class="text-4xl font-bold mb-8 text-center text-white">{{ message }}</h1>
				<todo-component></todo-component>
			</div>
		</div>
	\`
}).mount("#app")
	`
}
