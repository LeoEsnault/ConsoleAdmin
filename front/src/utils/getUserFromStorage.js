export const getUserFromStorage = () => {
  const authData = localStorage.getItem("sb-bglmobcpxafuydimnpft-auth-token");
  if (!authData) return null;

  try {
    return JSON.parse(authData)?.user || null;
  } catch (error) {
    console.error("Erreur de parsing du localStorage :", error);
    return null;
  }
}
