import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, Calendar, Clock, LinkIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const features = [
    {
      icon: Calendar,
      title: "Create Events",
      description: "Easily set up and customize your event types",
    },
    {
      icon: Clock,
      title: "Manage Availability",
      description: "Define your availability to streamline scheduling",
    },
    {
      icon: LinkIcon,
      title: "Custom Links",
      description: "Share your personalized scheduling link",
    },
  ];

  const howItWorks = [
    { step: "Sign Up", description: "Create your free Schedulrr account" },
    {
      step: "Set Availability",
      description: "Define when you're available for meetings",
    },
    {
      step: "Share Your Link",
      description: "Send your scheduling link to clients or colleagues",
    },
    {
      step: "Get Booked",
      description: "Receive confirmations for new appointments automatically",
    },
  ];

  return (
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
          <Link href="/dashboard">
            <Button size="lg" className="text-lg">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
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
      <div className="mb-24">
        <h2 className="text-3xl text-center font-bold mb-12 text-blue-600">
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            return (
              <Card key={index}>
                <CardHeader>
                  <feature.icon className="w-12 h-12 text-blue-500 mb-4 mx-auto" />
                  <CardTitle className="text-center text-blue-600">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-gray-600">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </main>
  );
}
