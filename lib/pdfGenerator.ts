// lib/pdfGenerator.ts
import domtoimage from "dom-to-image-more";
import { jsPDF } from "jspdf";

export async function generatePDF(component: React.ReactElement, filename: string) {
  // 1. Create a hidden container and render the component
  const { createRoot } = await import("react-dom/client");
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-9999px";
  container.style.top = "0";
  container.style.width = "210mm";
  container.style.minHeight = "297mm";
  container.style.backgroundColor = "white";
  container.style.color = "black";
  container.style.padding = "10mm";
  document.body.appendChild(container);

  const root = createRoot(container);
  root.render(component);

  // Wait for rendering and images to load
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const element = container.firstChild as HTMLElement;

  try {
    // 2. Convert the element to a PNG image
    const dataUrl = await domtoimage.toPng(element, {
      quality: 1,
      // @ts-ignore - useCORS is a valid option despite TypeScript error
      useCORS: true,
      scale: 2, // high resolution
    });

    // 3. Create a PDF and add the image
    const pdf = new jsPDF({
      unit: "mm",
      format: "a4",
      orientation: "portrait",
    });

    const imgWidth = 210; // A4 width in mm
    const imgHeight = (element.offsetHeight / element.offsetWidth) * imgWidth;
    pdf.addImage(dataUrl, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save(filename);
  } catch (error) {
    console.error("PDF generation failed:", error);
    alert("Failed to generate PDF. Please try again.");
  } finally {
    root.unmount();
    document.body.removeChild(container);
  }
}