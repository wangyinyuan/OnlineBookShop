"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EvervaultCard } from "@/components/ui/evervault-card";
import { useUserInfo } from "@/stores/useUserInfo";
import { useUserToken } from "@/stores/useUserToken";

export default function AccountPage() {
  const setUserInfo = useUserInfo((state) => state.setUserInfo);
  const setToken = useUserToken((state) => state.setToken);
  const name = useUserInfo((state) => state.name);
  const email = useUserInfo((state) => state.email);
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );
  const router = useRouter();

  const isUserInfoEmpty = !name || !email;

  useEffect(() => {
    setUser({ name, email });
  }, [name, email]);

  const handleLogout = () => {
    setUserInfo(null);
    setToken("");
    router.push("/login");
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  if (isUserInfoEmpty) {
    return (
      <div className="container mx-auto mt-8 relative">
        <Card className="max-w-md mx-auto">
          <div className="relative">
            <CardHeader className="text-center">
              <CardTitle>Welcome to Our Bookstore</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p className="text-muted-foreground">
                Please sign in to view your account information
              </p>
              <Button onClick={() => router.push("/login")} className="w-full">
                Go to Login
              </Button>
            </CardContent>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-8 relative">
      <Card>
        <EvervaultCard
          className="absolute w-1/2 h-full right-0 top-0"
          text={
            <img
              className="w-32 h-32 object-cover rounded-full"
              src="/avatar.png"
              alt="avatar"></img>
          }
        />
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Benefits:</strong> 15% discount on all purchases
          </p>
          <Button onClick={handleLogout} className="mt-4">
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
