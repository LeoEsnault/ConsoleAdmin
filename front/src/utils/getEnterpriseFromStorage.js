export const getEnterpriseFromStorage = () => {
  const enterpriseData = localStorage.getItem("enterprise");
  if (!enterpriseData) return null;

  try {
    return JSON.parse(enterpriseData) || null;
  } catch (error) {
    console.error("Erreur de parsing du localStorage :", error);
    return null;
  }
}
