import { useState } from "react";
import { likeTweet, commentOnTweet } from "../api/tweets";

export default function Tweet({ tweet }) {
  console.log("Tweet recibido en componente:", tweet);

  const [likes, setLikes] = useState(tweet.data?.likes || 0);
  const [comments, setComments] = useState(tweet.comments || []);
  const [newComment, setNewComment] = useState("");

  const handleLike = async () => {
    if (!tweet.data?.id) {
      console.error("Error: El tweet no tiene ID válido.");
      return;
    }

    try {
      const data = await likeTweet(tweet.data.id);
      if (data && data.likes !== undefined) {
        setLikes(data.likes);
      }
    } catch (error) {
      console.error("Error al dar like:", error);
    }
  };

  const handleComment = async () => {
    if (!newComment.trim()) return;

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      alert("Debes iniciar sesión para comentar.");
      return;
    }

    try {
      const comment = await commentOnTweet(tweet.data.id, newComment, storedUser.id);
      setComments([...comments, comment]);
      setNewComment("");
    } catch (error) {
      console.error("Error al comentar:", error);
    }
  };

  return (
    <div className="border p-4 rounded bg-white shadow mb-4">
      <p className="text-gray-800">{tweet.data?.content}</p> {}
      <div className="mt-2 flex items-center">
        <button
          onClick={handleLike}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700 mr-2"
        >
          ❤️ {likes}
        </button>

        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Escribe un comentario..."
          className="border p-1 rounded w-full text-sm"
        />
        <button
          onClick={handleComment}
          className="ml-2 bg-green-500 text-white px-2 py-1 rounded hover:bg-green-700"
        >
          Comentar
        </button>
      </div>

      {comments.length > 0 && (
        <div className="mt-3">
          <h3 className="text-sm font-semibold text-gray-700">Comentarios:</h3>
          {comments.map((comment, index) => (
            <p key={index} className="text-gray-600 text-sm mt-1">
              🗨️ {comment.content}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
