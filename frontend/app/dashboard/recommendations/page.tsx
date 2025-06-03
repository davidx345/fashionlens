"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shirt, Clock } from "lucide-react";

export default function RecommendationsPage() {
  return (
    <div className="space-y-8 p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold md:text-3xl">Outfit Recommendations</h1>
          <p className="text-muted-foreground mt-2">
            Discover new outfit ideas tailored for you.
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center text-center py-16 min-h-[400px]">
        <Card className="w-full max-w-md mx-auto shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <Clock className="h-10 w-10 text-muted-foreground" />
            </div>
            <CardTitle className="text-2xl font-semibold">Coming Soon!</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mb-4">
              <Shirt className="w-16 h-16 text-muted-foreground mx-auto mb-3" />
            </div>
            <p className="text-muted-foreground mb-4">
              We're working hard to bring you personalized outfit recommendations. 
              This feature will be available soon!
            </p>
            <p className="text-sm text-muted-foreground">
              In the meantime, try using our outfit analyzer to get insights on your current looks.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
