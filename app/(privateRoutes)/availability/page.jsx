import { getUserAvailability } from "@/actions/availability";
import { defaultAvailability } from "./data";
import AvailabilityForm from "./_components/availability-form";

const AvailabiltyPage = async () => {
  const availability = await getUserAvailability();

  return (
    <div>
      <AvailabilityForm intialData={availability || defaultAvailability} />
    </div>
  );
};

export default AvailabiltyPage;
