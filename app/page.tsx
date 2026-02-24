/* eslint-disable @typescript-eslint/no-unused-vars */
import Hero from '../components/Hero';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import ServicesHeader from '../components/ServicesHeader';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {UserService, Profile} from '@/types/userService' 
import {getServices, getServiceByCategory} from '@/lib/services'

const services: UserService[] = await getServices() ;

export default function HomePage() {
  return (
    <div className="w-full">
      {/* Hero section */}
      <Hero />

      {/* Outer container matches navbar width */}
      <div className="w-full flex justify-center mt-6">
        <div className="max-w-7xl w-full px-4 flex gap-6">
          {/* Sidebar */}
          <Sidebar />

          {/* Cards */}
          <div className="flex-1">
            <ServicesHeader count={services.length} />
        
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((card) => (
                <Card key={card.services_id}
                      name = {card.name}
                      price = {card.price}
                      description={card.description}
                      />
                ))}            
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}