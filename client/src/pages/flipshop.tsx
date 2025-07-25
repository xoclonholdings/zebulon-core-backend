import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import FlipShop from "@/components/FlipShop";

export default function FlipShopPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <FlipShop />
    </div>
  );
}