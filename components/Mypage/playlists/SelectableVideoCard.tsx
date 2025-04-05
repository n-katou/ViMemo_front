import React from "react";
import Image from "next/image";

interface SelectableVideoCardProps {
  video: {
    id: number;
    youtube_id: string;
    title: string;
  };
  selected: boolean;
  onToggle: () => void;
}

const SelectableVideoCard: React.FC<SelectableVideoCardProps> = ({
  video,
  selected,
  onToggle,
}) => {
  return (
    <div
      className={`p-2 border rounded cursor-pointer 
        ${selected ? "border-blue-500 bg-blue-50" : "border-gray-200"}
        w-[160px] sm:w-[180px] md:w-[200px] lg:w-[220px]
      `}
      onClick={onToggle}
    >
      <Image
        src={`https://img.youtube.com/vi/${video.youtube_id}/mqdefault.jpg`}
        alt="Thumbnail"
        width={160}
        height={90}
        className="rounded w-full h-auto"
      />
      <h3 className="text-sm font-semibold mt-2 text-gray-800 truncate whitespace-nowrap overflow-hidden">
        {video.title}
      </h3>
    </div>
  );
};

export default SelectableVideoCard;
