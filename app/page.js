import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <main className="container mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-12 mb-24">
          <div className="lg:w-1/2">
            <div>
              <h1 className="text-7xl font-extrabold pb-6 gradient-title">
                Simplify Your Scheduling{" "}
              </h1>

              <p className="text-xl text-gray-600 mb-10">
                Schedulrr helps you manage your time effectively. Create events,
                set your availability, and let others book time with you
                seamlessly.
              </p>
            </div>
          </div>

          <div className="flex lg:w-1/2 justify-center">
            <div className="relative w-full max-w-md aspect-square">
              <Image
                alt="poster"
                src="/poster.png"
                layout="fill"
                objectFit="contain"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
