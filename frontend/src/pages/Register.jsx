import { useState } from "react";
import { registerUser } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const userData = { name, email, password };
      await registerUser(userData);
      alert("Registro exitoso 🎉. Redirigiendo al login...");
      navigate("/login");
    } catch (error) {
      setError("No se pudo completar el registro. Intenta con otro correo.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-blue-600">Registro</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form className="mt-4" onSubmit={handleRegister}>
          <div>
            <label className="block text-gray-700">Nombre</label>
            <input
              type="text"
              className="w-full p-2 mt-1 border rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mt-3">
            <label className="block text-gray-700">Correo Electrónico</label>
            <input
              type="email"
              className="w-full p-2 mt-1 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mt-3">
            <label className="block text-gray-700">Contraseña</label>
            <input
              type="password"
              className="w-full p-2 mt-1 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full mt-4 bg-green-600 text-white p-2 rounded hover:bg-green-700"
          >
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
}
