"use client";

import React, { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Project } from "../schemas/project.schema";
import { ProjectCard } from "./project-card";

interface VirtualizedProjectListProps {
  projects: Project[];
}

export function VirtualizedProjectList({ projects }: VirtualizedProjectListProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  // Group items into pairs for a 2-column grid layout in the virtualizer
  const rowCount = Math.ceil(projects.length / 2);

  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 440,
    overscan: 3,
  });

  return (
    <div
      ref={parentRef}
      className="h-[750px] w-full overflow-y-auto pr-2 scrollbar-thin scrollbar-track-zinc-900 scrollbar-thumb-zinc-700"
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const firstIndex = virtualRow.index * 2;
          const secondIndex = firstIndex + 1;
          const firstProject = projects[firstIndex];
          const secondProject = projects[secondIndex];

          return (
            <div
              key={virtualRow.key}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6"
            >
              {firstProject && <ProjectCard project={firstProject} />}
              {secondProject && <ProjectCard project={secondProject} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
