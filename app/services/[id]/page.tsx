import { getServicesById } from "@/lib/services";
import { timeAgo } from "@/lib/services";
import { UUID } from "crypto";
import styles from "./page.module.css";
import ImageCarousel from "@/components/ImageCarousel";
import { getImages } from "@/lib/images";
import { FaMoneyBillAlt, FaLocationArrow, FaBook, FaUser, FaBroom, FaDog, FaBaby, FaCar } from 'react-icons/fa';

type PageProps = {
  params: Promise<{ id: UUID }>;
}

const categoryIcons: Record<string, React.ReactNode> = {
  'Tutoring': <FaBook />,
  'Elderly Care': <FaUser />,
  'Home Maintenance': <FaBroom />,
  'Pet Care': <FaDog />,
  'Babysitting': <FaBaby />,
  'Transportation': <FaCar />,
};

export default async function ServicePage({ params }: PageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const service = await getServicesById(id);
  const images = await getImages();

  if (!service) return <p className={styles.notFound}>Service Not Found :(</p>;

  return (
<main className="min-h-screen bg-white py-10">

{/* Same container as navbar */}
<div className="max-w-7xl mx-auto px-4">

  {/* Content stuck to left inside it */}
  <div className="max-w-4xl">

    {/* Title + Provider row */}
    <div className="flex items-start justify-between mb-8">
      <div>
        <h1 className="text-4xl font-normal text-gray-900">{service.name}</h1>
        <p className="text-xs text-gray-400 mt-1">POSTED {timeAgo(service.created_at)}</p>
      </div>
      <div className={styles.provider}>
        <div className={styles.avatar}><FaUser /></div>
        <div>
          <p className={styles.providerName}>Provider</p>
          <p className={styles.providerRole}>Information</p>
        </div>
      </div>
    </div>

    {/* Body */}
    <ImageCarousel images={images} />
    <p className={styles.description}>{service.description}</p>
    <div className={styles.infoBox}>
      <div className={styles.info}><FaMoneyBillAlt className={styles.logo}/>${service.price}</div>
      <div className={styles.info}><FaLocationArrow className={styles.logo}/>{service.location}</div>
      <div className={styles.info}><span className={styles.logo}>{categoryIcons[service.category]}</span>{service.category}</div>
    </div>
    <div className={styles.actions}>
      <button className={styles.btnSecondary}>Message</button>
      <button className={styles.btnPrimary}>Request Service</button>
    </div>

  </div>
</div>

</main>
  );
}