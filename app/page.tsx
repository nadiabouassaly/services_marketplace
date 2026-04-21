/* eslint-disable @typescript-eslint/no-unused-vars */
import AuthModal from "./auth/components/AuthModal";
import Hero from '../components/Hero';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import ServicesHeader from '../components/ServicesHeader';
import {getServiceByCategory} from '@/lib/services'
import Pagination from '../components/Pagination' ;
import { Suspense} from 'react';
import IsVisitorComponent from "@/components/IsVisitorComponent";

export default async function HomePage({searchParams}: {searchParams: Promise<{ filters?: string; page?: string; maxPrice?: string, search?: string}>}) {
  
  const resolvedParams = await searchParams;
  
  const filtersParam = resolvedParams.filters;
  const filters = filtersParam?.split(",").filter(Boolean) ?? [];
  const page = Number(resolvedParams.page) || 1;
  const priceParam = resolvedParams.maxPrice ? Number(resolvedParams.maxPrice) : 100;
  const search = resolvedParams.search ?? ""
  
  const { services, totalPages } = await getServiceByCategory(filters, page, priceParam, search);

  const numOfPages = Math.ceil(totalPages / 18);

  return (
    <Suspense fallback={<div>Loading...</div>}>
    <div className="w-full pb-5">
      {/* Hero section */}
      <Hero />

      {/* Outer container matches navbar width */}
      <div className="w-full flex justify-center mt-6">
        <div className="max-w-7xl w-full px-4 flex gap-6">

          <div className="max-w-7xl w-full px-4 flex gap-6 items-start"> {/* add items-start */}
          {/* Sidebar */}
          <div className="sticky top-[90px]"> 
          <Sidebar />
          </div>
          <Suspense fallback={<div>Loading services...</div>}>

          {/* Cards */}
          <div className="flex-1">

            <ServicesHeader count={totalPages} />
        
            {totalPages >= 1 && <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
              {services.map((card) => (
                <Card
                  key={card.services_id}
                  id={card.services_id.toString()}
                  name={card.name}
                  price={card.price}
                  description={card.description}
                  category={card.category}
                  editing={false}
                  image={card.images?.[0]?.file_path}
                />
                ))}            
            </div>}
            <Pagination props = {numOfPages} />
          </div>
          </Suspense>
        </div>
        </div>
      </div>
    </div>
    <IsVisitorComponent />
    </Suspense>
  );
}