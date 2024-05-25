"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { Button } from "./MovingBorder";

type Tab = {
  title: string;
  value: string;
  content: React.ReactNode;
};

export const Tabs = ({
  tabs,
  containerClassName,
  activeTabClassName,
  tabClassName,
  contentClassName,
}: {
  tabs: Tab[];
  containerClassName?: string;
  activeTabClassName?: string;
  tabClassName?: string;
  contentClassName?: string;
}) => {
  const [activeTab, setActiveTab] = useState<Tab>(tabs[0]);

  return (
    <>
      <div className="hidden sm:flex flex-row items-center justify-center [perspective:1000px] relative overflow-auto sm:overflow-visible no-visible-scrollbar max-w-full w-full">
        {tabs.map((tab) => (
          <Button
            key={tab.value}
            onClick={() => setActiveTab(tab)}
            containerClassName={cn("relative px-4 py-2 mx-2 rounded-full", tabClassName)}
            borderClassName={cn("absolute inset-0 bg-blue-500 rounded-full", activeTabClassName)}
            className={cn("relative block")}
            isActive={activeTab.value === tab.value}
          >
            {tab.title}
          </Button>
        ))}
      </div>
      <div className="sm:hidden flex justify-center mt-4">
        <select
          value={activeTab.value}
          onChange={(e) => {
            const selectedTab = tabs.find((tab) => tab.value === e.target.value);
            if (selectedTab) {
              setActiveTab(selectedTab);
            }
          }}
          className="form-select form-select-lg border border-white-300 rounded-md shadow-sm focus:border-white-500 focus:ring focus:ring-white-200 focus:ring-opacity-50"
        // ボーダーのスタイルを追加
        >
          {tabs.map((tab) => (
            <option key={tab.value} value={tab.value}>
              {tab.title}
            </option>
          ))}
        </select>
      </div>
      <div className={cn("mt-4", contentClassName)}>{activeTab.content}</div>
    </>
  );
};
