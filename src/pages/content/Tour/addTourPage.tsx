import { useState } from "react";
import { tourService } from "@/features/tours/services/tourService";

// En tu AddTourPage
// eslint-disable-next-line react-hooks/rules-of-hooks
const [formData, setFormData] = useState({
  name: "",
  description: "",
  price: 0,
  category: "adventure",
  siteId: "tu-guid-fijo-para-pruebas", // Usa uno que exista en tu DB
  isActive: true,
  seoTitle: "",
  seoDescription: "",
  slug: ""
});

const handleSave = async () => {
  try {
    console.log("Enviando datos...", formData);
    const result = await tourService.create(formData);
    alert("Tour guardado en Postgres con ID: " + result.id);
  } catch (error) {
    console.error("Error al guardar:", error);
  }
};