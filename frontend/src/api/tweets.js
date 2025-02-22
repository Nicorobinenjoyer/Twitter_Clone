const API_URL = "http://localhost:8000/tweets";

export async function fetchFeed(limit = 10) {
  try {
    const response = await fetch(`${API_URL}/feed?limit=${limit}`);
    if (!response.ok) {
      throw new Error("Error al obtener el feed");
    }
    return await response.json();
  } catch (error) {
    console.error("Error en fetchFeed:", error);
    return [];
  }
}

export async function postTweet(content, userId) {
  try {
    const response = await fetch("http://localhost:8000/tweets/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content, owner_id: userId }),
    });

    if (!response.ok) {
      throw new Error("Error al enviar el tweet");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en postTweet:", error);
    throw error;
  }
}


export const toggleLike = async (tweetId, userId) => {
  try {
      const response = await fetch(`http://localhost:8000/tweets/${tweetId}/like?user_id=${userId}`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          }
      });

      if (!response.ok) {
          throw new Error("Error al actualizar el like");
      }

      return await response.json();
  } catch (error) {
      console.error("Error en toggleLike:", error);
      throw error;
  }
};