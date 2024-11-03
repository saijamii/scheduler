import { getUserAvailability } from "@/actions/availability";
import { defaultAvailability } from "./data";
import AvailabilityForm from "./_components/availability-form";

const AvailabiltyPage = async () => {
  const availability = await getUserAvailability();

  return (
    <div>
      <AvailabilityForm initialData={availability || defaultAvailability} />
    </div>
  );
};

export default AvailabiltyPage;
