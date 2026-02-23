export default function Sidebar() {
  return (
    <aside className="w-64 bg-white p-4">
      <h2 className="text-lg font-bold mb-4">Filter</h2>
      <ul className="space-y-2">
        <li className="cursor-pointer hover:text-blue-600">Filter 1</li>
        <li className="cursor-pointer hover:text-blue-600">Filter 2</li>
        <li className="cursor-pointer hover:text-blue-600">Filter 3</li>
      </ul>
    </aside>
  );
}