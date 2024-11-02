import { getUserAvailability } from "@/actions/availability";
import { defaultAvailability } from "./data";
import AvailabilityForm from "./_components/availability-form";

const AvailabiltyPage = async () => {
  const availability = await getUserAvailability();
  console.log(availability);

  return (
    <div>
      <AvailabilityForm intialData={availability || defaultAvailability} />
    </div>
  );
};

export default AvailabiltyPage;
