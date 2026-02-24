import { UserService } from "@/types/userService";

type CardProps = {
  name : string
  description : string
  price : number
} ;

export default function Card({ name, description, price}: CardProps) {
  return (
    
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-bold mb-2">{name}</h3>
      <p className="text-gray-700">{description}</p>
    </div>
  );
}