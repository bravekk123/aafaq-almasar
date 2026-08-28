import { notFound } from "next/navigation";
import { sectorsData } from "../sectorsData";
import SectorContent from "./SectorContent";

export async function generateStaticParams() {
  return sectorsData.map((sector) => ({
    sectorId: sector.id,
  }));
}

interface SectorPageProps {
  params: Promise<{
    sectorId: string;
  }>;
}

export default async function SectorPage({
  params,
}: SectorPageProps) {
  const { sectorId } = await params;

  const sector = sectorsData.find(
    (s) => s.id === sectorId
  );

  if (!sector) {
    notFound();
  }

  return <SectorContent sector={sector} />;
}