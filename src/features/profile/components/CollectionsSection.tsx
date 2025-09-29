import { HorizontalCollectionCard } from "@/components/shared/horizontal-collection-card";
import EditCollectionBottomDraw from "@/features/profile-collection/components/EditCollectionBottomDraw";
import { useNavigate, useParams } from "@tanstack/react-router";

interface CollectionsSectionProps {
  data: {
    imgs: string[];
    name: string;
    description?: string;
  }[];
}

export const CollectionsSection = ({ data }: CollectionsSectionProps) => {
  const { profileId } = useParams({
    strict: false,
  });
  const navigate = useNavigate();
  return (
    <div className="px-4 py-3">
      <div className="space-y-2">
        {data.map((item, index) => (
          <div
            key={index}
            className="py-3"
            onClick={() =>
              navigate({
                to: "/profile/$profileId/collections/$collectionId",
                params: { profileId: profileId, collectionId: item.name },
              })
            }
          >
            <HorizontalCollectionCard data={item} rightSection={<EditCollectionBottomDraw />} />
          </div>
        ))}
      </div>
    </div>
  );
};
