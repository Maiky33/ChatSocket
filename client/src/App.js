
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import RegisterUser from "./pages/ReagisterPage";
import ProfileClass from "./pages/ProfileClass";
import { AuthProvider } from "./context/AuthContext";
import { MessageProvider } from "./context/MessageContext";
import ProtectedRoute from "./pages/ProtectedRoute";
 
function App() {

  return (
    <AuthProvider>  
      <MessageProvider> 
        <BrowserRouter> 
          <Routes>  
            <Route path="/" element={<RegisterUser/>}/>

            <Route element={<ProtectedRoute/>}> 
              <Route path="/profileclass" element={<ProfileClass/>}/>
            </Route>
          </Routes>
        </BrowserRouter>
      </MessageProvider>
    </AuthProvider>
  );
}

export default App;
