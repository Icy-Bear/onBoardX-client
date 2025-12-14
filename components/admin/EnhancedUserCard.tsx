"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface EnhancedUserCardProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    image?: string | null;
    createdAt?: Date;
  };
  isCurrentUser?: boolean;
  className?: string;
}

export function EnhancedUserCard({
  user,
  isCurrentUser = false,
  className = "",
}: EnhancedUserCardProps) {
  return (
    <Card
      className={`transition-all duration-200 hover:shadow-md ${isCurrentUser ? "ring-2 ring-primary" : ""
        } ${className}`}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.image ?? undefined} alt={user.name} />
              <AvatarFallback className="text-sm font-medium">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-base truncate flex items-center gap-2">
                {user.name}
                {isCurrentUser && (
                  <Badge
                    variant="outline"
                    className="text-xs border-primary text-primary flex-shrink-0"
                  >
                    You
                  </Badge>
                )}
              </h3>
              <p className="text-sm text-muted-foreground truncate">
                {user.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant={user.role === "admin" ? "default" : "secondary"}
              className="text-xs"
            >
              {user.role}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
