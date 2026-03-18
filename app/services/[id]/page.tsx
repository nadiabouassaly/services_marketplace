import { getServicesById } from "@/lib/services";
import { timeAgo } from "@/lib/services";
import { UUID } from "crypto";
import { FaUser } from "react-icons/fa";
import styles from "./page.module.css";
import ImageCarousel from "@/components/ImageCarousel";
import { image } from "@/types/userService";
import { getImages } from "@/lib/images";
import { FaMoneyBillAlt } from "react-icons/fa";
import { FaLocationArrow } from "react-icons/fa";
import { FaBook, FaUser, FaBroom, FaDog, FaBaby, FaCar } from 'react-icons/fa';
type PageProps = {
    params : Promise<{ id: UUID }>;
}

const categoryIcons: Record<string, React.ReactNode> = {
  'Tutoring': <FaBook />,
  'Elderly Care': <FaUser />,
  'Home Maintenance': <FaBroom />,
  'Pet Care': <FaDog />,
  'Babysitting': <FaBaby />,
  'Transportation': <FaCar />,
};

export default async function ServicePage({params }: PageProps){
    const resolvedParams = await params;
    const id = resolvedParams.id;
 const service = await getServicesById(id);
 const images = await getImages();

 if(!service) return <p className="styles.notFound">Service Not Found :(</p>;

      return (
    <main className={styles.page}>
        
        <div className={styles.container}> 
            <div className={styles.titleBox}>
              <div className={styles.row}>
                <div  className={styles.title}>{service.name} </div>
                </div>
                <p className={styles.subtitle}>POSTED {timeAgo(service.created_at)}</p>
            </div>
        </div>
        <div className={styles.box}>
            <div className={styles.provider}>
                <div className="avatar">
                  <FaUser />
                </div>
            <div>
                <p className={styles.providerName}>Provider</p>
            <p className={styles.providerRole}>Information</p>
        </div>
        </div>
        </div>
    

        <div className={styles.container}> 
          <div className={styles.body}>
            <div>
              <ImageCarousel images = {images} />
            </div>
            <p className={styles.description}>
              {service.description}
            </p>

              <div className={styles.infoBox}>
              <div className={styles.info}><FaMoneyBillAlt className={styles.logo}/>${service.price}</div>
              <div className={styles.info}><FaLocationArrow className={styles.logo}/>{service.location}</div>
              <div className={styles.info}> <span className={styles.logo}>{categoryIcons[service.category]}</span>{service.category}</div>
            </div>

            {/* Buttons */}
            <div className={styles.actions}>
              <button className={styles.btnSecondary}>
                Message
              </button>
              <button className={styles.btnPrimary}>
                Request Service
              </button>
            </div>

          </div>
        </div>
    </main>
  );
}
