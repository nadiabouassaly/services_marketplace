/* eslint-disable @typescript-eslint/no-unused-vars */
type CardProps = {
  name : string
  description : string
  price : number
} ;

export default function Card({ name, description, price}: CardProps) {
  return (
    
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow flex flex-col">
      <h3 className="text-lg font-bold mb-2">{name}</h3>
      <p className="text-gray-700">{description}</p>
      <p className="mt-auto text-right text-green-600 font-bold">${price}</p>
    </div>
  );
}
