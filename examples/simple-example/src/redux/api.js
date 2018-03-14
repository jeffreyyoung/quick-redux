const api = {
  loadTodos() {
    return new Promise((resolve) => {
      resolve([{id:1, text: 'finish something'}])
    });
  }
}


export default api;