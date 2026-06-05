import Cookies from "js-cookie";
export const validateUrl = (url) => {
  try {
    const parsedUrl = new URL(url); // ✅ built-in browser/node API

    // sirf http aur https allow karo
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      throw new Error("URL must start with http or https");
    }

    return true;
  } catch (error) {
    throw new Error("Invalid URL format");
  }
};

export const getAccessToken = () => {
  return Cookies.get("accessToken") || null;
};

