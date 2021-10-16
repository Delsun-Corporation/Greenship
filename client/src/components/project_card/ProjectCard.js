import React from "react";
import { useSelector } from "react-redux";

function ProjectCard({ project }) {
  return (
    <div className="w-full h-32 bg-white flex flex-row p-2 rounded-lg">
      <div className="bg-gray-200 w-1/4 h-full">
        <img
          src={project.project_image}
          alt={project.project_name}
          className="w-full h-full object-cover rounded-lg"
        ></img>
      </div>
      <div className="bg-transparant w-3/4 h-full flex-col flex pl-3">
        <div className="flex flex-row h-1/5">
          <h1 className="font-body font-medium text-coolGrey text-xs w-3/4 h-full align-middle flex items-center">
            {project._id.toString()}
          </h1>
          <div
            className={
              project.project_status.toString().toLowerCase() === "draft"
                ? "bg-antiqueBrass justify-center w-1/4 rounded-lg h-full items-center flex"
                : "bg-maximumBlue justify-center w-1/4 rounded-lg h-full items-center flex"
            }
          >
            <h1 className="font-body font-bold text-white text-xs">{project.project_status}</h1>
          </div>
        </div>
        <div className="flex flex-col h-4/5 pt-2">
            <h1 className="font-body font-bold text-2xl truncate h-1/3">
                {project.project_name}
            </h1>
            <h4 className="font-body font-medium text-sm text-coolGrey h-2/3 w-full overflow-ellipsis overflow-hidden whitespace-nowrap leading-6 pt-2">
                {project.project_desc}
            </h4>
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;
