const API_URL = "http://localhost:8000/auth/login";

export async function loginUser(email, password) {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (!response.ok) {
        throw new Error("Credenciales incorrectas");
      }
  
      const data = await response.json();

      localStorage.setItem("user", JSON.stringify(data.user));
  
      return data;
    } catch (error) {
      console.error("Error en login:", error);
      throw error;
    }
  }

export async function registerUser(userData) {
    try {
      const response = await fetch(`http://localhost:8000/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
  
      if (!response.ok) {
        throw new Error("Error en el registro");
      }
  
      return await response.json();
    } catch (error) {
      console.error("Error en registerUser:", error);
      throw error;
    }
  }