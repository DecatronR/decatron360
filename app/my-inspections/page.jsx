import MyInspections from "@/components/Inspection/MyInspections";

const inspectionsData = [
  {
    id: 1,
    title: "Beautiful Family Home",
    description:
      "A beautiful 4 bedroom house located in the heart of the city.",
    inspectionDate: new Date("2024-10-15T14:00:00"),
  },
  {
    id: 2,
    title: "Modern Apartment",
    description: "A spacious apartment in downtown with stunning views.",
    inspectionDate: new Date("2024-10-10T10:00:00"),
  },
  {
    id: 3,
    title: "Cozy Cottage",
    description:
      "A cozy cottage in the countryside, perfect for family getaways.",
    inspectionDate: new Date("2024-10-20T16:00:00"),
  },
  // Add more inspection objects as needed
];

const MyInspectionPage = () => {
  // Sort inspections by date, closest first
  const sortedInspections = inspectionsData.sort(
    (a, b) => a.inspectionDate - b.inspectionDate
  );

  return (
    <section className="bg-blue-50 min-h-screen flex items-center">
      <div className="container mx-auto max-w-3xl p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">My Inspections</h1>
        {sortedInspections.length === 0 ? (
          <p className="text-center text-gray-600">No upcoming inspections.</p>
        ) : (
          sortedInspections.map((inspection) => (
            <MyInspections key={inspection.id} property={inspection} />
          ))
        )}
      </div>
    </section>
  );
};

export default MyInspectionPage;
