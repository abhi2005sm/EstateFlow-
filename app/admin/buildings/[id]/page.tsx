import BuildingDetails from '@/src/features/admin/pages/BuildingDetails';

export default async function BuildingDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <BuildingDetails buildingId={resolvedParams.id} />;
}