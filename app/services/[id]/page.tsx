import { getServicesById } from "@/lib/services";
import { getImagesByServiceId } from "@/lib/images";
import { UUID } from "crypto";
import ServiceClient from "./ServiceClient";

type PageProps = {
  params: Promise<{ id: UUID }>;
};

export default async function ServicePage({ params }: PageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const service = await getServicesById(id);

  if (!service) return <p>Service Not Found :(</p>;

  const images = await getImagesByServiceId(service.services_id);

  return <ServiceClient service={service} images={images} />;
}