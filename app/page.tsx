/* eslint-disable @typescript-eslint/no-unused-vars */
import Hero from '../components/Hero';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import ServicesHeader from '../components/ServicesHeader';
import {UserService, Profile} from '@/types/userService' 
import {getServices, getServiceByCategory} from '@/lib/services'

export default async function HomePage({ searchParams }: { searchParams: Promise<{ filters?: string }> }) {

  const { filters: filtersParam } = await searchParams;
  const filters = filtersParam?.split(",").filter(Boolean) ?? [];  

  const services: UserService[] = await getServiceByCategory(filters);

  return (
    <div className="w-full pb-5">
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
                      category={card.category}
                      />
                ))}            
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}