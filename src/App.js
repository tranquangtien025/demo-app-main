import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { NotFound } from './containers/notFound';
import { CreateToDo } from './containers/todo/create';
import { ListOfTodo } from './containers/todo/list';

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/edit/:id" element={<CreateToDo />} exact />
          <Route path="/create" element={<CreateToDo />} exact />
          <Route path="/" element={<ListOfTodo/>} exact/>
          <Route element={<NotFound/>} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
