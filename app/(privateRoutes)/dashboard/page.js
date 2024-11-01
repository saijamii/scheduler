"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usernameSchema } from "@/app/lib/validators";
import { useEffect } from "react";

const Dashboard = () => {
  const { isLoaded, user } = useUser();
  console.log(user, "user");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(usernameSchema),
  });

  useEffect(() => {
    setValue("username", user?.username);
  }, [isLoaded]);

  const onSubmit = async (data) => {};
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>Welcome, {user?.firstName}</CardHeader>
        {/* Latest Updates */}
      </Card>
      <Card>
        <CardHeader>Your Unique Link</CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <div className="flex items-center gap-2">
                <span>{window.location.origin}</span>
                <Input {...register("username")} placeholder="username" />
              </div>
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>
            <Button>Update Username</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
