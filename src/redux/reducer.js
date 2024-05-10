const initialState = {
    load: false,
    lang: localStorage.getItem('kflang') != null ? localStorage.getItem('kflang') : 'th',
    dark: false,
    currentPage: 'Loading'
  };
  
  function Reducer(state = initialState, action) {
    switch(action.type) {
      case 'SET_MAINLOAD':
        return { ...state, load: action.val };
      case 'SET_LANG':
        return { ...state, lang: action.val };
      case 'SET_DARK':
        return { ...state, dark: action.val };
      case 'SET_PAGE':
        return { ...state, currentPage: action.val };
      default:
        return state;
    }
  }
  
  export default Reducer;
  