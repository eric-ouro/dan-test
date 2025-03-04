'use client';
import { useEffect } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Index = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to /dashboard when the component mounts
    router.push("/dashboard");
  }, [router]);

  return <>
  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
   <div> {"Welcome to Ouro Dashboard"}</div>
    <div><Button><Link href="/dashboard"> Go to Dashboard</Link></Button></div>
    
  </div>
  </>;
};

export default Index;
