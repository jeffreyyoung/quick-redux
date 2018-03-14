const todoModule = {
  defaultState: {
    todos: [],
    loading: false
  },
  actions: { //the action creators of these actions are prefixed with the module key, so they are scoped to the todoModule
    addTodo(state, todo) {
      state.todos.push(todo)
    },
    removeTodo(state, index) {
      state.todos = state.todos.splice(index, 1);
    },
    setLoading(state, loading) {
      state.loading = loading;
    }
  },
  globalActions: { //these actions are not prefixed, so if you call reset on any module, this action handler will be run
    reset(state) {
      state.todos = [];
      state.loading = false;
    }
  },
  asyncActions: {
    async loadTodos({actions, api}) {
      const todos = await api.loadTodos();
      todos.forEach(todo => actions.addTodo(todo));
    }
  },
  key: 'todoList'
};

export default todoModule;