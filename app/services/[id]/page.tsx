import { getServicesById } from "@/lib/services";
import { timeAgo } from "@/lib/services";
import { UUID } from "crypto";
import { FaUser } from "react-icons/fa";
import styles from "./page.module.css";
import ImageCarousel from "@/components/ImageCarousel";
import { image } from "@/types/userService";
import { getImages } from "@/lib/images";
type PageProps = {
    params : Promise<{ id: UUID }>;
}

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
                <div  className={styles.price}>  ${service.price}</div>
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