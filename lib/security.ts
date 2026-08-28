import toast from "react-hot-toast";

export async function confirmWithCode(): Promise<boolean> {
  const code = prompt("Enter security code:");
  if (code === "Alibaba12345@") {
    return true;
  } else {
    toast.error("Incorrect code. Deletion cancelled.");
    return false;
  }
}