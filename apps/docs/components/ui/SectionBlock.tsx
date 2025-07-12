import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./card";

interface SectionBlockItem {
  title: string;
  description?: string;
}

interface SectionBlockProps {
  title: string;
  description?: string;
  items?: SectionBlockItem[];
  className?: string;
}

export function SectionBlock({
  title,
  description,
  items = [],
  className,
}: SectionBlockProps) {
  return (
    <section data-slot='section-block' className={cn("my-8", className)}>
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          {items.length > 0 && (
            <ul className='list-disc #ist-inside space-y-2'>
              {items.map((item, index) => (
                <li key={index}>
                  <h4 className='font-semibold'>{item.title}</h4>
                  {item.description && (
                    <p className='text-muted-foreground text-sm'>
                      {item.description}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
