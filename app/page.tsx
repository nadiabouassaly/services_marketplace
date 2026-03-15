/* eslint-disable @typescript-eslint/no-unused-vars */
import Hero from '../components/Hero';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import ServicesHeader from '../components/ServicesHeader';
import {UserService, Profile} from '@/types/userService' 
import {getServiceByCategory} from '@/lib/services'
import Pagination from '../components/Pagination' ;
import { Suspense } from 'react';

export default async function HomePage({ searchParams }: { searchParams: Promise<{ filters?: string ; page?:string}> }) {

  const { filters: filtersParam } = await searchParams;
  const filters = filtersParam?.split(",").filter(Boolean) ?? [];  
  const page = Number((await searchParams).page) || 1

  const {services, totalPages} = await getServiceByCategory(filters, page);

  const numOfPages = Math.ceil(totalPages/12)
  
  return (
    <div className="w-full pb-5">
      {/* Hero section */}
      <Hero />

      {/* Outer container matches navbar width */}
      <div className="w-full flex justify-center mt-6">
        <div className="max-w-7xl w-full px-4 flex gap-6">
          {/* Sidebar */}
          <Sidebar />

          <Suspense fallback={<div>Loading services...</div>}>

          {/* Cards */}
          <div className="flex-1">
            <ServicesHeader count={totalPages} />
        
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
            <Pagination props = {numOfPages} />
          </div>
          </Suspense>
        </div>
      </div>
    </div>
  );
}