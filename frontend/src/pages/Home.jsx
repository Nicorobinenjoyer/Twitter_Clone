import { useEffect, useState } from "react";
import { fetchFeed, postTweet } from "../api/tweets";
import { useNavigate } from "react-router-dom";
import { toggleLike } from "../api/tweets";


export default function Home() {
  const [user, setUser] = useState(null);
  const [feed, setFeed] = useState([]);
  const [limit, setLimit] = useState(10);
  const [newTweet, setNewTweet] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    loadFeed();
  }, [limit]);

  const loadFeed = async () => {
    try {
      const tweets = await fetchFeed(limit);
      setFeed(tweets);
    } catch (error) {
      console.error("Error cargando el feed:", error);
    }
  };

  const handlePostTweet = async () => {
    if (!user) {
      alert("Debes iniciar sesión para twittear.");
      return;
    }

    if (newTweet.trim() === "") {
      alert("El tweet no puede estar vacío.");
      return;
    }

    try {
      setLoading(true);
      await postTweet(newTweet, user.id);
      setNewTweet("");
      loadFeed();
    } catch (error) {
      console.error("Error al twittear:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (tweetId) => {
    if (!user) {
        alert("Debes iniciar sesión para dar like.");
        return;
    }

    console.log("Intentando dar o quitar like al tweet:", tweetId);

    try {
        const response = await toggleLike(tweetId, user.id);
        console.log("Respuesta del servidor:", response);

        if (response?.message) {
            console.log("Like actualizado correctamente:", response.message);

            // *** Actualizar el estado del feed directamente ***
            setFeed((prevFeed) => {
                const newFeed = prevFeed.map((item) => {
                    if (item.data?.id === tweetId) {
                        return {
                            ...item,
                            data: {
                                ...item.data,
                                likes: Array.isArray(response.likes) ? response.likes : [],
                            },
                        };
                    }
                    return item;
                });

                // *** Agregar logs para verificar el estado ***
                console.log("Likes después de la actualización:", response.likes);
                console.log("Feed actualizado manualmente:", newFeed);

                return newFeed;
            });

        } else {
            console.warn("Respuesta inesperada al dar like:", response);
        }

    } catch (error) {
        console.error("Error al dar like:", error);
    }
};


  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  
  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="grid grid-cols-12 min-h-screen bg-black text-white w-screen">
      {/* Barra lateral izquierda */}
      <aside className="col-span-2 p-6 hidden lg:block border-r border-gray-700 min-h-screen">
        <h2 className="text-2xl font-bold mb-4">X Clone</h2>
        <ul>
          <li className="py-2 font-semibold text-lg cursor-pointer">Inicio</li>
          <li className="py-2 text-gray-400 cursor-pointer hover:text-white">Explorar</li>
          <li className="py-2 text-gray-400 cursor-pointer hover:text-white">Notificaciones</li>
          <li className="py-2 text-gray-400 cursor-pointer hover:text-white">Mensajes</li>
        </ul>
        {user ? (
          <button
            className="mt-6 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg w-full"
            onClick={handleLogout}
          >
            Cerrar Sesión
          </button>
        ) : (
          <div> {}
            <button
              className="mt-6 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg w-full"
              onClick={handleLogin}
            >
              Iniciar Sesión
            </button>
            <p className="text-white mt-4">¿No tienes una cuenta?</p>
            <button
              className="text-blue-500 hover:underline"
              onClick={() => navigate('/Register')}
            >
              Regístrate aquí
            </button>
          </div>
        )}
      </aside>

      <div className="col-span-2 hidden lg:block"></div>

      {/* Contenedor principal (Feed) */}
      <main className="col-span-5 p-4 border-x border-gray-700 min-h-screen">
        <h1 className="text-3xl font-bold border-b border-gray-700 pb-4">Inicio</h1>
        {user ? (
          <p className="mt-4 text-lg text-blue-400">Bienvenido, {user.name} 👋</p>
        ) : (
          <p className="mt-4 text-lg text-red-400">No has iniciado sesión.</p>
        )}

        {/* Sección para Twittear */}
        {user && (
          <div className="mt-6 bg-gray-900 p-4 rounded-lg shadow-md border border-gray-700">
            <textarea
              className="w-full p-2 bg-gray-800 text-white rounded-md border border-gray-600"
              placeholder="¿Qué está pasando?"
              value={newTweet}
              onChange={(e) => setNewTweet(e.target.value)}
              rows={3}
            ></textarea>
            <button
              className="mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg w-full disabled:opacity-50"
              onClick={handlePostTweet}
              disabled={loading}
            >
              {loading ? "Twitteando..." : "Twittear"}
            </button>
          </div>
        )}

        {/* Listado de Tweets */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Últimos Tweets</h2>
          {feed.length === 0 ? (
            <p className="text-gray-500">No hay tweets disponibles.</p>
          ) : (
            feed.map((item, index) => {
              if (item.type === "tweet" && item.data?.content) {
                console.log("User ID:", user?.id);
                console.log("Estado de likes del tweet:", item.data.likes);
                console.log("Tweet ID al dar like:", item.data.id);
                console.log("¿El usuario ha dado like?:", 
                    Array.isArray(item.data.likes) && item.data.likes.includes(user?.id)

                );                     
                
                return (
                  <div key={index} className="bg-gray-900 p-4 mt-4 rounded-lg shadow-md border border-gray-700">
                    <p className="text-gray-400 font-semibold">
                      {item.data.user_name ?? "Usuario desconocido"}{" "}
                      <span className="text-gray-500 text-sm">
                        • {new Date(item.data.created_at).toLocaleString()}
                      </span>
                    </p>
                    <p className="text-white">{item.data.content}</p>
                    {/* Botón de Like para Tweets */}
                    <button
                        className={`mt-2 px-4 py-2 ${
                            Array.isArray(item.data.likes) && item.data.likes.includes(user?.id)
                                ? "bg-red-500"
                                : "bg-gray-500"
                        } hover:bg-gray-600 text-white rounded-lg`}
                        onClick={() => handleLike(item.data.id)}
                    >   
                        {Array.isArray(item.data.likes) && item.data.likes.includes(user?.id) 
                            ? "Quitar Like ❤️"
                            : "Dar Like 🤍"}
                    </button>
                    <p className="text-gray-400 text-sm mt-1">
                        {item.data.likes?.length ?? 0}{" "}
                        {item.data.likes?.length === 1 ? "Like" : "Likes"}
                    </p>
                  </div>
                );
              }

              if (item.type === "retweet") {
                if (!item.original_tweet) {
                  console.warn("Retweet sin original_tweet:", item);
                  return null;
                }

                return (
                  <div key={index} className="bg-gray-900 p-4 mt-4 rounded-lg shadow-md border border-gray-700">
                    <p className="text-gray-400 font-semibold mb-2">
                      {item.user_name ?? "Usuario desconocido"}{" "}
                      <span className="text-green-400">retwitteó</span>:
                    </p>

                    <div className="bg-gray-800 p-3 rounded-lg border border-gray-600">
                      <p className="text-gray-400 font-semibold">
                        {item.original_tweet.user_name ?? "Usuario desconocido"}{" "}
                        <span className="text-gray-500 text-sm">
                          • {new Date(item.original_tweet.created_at).toLocaleString()}
                        </span>
                      </p>
                      <p className="text-white">{item.original_tweet.content}</p>
                      {/* Botón de Like para Retweets */}
                      <button
                        className={`mt-2 px-4 py-2 ${
                          item.original_tweet.likes?.includes(user?.id) ? "bg-red-500" : "bg-gray-500"
                        } hover:bg-gray-600 text-white rounded-lg`}
                        onClick={() => handleLike(item.original_tweet.id)}
                      >
                        {item.original_tweet.likes?.includes(user?.id) ? "Quitar Like ❤️" : "Dar Like 🤍"}
                      </button>
                      <p className="text-gray-400 text-sm mt-1">
                        {item.original_tweet.likes?.length ?? 0}{" "}
                        {item.original_tweet.likes?.length === 1 ? "Like" : "Likes"}
                      </p>
                    </div>
                  </div>
                );
              }

              return null;
            })
          )}

          {/* Botón para cargar más tweets */}
          <button
            className="mt-6 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg w-full"
            onClick={() => setLimit(limit + 10)}
          >
            Cargar más tweets
          </button>
        </div>
      </main>

      <div className="col-span-1 hidden lg:block"></div>

      {/* Barra lateral derecha (Tendencias) */}
      <aside className="col-span-2 p-6 hidden lg:block border-l border-gray-700 min-h-screen">
        <h2 className="text-xl font-bold">Tendencias</h2>
        <p className="text-gray-400">(En construcción... 🚧)</p>
      </aside>
    </div>
  );
}
