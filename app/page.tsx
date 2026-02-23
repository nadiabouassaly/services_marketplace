import Sidebar from '../components/Sidebar';
import Card from '../components/Card';

export default function HomePage() {
  return (
    // Outer container matches navbar width
    <div className="w-full flex justify-center mt-6">
      <div className="max-w-7xl w-full px-4 flex gap-6">
        <Sidebar />
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card title="Dog Walking" description="We walk your dog safely." />
          <Card title="Tutoring" description="Math, Science, Languages." />
          <Card title="Elderly Care" description="Compassionate care for loved ones." />
          <Card title="Service 4" description="Description of service 4" />
          <Card title="Service 5" description="Description of service 5" />
        </div>
      </div>
    </div>
  );
}